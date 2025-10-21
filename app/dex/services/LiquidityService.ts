import { Contract, parseUnits, formatUnits, BrowserProvider } from 'ethers';
import { Token, LiquidityPosition } from '../types';
import { ROUTER_ADDRESS, FACTORY_ADDRESS, WETH_ADDRESS } from '../constants';
import { ROUTER_ABI, FACTORY_ABI, PAIR_ABI, ERC20_ABI } from '../contracts/abis';

export class LiquidityService {
  private provider: BrowserProvider;
  private routerContract: Contract;
  private factoryContract: Contract;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
    this.routerContract = new Contract(ROUTER_ADDRESS, ROUTER_ABI, provider);
    this.factoryContract = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  }

  async calculateLiquidityAmounts(
    tokenA: Token,
    tokenB: Token,
    amountA: string,
    inputField: 'A' | 'B'
  ): Promise<string> {
    try {
      if (!amountA || parseFloat(amountA) === 0) return '0';

      const actualTokenA = tokenA.address === '0x0000000000000000000000000000000000000000' 
        ? WETH_ADDRESS 
        : tokenA.address;
      const actualTokenB = tokenB.address === '0x0000000000000000000000000000000000000000'
        ? WETH_ADDRESS
        : tokenB.address;

      const pairAddress = await this.factoryContract.getPair(actualTokenA, actualTokenB);
      
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        // New pair - any ratio is fine
        return '0';
      }

      const pairContract = new Contract(pairAddress, PAIR_ABI, this.provider);
      const reserves = await pairContract.getReserves();
      
      // Determine token order
      const isToken0First = actualTokenA.toLowerCase() < actualTokenB.toLowerCase();
      const reserve0 = isToken0First ? reserves[0] : reserves[1];
      const reserve1 = isToken0First ? reserves[1] : reserves[0];

      if (reserve0.toString() === '0' || reserve1.toString() === '0') {
        return '0'; // No liquidity yet
      }

      if (inputField === 'A') {
        const amountAWei = parseUnits(amountA, tokenA.decimals);
        const amountBWei = (amountAWei * reserve1) / reserve0;
        return formatUnits(amountBWei, tokenB.decimals);
      } else {
        const amountBWei = parseUnits(amountA, tokenB.decimals);
        const amountAWei = (amountBWei * reserve0) / reserve1;
        return formatUnits(amountAWei, tokenA.decimals);
      }
    } catch (error) {
      console.error('Error calculating liquidity amounts:', error);
      return '0';
    }
  }

  async addLiquidity(
    tokenA: Token,
    tokenB: Token,
    amountA: string,
    amountB: string,
    account: string,
    slippage: number = 0.5
  ) {
    const signer = await this.provider.getSigner();
    const routerWithSigner = new Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const amountADesired = parseUnits(amountA, tokenA.decimals);
    const amountBDesired = parseUnits(amountB, tokenB.decimals);
    
    // Calculate minimum amounts with slippage
    const slippageMultiplier = BigInt(Math.floor((100 - slippage) * 100));
    const amountAMin = (amountADesired * slippageMultiplier) / 10000n;
    const amountBMin = (amountBDesired * slippageMultiplier) / 10000n;

    // Handle native token liquidity
    if (tokenA.address === '0x0000000000000000000000000000000000000000' || 
        tokenB.address === '0x0000000000000000000000000000000000000000') {
      const token = tokenA.address === '0x0000000000000000000000000000000000000000' ? tokenB : tokenA;
      const tokenAmount = tokenA.address === '0x0000000000000000000000000000000000000000' ? amountBDesired : amountADesired;
      const ethAmount = tokenA.address === '0x0000000000000000000000000000000000000000' ? amountADesired : amountBDesired;
      const tokenAmountMin = tokenA.address === '0x0000000000000000000000000000000000000000' ? amountBMin : amountAMin;
      const ethAmountMin = tokenA.address === '0x0000000000000000000000000000000000000000' ? amountAMin : amountBMin;

      // Approve token
      await this.approveToken(token, tokenAmount);

      return await routerWithSigner.addLiquidityETH(
        token.address,
        tokenAmount,
        tokenAmountMin,
        ethAmountMin,
        account,
        deadline,
        { value: ethAmount }
      );
    } else {
      // Both are tokens
      await this.approveToken(tokenA, amountADesired);
      await this.approveToken(tokenB, amountBDesired);

      return await routerWithSigner.addLiquidity(
        tokenA.address,
        tokenB.address,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        account,
        deadline
      );
    }
  }

  async removeLiquidity(
    position: LiquidityPosition,
    removePercentage: number,
    account: string
  ) {
    const signer = await this.provider.getSigner();
    const routerWithSigner = new Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
    const pairContract = new Contract(position.pair, PAIR_ABI, signer);
    
    const liquidity = (BigInt(position.balance) * BigInt(removePercentage)) / 100n;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    // Approve pair tokens
    const allowance = await pairContract.allowance(account, ROUTER_ADDRESS);
    if (allowance < liquidity) {
      const approveTx = await pairContract.approve(ROUTER_ADDRESS, liquidity * 2n);
      await approveTx.wait();
    }

    // Check if one token is WETH (native)
    if (position.token0.address === WETH_ADDRESS || position.token1.address === WETH_ADDRESS) {
      const token = position.token0.address === WETH_ADDRESS ? position.token1 : position.token0;
      return await routerWithSigner.removeLiquidityETH(
        token.address,
        liquidity,
        0, // Accept any amount
        0, // Accept any amount
        account,
        deadline
      );
    } else {
      return await routerWithSigner.removeLiquidity(
        position.token0.address,
        position.token1.address,
        liquidity,
        0, // Accept any amount
        0, // Accept any amount
        account,
        deadline
      );
    }
  }

  async getLiquidityPositions(account: string): Promise<LiquidityPosition[]> {
    try {
      const positions: LiquidityPosition[] = [];
      const pairCount = await this.factoryContract.allPairsLength();
      
      // Check recent pairs (limit to last 20 for performance)
      const checkLimit = Math.min(20, Number(pairCount));
      const startIndex = Math.max(0, Number(pairCount) - checkLimit);

      for (let i = startIndex; i < Number(pairCount); i++) {
        const pairAddress = await this.factoryContract.allPairs(i);
        const pairContract = new Contract(pairAddress, PAIR_ABI, this.provider);
        
        const balance = await pairContract.balanceOf(account);
        if (balance > 0n) {
          const [token0Address, token1Address, reserves, totalSupply] = await Promise.all([
            pairContract.token0(),
            pairContract.token1(),
            pairContract.getReserves(),
            pairContract.totalSupply()
          ]);

          // Get token info
          const token0Contract = new Contract(token0Address, ERC20_ABI, this.provider);
          const token1Contract = new Contract(token1Address, ERC20_ABI, this.provider);
          
          const [symbol0, symbol1, decimals0, decimals1] = await Promise.all([
            token0Contract.symbol(),
            token1Contract.symbol(),
            token0Contract.decimals(),
            token1Contract.decimals()
          ]);

          const poolShare = (Number(balance) * 100 / Number(totalSupply)).toFixed(2);
          const token0Deposited = (balance * reserves[0]) / totalSupply;
          const token1Deposited = (balance * reserves[1]) / totalSupply;

          positions.push({
            pair: pairAddress,
            token0: {
              address: token0Address,
              symbol: symbol0,
              name: symbol0,
              decimals: Number(decimals0),
            },
            token1: {
              address: token1Address,
              symbol: symbol1,
              name: symbol1,
              decimals: Number(decimals1),
            },
            balance: balance.toString(),
            totalSupply: totalSupply.toString(),
            reserve0: reserves[0].toString(),
            reserve1: reserves[1].toString(),
            poolShare,
            token0Deposited: formatUnits(token0Deposited, Number(decimals0)),
            token1Deposited: formatUnits(token1Deposited, Number(decimals1))
          });
        }
      }

      return positions;
    } catch (error) {
      console.error('Error loading liquidity positions:', error);
      return [];
    }
  }

  private async approveToken(token: Token, amount: bigint) {
    const signer = await this.provider.getSigner();
    const tokenContract = new Contract(token.address, ERC20_ABI, signer);
    const signerAddress = await signer.getAddress();
    
    const allowance = await tokenContract.allowance(signerAddress, ROUTER_ADDRESS);
    
    if (allowance < amount) {
      const tx = await tokenContract.approve(ROUTER_ADDRESS, amount * 2n);
      await tx.wait();
    }
  }
}