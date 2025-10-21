'use client';

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { mainnet, polygon, base } from 'viem/chains';
import { createConfig } from 'wagmi';

// Suppress Privy's internal key warning - this is a known Privy issue
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Ignore Privy's internal key warnings
    if (
      typeof args[0] === 'string' && 
      args[0].includes('Each child in a list should have a unique "key" prop')
    ) {
      return;
    }
    
    // Ignore empty error objects
    if (
      args.length === 1 && 
      typeof args[0] === 'object' && 
      args[0] !== null && 
      Object.keys(args[0]).length === 0
    ) {
      return;
    }
    
    originalError(...args);
  };
}

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
});

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#4105b6',
        },
        loginMethods: ['wallet'],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </Privy>
  );
}