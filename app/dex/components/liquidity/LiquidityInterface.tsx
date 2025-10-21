'use client';

import { ReactNode } from 'react';

interface LiquidityInterfaceProps {
  activeTab: 'add' | 'remove';
  setActiveTab: (tab: 'add' | 'remove') => void;
  children: ReactNode;
}

export const LiquidityInterface: React.FC<LiquidityInterfaceProps> = ({
  activeTab,
  setActiveTab,
  children
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 bg-black/30 p-1 rounded-xl border border-purple-500/10">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2.5 px-4 rounded-lg transition-all font-medium ${
            activeTab === 'add'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => setActiveTab('remove')}
          className={`flex-1 py-2.5 px-4 rounded-lg transition-all font-medium ${
            activeTab === 'remove'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Remove Liquidity
        </button>
      </div>
      {children}
    </div>
  );
};