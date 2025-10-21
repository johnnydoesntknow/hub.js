'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { BrowserProvider } from 'ethers';
import { useState, useEffect } from 'react';

export const useHubWallet = () => {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  
  const wallet = wallets[0];

  useEffect(() => {
    const setupProvider = async () => {
      if (!wallet) {
        setProvider(null);
        return;
      }

      try {
        const ethereumProvider = await wallet.getEthereumProvider();
        const web3Provider = new BrowserProvider(ethereumProvider as any);
        setProvider(web3Provider);
      } catch (error) {
        console.error('Error setting up provider:', error);
        setProvider(null);
      }
    };

    if (wallet) {
      setupProvider();
    }
  }, [wallet]);

  return {
    isConnected: authenticated && !!wallet,
    address: wallet?.address || null,
    provider, // Now this is BrowserProvider | null, not a Promise
    wallet
  };
};