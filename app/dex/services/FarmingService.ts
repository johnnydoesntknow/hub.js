import { Contract, parseUnits, formatUnits, BrowserProvider } from 'ethers';
import { FarmPool, Token, UserStakeInfo } from '../types';
import { MASTERCHEF_ADDRESS, DEFAULT_TOKENS } from '../constants';
import { MASTERCHEF_ABI, ERC20_ABI, PAIR_ABI } from '../contracts/abis';

export class FarmingService {
  private provider: BrowserProvider;
  private masterChefContract: Contract;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
    this.masterChefContract = new Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, provider);
  }

  async getFarmPools(): Promise<FarmPool[]> {
    try {
      const poolLength = await this.masterChefContract.poolLength();
      const pools: FarmPool[] = [];

      for (let i = 0; i < Number(poolLength); i++) {
        const pool = await this.getFarmPool(i);
        if (pool) pools.push(pool);
      }

      return pools;
    } catch (error) {
      console.error('Error loading farm pools:', error);
      return [];
    }
  }

  private async getFarmPool(poolId: number): Promise<FarmPool | null> {
    try {
      const poolInfo = await this.masterChefContract.poolInfo(poolId);
      const lpToken = poolInfo.lpToken;
      
      // Get LP token info
      const pairContract = new Contract(lpToken, PAIR_ABI, this.provider);
      const [token0Address, token1Address] = await Promise.all([
        pairContract.token0(),
        pairContract.token1()
      ]);

      // Get token details (simplified - you'd fetch from contracts)
      const token0 = DEFAULT_TOKENS.find(t => t.address.toLowerCase() === token0Address.toLowerCase()) || {
        address: token0Address,
        symbol: 'Unknown',
        name: 'Unknown',
        decimals: 18
      };

      const token1 = DEFAULT_TOKENS.find(t => t.address.toLowerCase() === token1Address.toLowerCase()) || {
        address: token1Address,
        symbol: 'Unknown',
        name: 'Unknown',
        decimals: 18
      };

      // Mock reward token (should get from contract)
      const rewardToken = DEFAULT_TOKENS[0]; // OPN

      // Calculate APR (simplified)
      const rewardsPerBlock = await this.masterChefContract.rewardPerBlock();
      const blocksPerDay = 28800; // Approximate
      const rewardsPerDay = formatUnits(rewardsPerBlock * BigInt(blocksPerDay), 18);
      
      // Mock total staked and APR
      const totalStaked = "10000"; // Would calculate from actual staked amounts
      const apr = "150"; // Would calculate from rewards vs staked value

      return {
        poolId,
        lpToken,
        token0,
        token1,
        rewardToken,
        totalStaked,
        rewardsPerDay,
        apr,
        depositFee: Number(poolInfo.depositFee) / 100
      };
    } catch (error) {
      console.error('Error loading farm pool:', error);
      return null;
    }
  }

  async getUserStakeInfo(poolId: number, account: string): Promise<UserStakeInfo> {
    try {
      const userInfo = await this.masterChefContract.userInfo(poolId, account);
      return {
        amount: formatUnits(userInfo.amount, 18),
        rewardDebt: formatUnits(userInfo.rewardDebt, 18)
      };
    } catch (error) {
      console.error('Error loading user stake info:', error);
      return { amount: '0', rewardDebt: '0' };
    }
  }

  async getPendingRewards(poolId: number, account: string): Promise<string> {
    try {
      const pending = await this.masterChefContract.pendingReward(poolId, account);
      return formatUnits(pending, 18);
    } catch (error) {
      console.error('Error loading pending rewards:', error);
      return '0';
    }
  }

  async stake(poolId: number, amount: string) {
    const signer = await this.provider.getSigner();
    const masterChefWithSigner = new Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, signer);
    
    const amountWei = parseUnits(amount, 18);
    
    // First approve LP tokens
    const poolInfo = await this.masterChefContract.poolInfo(poolId);
    const lpContract = new Contract(poolInfo.lpToken, ERC20_ABI, signer);
    const allowance = await lpContract.allowance(await signer.getAddress(), MASTERCHEF_ADDRESS);
    
    if (allowance < amountWei) {
      const approveTx = await lpContract.approve(MASTERCHEF_ADDRESS, amountWei * 2n);
      await approveTx.wait();
    }
    
    return await masterChefWithSigner.deposit(poolId, amountWei);
  }

  async unstake(poolId: number, amount: string) {
    const signer = await this.provider.getSigner();
    const masterChefWithSigner = new Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, signer);
    
    const amountWei = parseUnits(amount, 18);
    return await masterChefWithSigner.withdraw(poolId, amountWei);
  }

  async harvest(poolId: number) {
    const signer = await this.provider.getSigner();
    const masterChefWithSigner = new Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, signer);
    
    // Deposit 0 to trigger harvest
    return await masterChefWithSigner.deposit(poolId, 0);
  }
}