export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
}

export type TabType = 'swap' | 'liquidity' | 'pools' | 'farm';
export type LiquidityTabType = 'add' | 'remove';

export interface LiquidityPosition {
  pair: string;
  token0: Token;
  token1: Token;
  balance: string;
  totalSupply: string;
  reserve0: string;
  reserve1: string;
  poolShare: string;
  token0Deposited: string;
  token1Deposited: string;
}

export interface PoolInfo {
  pair: string;
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  tvl: string;
  volume24h: string;
  apr: string;
}

export interface FarmPool {
  poolId: number;
  lpToken: string;
  token0: Token;
  token1: Token;
  rewardToken: Token;
  totalStaked: string;
  rewardsPerDay: string;
  apr: string;
  depositFee?: number;
}

export interface UserStakeInfo {
  amount: string;
  rewardDebt: string;
}