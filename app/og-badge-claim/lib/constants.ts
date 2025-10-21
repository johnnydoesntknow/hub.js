import type { BadgeEnv, ChainConfig } from '../types';

// Build chain configuration from environment variables
// NO HARDCODED VALUES - Everything comes from .env.local
export const BADGE_CHAIN: ChainConfig = {
  id: parseInt(process.env.NEXT_PUBLIC_BADGE_CHAIN_ID || '11155111'),
  name: process.env.NEXT_PUBLIC_BADGE_CHAIN_NAME || 'Sepolia',
  network: process.env.NEXT_PUBLIC_BADGE_CHAIN_NAME?.toLowerCase().replace(/\s+/g, '-') || 'sepolia',
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_NAME || 'Sepolia ETH',
    symbol: process.env.NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_SYMBOL || 'ETH',
    decimals: parseInt(process.env.NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_DECIMALS || '18'),
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BADGE_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BADGE_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    default: {
      name: process.env.NEXT_PUBLIC_BADGE_BLOCK_EXPLORER_NAME || 'Etherscan Sepolia',
      url: process.env.NEXT_PUBLIC_BADGE_BLOCK_EXPLORER_URL || 'https://sepolia.etherscan.io',
    },
  },
  testnet: process.env.NEXT_PUBLIC_BADGE_IS_TESTNET === 'true',
};

export const BADGE_ENV: BadgeEnv = {
  VIDEO_URL: process.env.NEXT_PUBLIC_BADGE_VIDEO_URL || '/videos/video.mp4',
  CONTRACT_ADDRESS: (process.env.NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS as `0x${string}`) || '0xfea4962CBd4ed58642F6194902d928ddF57fCc32',
  METADATA_URI: process.env.NEXT_PUBLIC_NFT_METADATA_URI || '',
  IMAGE_URI: process.env.NEXT_PUBLIC_NFT_IMAGE_URI || '',
  METADATA_GATEWAY: process.env.NEXT_PUBLIC_NFT_METADATA_GATEWAY || '',
  IMAGE_GATEWAY: process.env.NEXT_PUBLIC_NFT_IMAGE_GATEWAY || '',
};

// Smart contract ABI - same across all networks
export const OG_BADGE_ABI = [
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimOpen',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const CONTRACT_ERRORS: Record<string, string> = {
  AlreadyClaimed: 'You have already claimed your OG Badge',
  ClaimClosed: 'Claiming is not open yet. Please check back later',
  Soulbound: 'This badge is soulbound and cannot be transferred',
};

// Debug info (remove in production)
if (typeof window !== 'undefined') {
  console.log('🔗 Badge Chain Configuration:', {
    chainId: BADGE_CHAIN.id,
    chainName: BADGE_CHAIN.name,
    rpcUrl: BADGE_CHAIN.rpcUrls.default.http[0],
    contract: BADGE_ENV.CONTRACT_ADDRESS,
    testnet: BADGE_CHAIN.testnet,
  });
}