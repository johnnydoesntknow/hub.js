'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { dapps, getCategoryName, getDAppsByCategory, DApp } from '@/lib/dapps';

interface SidebarProps {
  onDAppClick: (DApp: DApp) => void;
}

export default function Sidebar({ onDAppClick }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
                    {categoryDapps.map((dapp) => (
                      <button
                        key={dapp.id}
                        onClick={() => {
                          onDAppClick(dapp);
                          setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 dark:hover:border dark:hover:border-indigo-500/30 transition-all text-left ${
                          !isOpen && 'justify-center'
                        }`}
                        title={!isOpen ? dapp.name : ''}
                      >
                        <span className="text-xl">{dapp.icon}</span>
                        {isOpen && (
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-iopn-navy dark:text-white truncate">
                              {dapp.name}
                            </div>
                            {dapp.status === 'coming-soon' && (
                              <div className="text-xs text-gray-400 dark:text-gray-500">Coming Soon</div>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
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