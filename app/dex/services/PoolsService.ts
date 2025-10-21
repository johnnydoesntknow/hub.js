import { Contract, formatUnits, BrowserProvider } from 'ethers';
import { PoolInfo, Token } from '../types';
import { FACTORY_ADDRESS, WETH_ADDRESS, DEFAULT_TOKENS } from '../constants';
import { FACTORY_ABI, PAIR_ABI, ERC20_ABI } from '../contracts/abis';

export class PoolsService {
  private provider: BrowserProvider;
  private factoryContract: Contract;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
    this.factoryContract = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  }

  async getAllPools(): Promise<PoolInfo[]> {
    try {
      const pools: PoolInfo[] = [];
      const pairCount = await this.factoryContract.allPairsLength();
      
      // Limit to last 20 pairs for performance
      const limit = Math.min(20, Number(pairCount));
      const startIndex = Math.max(0, Number(pairCount) - limit);

      for (let i = startIndex; i < Number(pairCount); i++) {
        const pairAddress = await this.factoryContract.allPairs(i);
        const poolInfo = await this.getPoolInfo(pairAddress);
        if (poolInfo) {
          pools.push(poolInfo);
        }
      }

      return pools;
    } catch (error) {
      console.error('Error loading pools:', error);
      return [];
    }
  }

  private async getPoolInfo(pairAddress: string): Promise<PoolInfo | null> {
    try {
      const pairContract = new Contract(pairAddress, PAIR_ABI, this.provider);
      
      const [token0Address, token1Address, reserves, totalSupply] = await Promise.all([
        pairContract.token0(),
        pairContract.token1(),
        pairContract.getReserves(),
        pairContract.totalSupply()
      ]);

      // Get token details
      const token0 = await this.getTokenInfo(token0Address);
      const token1 = await this.getTokenInfo(token1Address);

      if (!token0 || !token1) return null;

      // Calculate TVL (simplified - you'd normally get prices from an oracle)
      const reserve0Formatted = formatUnits(reserves[0], token0.decimals);
      const reserve1Formatted = formatUnits(reserves[1], token1.decimals);
      
      // Mock TVL calculation (in production, multiply by USD prices)
      const tvl = (parseFloat(reserve0Formatted) + parseFloat(reserve1Formatted)).toString();
      
      // Mock 24h volume and APR (in production, get from events/subgraph)
      const volume24h = (parseFloat(tvl) * 0.1).toString(); // Mock 10% of TVL as daily volume
      const apr = ((parseFloat(volume24h) * 365 * 0.003) / parseFloat(tvl) * 100).toFixed(2); // Mock APR calculation

      return {
        pair: pairAddress,
        token0,
        token1,
        reserve0: reserve0Formatted,
        reserve1: reserve1Formatted,
        totalSupply: formatUnits(totalSupply, 18),
        tvl,
        volume24h,
        apr
      };
    } catch (error) {
      console.error('Error loading pool info:', error);
      return null;
    }
  }

  private async getTokenInfo(address: string): Promise<Token | null> {
    try {
      // Check if it's a known token
      const knownToken = DEFAULT_TOKENS.find(t => 
        t.address.toLowerCase() === address.toLowerCase()
      );
      
      if (knownToken) {
        return knownToken;
      }

      // If it's WETH, return as OPN
      if (address.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
        return DEFAULT_TOKENS[0]; // OPN
      }

      // Otherwise, fetch token info from contract
      const tokenContract = new Contract(address, ERC20_ABI, this.provider);
      const [symbol, name, decimals] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.name(),
        tokenContract.decimals()
      ]);

      return {
        address,
        symbol,
        name,
        decimals: Number(decimals),
        logoURI: undefined
      };
    } catch (error) {
      console.error('Error loading token info:', error);
      return null;
    }
  }
}