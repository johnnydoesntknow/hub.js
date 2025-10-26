'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { dapps, getCategoryName, getDAppsByCategory, DApp } from '@/lib/dapps';

interface SidebarProps {
  onDAppClick: (DApp: DApp) => void;
  currentDapp?: string; // Add this to track current active page
}

// Get two-letter abbreviation for each dapp
const getAbbreviation = (dappName: string): string => {
  const abbreviations: { [key: string]: string } = {
    'OPN Hub': 'OH',
    'Rep Dashboard': 'RD',
    'Tokenization Platform': 'TP',
    'IOPN DEX': 'ID',
    'Airdropper': 'AD',
    'Digital Durhams': 'DD',
    'Learn IOPn': 'LI',
    'OG Badge': 'OG'
  };
  return abbreviations[dappName] || dappName.slice(0, 2).toUpperCase();
};

// Simple Dot Component (no animation)
const StatusDot: React.FC<{
  dapp: DApp;
  isActive: boolean;
  isHovered: boolean;
  size?: 'small' | 'normal';
}> = ({ dapp, isActive, isHovered, size = 'normal' }) => {
  // Determine dot color based on status
  const getDotColor = () => {
    if (isActive) {
      // Active page - bright purple
      return 'bg-purple-500';
    } else if (dapp.status === 'coming-soon') {
      // Coming soon - gray
      return 'bg-gray-600';
    } else {
      // Inactive but available - dim purple
      return 'bg-purple-500/30';
    }
  };

  const sizeClasses = size === 'small' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div 
      className={`
        rounded-full transition-all duration-200
        ${getDotColor()}
        ${sizeClasses}
        ${isHovered ? 'ring-2 ring-purple-500/30 ring-offset-1 ring-offset-slate-900' : ''}
      `}
    />
  );
};

export default function Sidebar({ onDAppClick, currentDapp = 'OPN Hub' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredDapp, setHoveredDapp] = useState<string | null>(null);

  const categories: Array<DApp['category']> = ['dashboards', 'real-world-assets', 'opn-chain'];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6 text-iopn-navy dark:text-white" />
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl border-r border-gray-100 dark:border-white/10 transition-all duration-300 z-50 flex-shrink-0
          ${isOpen ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:block absolute -right-3 top-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/20 rounded-full p-1 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors z-10"
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Sidebar Content */}
        <div className="p-6 h-full overflow-y-auto">
          {/* Logo */}
          <div className="mb-8">
            {isOpen ? (
              <h2 className="text-xl font-bold text-iopn-navy dark:text-white">IOPn</h2>
            ) : (
              <div className="w-full flex justify-center">
                <img 
                  src="/5.png" 
                  alt="IOPn Logo" 
                  className="w-8 h-8 dark:hidden"
                />
                <img 
                  src="/6.png" 
                  alt="IOPn Logo" 
                  className="w-8 h-8 hidden dark:block"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-6">
            {categories.map((category) => {
              const categoryDapps = getDAppsByCategory(category);
              return (
                <div key={category}>
                  {/* Category Header */}
                  {isOpen && (
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {getCategoryName(category)}
                    </h3>
                  )}

                  {/* Category Items */}
                  <div className="space-y-1">
                    {categoryDapps.map((dapp) => {
                      const isActive = currentDapp === dapp.name;
                      
                      return (
                        <button
                          key={dapp.id}
                          onClick={() => {
                            onDAppClick(dapp);
                            setIsMobileOpen(false);
                          }}
                          onMouseEnter={() => setHoveredDapp(dapp.id)}
                          onMouseLeave={() => setHoveredDapp(null)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg 
                            hover:bg-gray-50 dark:hover:bg-slate-800/50 
                            transition-all text-left
                            ${!isOpen && 'justify-center'}
                            ${isActive ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                          `}
                          title={!isOpen ? dapp.name : ''}
                        >
                          {isOpen ? (
                            // Expanded state - dot with name
                            <>
                              <div className="flex items-center justify-center w-5">
                                <StatusDot 
                                  dapp={dapp} 
                                  isActive={isActive}
                                  isHovered={hoveredDapp === dapp.id} 
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate ${
                                  isActive 
                                    ? 'text-purple-600 dark:text-purple-400' 
                                    : 'text-iopn-navy dark:text-white'
                                }`}>
                                  {dapp.name}
                                </div>
                                {dapp.status === 'coming-soon' && (
                                  <div className="text-xs text-gray-400 dark:text-gray-500">
                                    Coming Soon
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            // Collapsed state - dot with 2-letter abbreviation
                            <div className="flex flex-col items-center gap-1">
                              <StatusDot 
                                dapp={dapp} 
                                isActive={isActive}
                                isHovered={hoveredDapp === dapp.id}
                                size="small"
                              />
                              <span className={`text-xs font-medium ${
                                isActive 
                                  ? 'text-purple-600 dark:text-purple-400' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {getAbbreviation(dapp.name)}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}