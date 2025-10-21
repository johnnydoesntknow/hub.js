import { Contract, parseUnits, formatUnits, BrowserProvider } from 'ethers';
import { Token } from '../types';
import { ROUTER_ADDRESS, FACTORY_ADDRESS, WETH_ADDRESS } from '../constants';
import { ROUTER_ABI, FACTORY_ABI, PAIR_ABI, ERC20_ABI } from '../contracts/abis';

export class SwapService {
  private provider: BrowserProvider;
  private routerContract: Contract;
  private factoryContract: Contract;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
    this.routerContract = new Contract(ROUTER_ADDRESS, ROUTER_ABI, provider);
    this.factoryContract = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  }

  async calculateSwapOutput(
    fromToken: Token,
    toToken: Token,
    amountIn: string
  ): Promise<string> {
    try {
      if (!amountIn || parseFloat(amountIn) === 0) return '0';

      const path = this.getPath(fromToken, toToken);
      const amountInWei = parseUnits(amountIn, fromToken.decimals);

      const amounts = await this.routerContract.getAmountsOut(amountInWei, path);
      const amountOut = amounts[amounts.length - 1];

      return formatUnits(amountOut, toToken.decimals);
    } catch (error) {
      console.error('Error calculating swap output:', error);
      return '0';
    }
  }

  async executeSwap(
    fromToken: Token,
    toToken: Token,
    amountIn: string,
    amountOutMin: string,
    recipient: string,
    slippageTolerance: number = 0.5
  ) {
    const signer = await this.provider.getSigner();
    const routerWithSigner = new Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
    
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
    const path = this.getPath(fromToken, toToken);
    
    const amountInWei = parseUnits(amountIn, fromToken.decimals);
    const expectedOut = parseUnits(amountOutMin, toToken.decimals);
    const minAmountOut = expectedOut * BigInt(Math.floor((100 - slippageTolerance) * 100)) / 10000n;

    // Handle native token swaps
    if (fromToken.address === '0x0000000000000000000000000000000000000000') {
      // Swap ETH for tokens
      return await routerWithSigner.swapExactETHForTokens(
        minAmountOut,
        path,
        recipient,
        deadline,
        { value: amountInWei }
      );
    } else if (toToken.address === '0x0000000000000000000000000000000000000000') {
      // Swap tokens for ETH
      await this.approveToken(fromToken, amountInWei);
      return await routerWithSigner.swapExactTokensForETH(
        amountInWei,
        minAmountOut,
        path,
        recipient,
        deadline
      );
    } else {
      // Swap tokens for tokens
      await this.approveToken(fromToken, amountInWei);
      return await routerWithSigner.swapExactTokensForTokens(
        amountInWei,
        minAmountOut,
        path,
        recipient,
        deadline
      );
    }
  }

  private async approveToken(token: Token, amount: bigint) {
    const signer = await this.provider.getSigner();
    const tokenContract = new Contract(token.address, ERC20_ABI, signer);
    const signerAddress = await signer.getAddress();
    
    const allowance = await tokenContract.allowance(signerAddress, ROUTER_ADDRESS);
    
    if (allowance < amount) {
      const tx = await tokenContract.approve(ROUTER_ADDRESS, amount * 2n); // Approve double for future swaps
      await tx.wait();
    }
  }

  private getPath(fromToken: Token, toToken: Token): string[] {
    const fromAddress = fromToken.address === '0x0000000000000000000000000000000000000000' 
      ? WETH_ADDRESS 
      : fromToken.address;
    const toAddress = toToken.address === '0x0000000000000000000000000000000000000000'
      ? WETH_ADDRESS
      : toToken.address;
    
    return [fromAddress, toAddress];
  }

  async getPairInfo(token0: Token, token1: Token) {
    try {
      const token0Address = token0.address === '0x0000000000000000000000000000000000000000' 
        ? WETH_ADDRESS 
        : token0.address;
      const token1Address = token1.address === '0x0000000000000000000000000000000000000000'
        ? WETH_ADDRESS
        : token1.address;

      const pairAddress = await this.factoryContract.getPair(token0Address, token1Address);
      
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        return null;
      }

      const pairContract = new Contract(pairAddress, PAIR_ABI, this.provider);
      const [reserves, totalSupply] = await Promise.all([
        pairContract.getReserves(),
        pairContract.totalSupply()
      ]);

      return {
        pairAddress,
        reserve0: reserves[0].toString(),
        reserve1: reserves[1].toString(),
        totalSupply: totalSupply.toString()
      };
    } catch (error) {
      console.error('Error getting pair info:', error);
      return null;
    }
  }
}