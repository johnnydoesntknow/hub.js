'use client';

import { useWallets } from '@privy-io/react-auth';
import type { WalletContextType } from '../types';

/**
 * Adapter hook to interface with your Hub's wallet provider
 * This uses Privy's useWallets - adjust if your Hub uses a different wallet system
 */
export function useWallet(): WalletContextType & { 
  wallet: any;
  isLoading: boolean;
} {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  return {
    address: wallet?.address as `0x${string}` | undefined,
    isConnected: !!wallet?.address,
    chainId: wallet?.chainId ? Number(wallet.chainId) : undefined,
    wallet,
    isLoading: false,
    
    switchChain: async (chainId: number) => {
      if (wallet) {
        await wallet.switchChain(chainId);
      }
    },
    
    getEthereumProvider: async () => {
      if (wallet) {
        return await wallet.getEthereumProvider();
      }
      throw new Error('No wallet connected');
    },
  };
}