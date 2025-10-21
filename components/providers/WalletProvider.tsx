'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  login: () => void;
  logout: () => void;
  wallets: any[];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();

  const value: WalletContextType = {
    isConnected: ready && authenticated,
    address: wallets[0]?.address || user?.wallet?.address || null,
    login,
    logout,
    wallets,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}