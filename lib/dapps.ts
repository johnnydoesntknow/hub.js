export interface DApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'dashboards' | 'real-world-assets' | 'opn-chain';
  url: string;
  status: 'live' | 'coming-soon';
}

export const dapps: DApp[] = [
  // Dashboards
  {
    id: 'opn-hub',
    name: 'OPN Hub',
    description: 'Your central gateway to the IOPn ecosystem. Access all decentralized applications from one unified interface.',
    icon: '🏠',
    category: 'dashboards',
    url: '/hub',
    status: 'live',
  },
  {
    id: 'rep-dash',
    name: 'Rep Dashboard',
    description: 'Track and manage your reputation points across the IOPn ecosystem. View your activity, contributions, and earned rewards.',
    icon: '📊',
    category: 'dashboards',
    url: '/dapps/rep-dashboard',
    status: 'coming-soon',
  },
  // Real World Assets
  {
    id: 'tokenization-platform',
    name: 'Tokenization Platform',
    description: 'Tokenize real-world assets including property, commodities, and strategic investments. Smart contracts automate ownership and enable fractional investment.',
    icon: '🏢',
    category: 'real-world-assets',
    url: '/dapps/tokenization-platform',
    status: 'coming-soon',
  },
  // OPN Chain
  {
  id: 'dex',
  name: 'IOPN DEX',
  description: 'Swap tokens, provide liquidity, and earn rewards on the decentralized exchange',
  icon: '💱',
  url: '/dex',
  category: 'opn-chain',
  status: 'live',
},
  {
    id: 'airdropper',
    name: 'Airdropper',
    description: 'Distribute tokens efficiently to multiple wallets. Perfect for airdrops, rewards distribution, and community engagement.',
    icon: '🪂',
    category: 'opn-chain',
    url: '/dapps/airdropper',
    status: 'coming-soon',
  },
  {
    id: 'digital-durhams',
    name: 'Digital Durhams',
    description: 'Exclusive NFT collection on the OPN Chain. Collect, trade, and showcase your Digital Durham NFTs.',
    icon: '🎨',
    category: 'opn-chain',
    url: '/dapps/digital-durhams',
    status: 'coming-soon',
  },
  {
    id: 'learn-iopn',
    name: 'Learn IOPn',
    description: 'Educational resources and documentation for the IOPn ecosystem. Learn about blockchain, sovereignty, and decentralized applications.',
    icon: '📚',
    category: 'opn-chain',
    url: '/dapps/learn-iopn',
    status: 'coming-soon',
  },
  {
    id: 'og-badge-claim',
    name: 'OG Badge',
    description: 'Claim your exclusive OPN Chain OG Badge - a soulbound NFT proving your early support',
    icon: '🏅', // or use any emoji/icon you prefer
    url: '/og-badge-claim',
    category: 'opn-chain',
    status: 'live', // or 'coming-soon' if not ready yet
  },
];

export const getCategoryName = (category: DApp['category']): string => {
  const names = {
    'dashboards': 'Dashboards',
    'real-world-assets': 'Real World Assets',
    'opn-chain': 'OPN Chain',
  };
  return names[category];
};

export const getDAppsByCategory = (category: DApp['category']): DApp[] => {
  return dapps.filter(dapp => dapp.category === category);
};