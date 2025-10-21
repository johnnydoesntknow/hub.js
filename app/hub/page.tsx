'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/providers/WalletProvider';
import Sidebar from '@/components/Sidebar';
import DappModal from '@/components/DappModal';
import PortfolioCard from '@/components/PortfolioCard';
import LineGraph from '@/components/LineGraph';
import { getMockRepPoints, getMockOPNBalance, getMockBadges, getMockNFTs, getMockGraphData } from '@/lib/mockData';
import { DApp } from '@/lib/dapps';
import ThemeToggle from '@/components/ThemeToggle';

export default function HubPage() {
  const { isConnected, address, logout } = useWallet();
  const router = useRouter();
  const [selectedDapp, setSelectedDapp] = useState<DApp | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default sidebar width

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  useEffect(() => {
    // Track sidebar width changes
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth);
      }
    };

    // Initial width
    updateSidebarWidth();

    // Listen for transitions
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      sidebar.addEventListener('transitionend', updateSidebarWidth);
    }

    // Cleanup
    return () => {
      if (sidebar) {
        sidebar.removeEventListener('transitionend', updateSidebarWidth);
      }
    };
  }, []);

  if (!isConnected) {
    return null;
  }

  const repPoints = getMockRepPoints();
  const opnBalance = getMockOPNBalance();
  const badges = getMockBadges();
  const nfts = getMockNFTs();
  const graphData = getMockGraphData();

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 flex">
      {/* Background Logo - Fixed to viewport, follows scroll, adjusts for sidebar */}
      <div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 transition-all duration-300"
        style={{ 
          left: `${sidebarWidth}px`,
        }}
      >
        <img 
          src="/5.png" 
          alt="" 
          className="dark:hidden w-[1000px] h-[1000px] opacity-[0.07]"
        />
        <img 
          src="/6.png" 
          alt="" 
          className="hidden dark:block w-[1000px] h-[1000px] opacity-[0.05]"
        />
      </div>

      {/* Sidebar */}
      <Sidebar onDAppClick={(dapp) => setSelectedDapp(dapp)} />

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-x-hidden relative z-10">
        {/* Header */}
        <header className="border-b border-gray-100 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 dark:backdrop-blur-sm sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex justify-between items-center">
            <div className="text-xl lg:text-2xl font-bold text-iopn-navy dark:text-white ml-12 lg:ml-0">OPN Hub</div>
            <div className="flex items-center gap-3 lg:gap-6">
              <ThemeToggle />
              <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={logout}
                className="px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-iopn-navy dark:hover:text-white transition-colors whitespace-nowrap"
              >
                Disconnect
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 lg:px-8 py-6 lg:py-12">      
          {/* Welcome Section */}
          <div className="mb-6 lg:mb-12">
            <h1 className="text-2xl lg:text-3xl font-light text-iopn-navy dark:text-white mb-2">
              Portfolio Overview
            </h1>
            <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">Manage your IOPn ecosystem assets</p>
          </div>

          {/* Stats Grid - Responsive with better breakpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-12">
            <PortfolioCard title="REP Points" delay={0.1}>
              <div className="text-3xl lg:text-4xl font-light text-iopn-navy dark:text-white mb-2">
                {repPoints.total}
              </div>
              <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{repPoints.change}</div>
            </PortfolioCard>

            <PortfolioCard title="$OPN Balance" delay={0.2}>
              <div className="text-3xl lg:text-4xl font-light text-iopn-navy dark:text-white mb-2">
                {opnBalance.balance}
              </div>
              <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{opnBalance.usdValue}</div>
            </PortfolioCard>

            <PortfolioCard title="Badges" delay={0.3}>
              <div className="text-3xl lg:text-4xl font-light text-iopn-navy dark:text-white mb-2">
                {badges.length}
              </div>
              <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Earned</div>
            </PortfolioCard>

            <PortfolioCard title="Origin NFTs" delay={0.4}>
              <div className="text-3xl lg:text-4xl font-light text-iopn-navy dark:text-white mb-2">
                {nfts.length}
              </div>
              <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Owned</div>
            </PortfolioCard>
          </div>

          {/* Performance Graph */}
          <div className="mb-6 lg:mb-12">
            <PortfolioCard title="OPN Chart" delay={0.5}>
              <LineGraph data={graphData} />
            </PortfolioCard>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            {/* Badges */}
            <PortfolioCard title="Your Badges" delay={0.6}>
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex justify-center">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform">
                      <img 
                        src={badge.image} 
                        alt="Badge"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </PortfolioCard>

            {/* NFTs */}
            <PortfolioCard title="Origin NFTs" delay={0.7}>
              <div className="grid grid-cols-2 gap-4">
                {nfts.map((nft) => (
                  <div key={nft.id} className="flex justify-center">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform">
                      <img 
                        src={nft.image} 
                        alt="NFT"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </PortfolioCard>
          </div>
        </main>
      </div>

      {/* DApp Modal */}
      <DappModal dapp={selectedDapp} onClose={() => setSelectedDapp(null)} />
    </div>
  );
}