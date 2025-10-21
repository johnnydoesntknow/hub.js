import { Token } from '../types';

// Contract addresses
export const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS || '';
export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '';
export const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS || '';
export const MASTERCHEF_ADDRESS = process.env.NEXT_PUBLIC_MASTERCHEF_ADDRESS || '';

// Default tokens
export const DEFAULT_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'OPN',
    name: 'OPNToken',
    decimals: 18,
    logoURI: 'https://i.ibb.co/dN1sMhw/logo.jpg'
  },
  {
    address: WETH_ADDRESS,
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