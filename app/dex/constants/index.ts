import { Token } from '../types';

// ============================================
// NETWORK DETECTION
// ============================================
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111');
const IS_SEPOLIA = CHAIN_ID === 11155111;
// const IS_OPN = CHAIN_ID === YOUR_OPN_CHAIN_ID; // Uncomment and update for OPN

// ============================================
// CONTRACT ADDRESSES
// ============================================
export const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS || '';
export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '';
export const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS || '';
export const MASTERCHEF_ADDRESS = process.env.NEXT_PUBLIC_MASTERCHEF_ADDRESS || '';

// ============================================
// TOKEN CONFIGURATIONS
// ============================================

// SEPOLIA TEST TOKENS (ACTIVE)
const SEPOLIA_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
  },
  {
    address: WETH_ADDRESS || '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  },
  {
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  },
  {
    address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', // USDT on Sepolia
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
  },
  {
    address: process.env.NEXT_PUBLIC_DAI_ADDRESS || '',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  }
];

// OPN MAINNET TOKENS (COMMENTED OUT - READY FOR PRODUCTION)
/*
const OPN_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'OPN',
    name: 'OPNToken',
    decimals: 18,
    logoURI: 'https://i.ibb.co/dN1sMhw/logo.jpg'
  },
  {
    address: WETH_ADDRESS, // This will be Wrapped OPN address
    symbol: 'wOPN',
    name: 'Wrapped OPN',
    decimals: 18,
    logoURI: 'https://i.ibb.co/dN1sMhw/logo.jpg'
  },
  {
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS || '',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  },
  {
    address: '0x9E658306A5B4781200BbA23D3452A4f8063ab126',
    symbol: 'OPNM',
    name: 'OPNmeme',
    decimals: 18,
    logoURI: 'https://i.ibb.co/35GkCNMp/OPNMEME.png'
  },
  {
    address: process.env.NEXT_PUBLIC_DAI_ADDRESS || '',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  }
];
*/

// ============================================
// EXPORT TOKENS BASED ON NETWORK
// ============================================
export const DEFAULT_TOKENS: Token[] = IS_SEPOLIA ? SEPOLIA_TOKENS : SEPOLIA_TOKENS;
// When ready for OPN, change to:
// export const DEFAULT_TOKENS: Token[] = IS_OPN ? OPN_TOKENS : SEPOLIA_TOKENS;

// ============================================
// NETWORK INFO
// ============================================
export const NETWORK_INFO = {
  chainId: CHAIN_ID,
  name: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Sepolia Testnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  explorer: IS_SEPOLIA 
    ? 'https://sepolia.etherscan.io' 
    : 'https://opn-explorer.com', // Update with actual OPN explorer
  nativeCurrency: {
    name: IS_SEPOLIA ? 'ETH' : 'OPN',
    symbol: IS_SEPOLIA ? 'ETH' : 'OPN',
    decimals: 18
  }
};