'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BADGE_CHAIN } from '../lib/constants';
import { checkClaimStatus, claimBadge } from '../lib/contract';
import { useWallet } from '../hooks/useWallet';
import AnimatedBackground from './AnimatedBackground';
import type { BadgePage } from '../types';

interface ClaimPageProps {
  onNavigate: (page: BadgePage) => void;
}

function LearnMoreModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-purple-950/90 to-black border border-purple-500/30 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <button
            onClick={onClose}
            className="float-right text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl sm:text-3xl font-extralight text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              About OPN Chain
            </span>
          </h2>
          
          <div className="space-y-4 sm:space-y-6 text-gray-300 text-sm sm:text-base">
            <div>
              <h3 className="text-lg sm:text-xl text-purple-400 mb-2">What is OPN Chain?</h3>
              <p className="leading-relaxed">
                OPN Chain is the infrastructure layer of the IOPn ecosystem. It's a sovereign Layer 1 blockchain 
                built using Cosmos SDK and fully EVM-compatible, providing scalability, upgradeability, and full 
                composability for decentralized applications.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl text-purple-400 mb-2">Why OPN Chain Exists</h3>
              <ul className="space-y-2 ml-2 sm:ml-4">
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Give OPN Chain users full control over its infrastructure without reliance on Ethereum gas fees or upgrade cycles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Empowers the IOPn ecosystem with sovereign infrastructure, enabling true decentralization and user ownership</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Support future expansion into DeFi, DePin, and enterprise apps without scaling concerns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  <span>Power true sovereignty for every project built on OPN Chain</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-3 sm:pt-4 border-t border-purple-800/30">
              <p className="text-xs sm:text-sm text-gray-400">
                The foundation on which decentralized apps, smart contracts, infrastructure, token mechanics, 
                and inter-chain value movement are built.
              </p>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClaimPage({ onNavigate }: ClaimPageProps) {
  const { address, wallet, isConnected } = useWallet();
  const [claiming, setClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLearnMore, setShowLearnMore] = useState(false);

  useEffect(() => {
    // Don't wait - check immediately if wallet exists
    if (!address) {
      setCheckingStatus(false);
      return;
    }

    const checkStatus = async () => {
      setCheckingStatus(true);
      setError(null);
      
      try {
        const status = await checkClaimStatus(address as `0x${string}`);
        setClaimOpen(status.claimOpen);
        setHasClaimed(status.hasClaimed);
      } catch (err: any) {
        console.error('Error checking claim status:', err);
        // Show user-friendly error
        setError(err?.message?.includes('timeout') 
          ? 'RPC timeout - please refresh to try again' 
          : 'Failed to check claim status. Please try refreshing the page.');
      } finally {
        setCheckingStatus(false);
      }
    };
    
    checkStatus();
  }, [address]); // Removed isConnected dependency

  const handleClaim = async () => {
    if (claiming || !address || !wallet) return;
    
    setClaiming(true);
    setError(null);
    
    try {
      const provider = await wallet.getEthereumProvider();
      await wallet.switchChain(BADGE_CHAIN.id);
      
      const result = await claimBadge(address as `0x${string}`, provider, (hash) => {
        setTxHash(hash);
      });

      if (result.success) {
        onNavigate('success');
      }
    } catch (err: any) {
      console.error('Error claiming badge:', err);
      
      if (err.message?.includes('rejected') || err.message?.includes('denied')) {
        setError('Transaction cancelled by user');
      } else if (err.message?.includes('AlreadyClaimed') || err.message?.includes('already claimed')) {
        setError('You have already claimed your OG Badge');
        setHasClaimed(true);
      } else {
        setError('Failed to claim badge. Please try again.');
      }
    } finally {
      setClaiming(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-400 text-sm sm:text-base">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-400 text-sm sm:text-base">Checking blockchain status...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LearnMoreModal show={showLearnMore} onClose={() => setShowLearnMore(false)} />
      
      <div className="min-h-screen relative flex flex-col p-4 sm:p-6 md:p-8">
        <AnimatedBackground />

        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extralight text-white mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
                    style={{ textShadow: '0 0 40px rgba(193,84,131,0.4)' }}>
                Claim Your Badge
              </span>
            </h2>
            
            <div className="mb-4 sm:mb-6">
              <div className="relative inline-block">
                <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/5 via-blue-600/3 to-purple-600/5 rounded-full blur-[60px]"></div>
                
                <div className="relative w-48 h-60 sm:w-56 sm:h-72 md:w-64 md:h-80">
                  <Image 
                    src="/images/badge/badge.png" 
                    alt="OG Badge" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 px-4 py-2 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-xs sm:text-sm">{error}</p>
              </div>
            )}
            
            {hasClaimed ? (
              <div className="text-gray-400 space-y-3">
                <p className="text-sm">Badge already claimed ✓</p>
                <button
                  onClick={() => setShowLearnMore(true)}
                  className="px-8 py-2.5 text-sm border border-purple-800/50 text-purple-400 rounded-full hover:border-purple-600/50 hover:bg-purple-900/20 transition-all"
                >
                  Learn More
                </button>
                
                {/* Back to Hub Button */}
                <div className="pt-2">
                  <a
                    href="/hub"
                    className="inline-block px-8 py-2 text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    ← Back to OPN Hub
                  </a>
                </div>
              </div>
            ) : !claimOpen ? (
              <div className="text-gray-400 space-y-3">
                <p className="text-sm">Claiming not open yet</p>
                <p className="text-xs text-purple-400/60">Check back soon!</p>
                <button
                  onClick={() => setShowLearnMore(true)}
                  className="px-8 py-2.5 text-sm border border-purple-800/50 text-purple-400 rounded-full hover:border-purple-600/50 hover:bg-purple-900/20 transition-all"
                >
                  Learn More
                </button>
                
                {/* Back to Hub Button */}
                <div className="pt-2">
                  <a
                    href="/hub"
                    className="inline-block px-8 py-2 text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    ← Back to OPN Hub
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center">
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="px-10 sm:px-12 py-2.5 sm:py-3 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {txHash ? 'Confirming...' : 'Claiming...'}
                    </span>
                  ) : (
                    'Claim Badge'
                  )}
                </button>
                
                <button
                  onClick={() => setShowLearnMore(true)}
                  className="px-8 py-2 text-xs border border-purple-800/50 text-purple-400 rounded-full hover:border-purple-600/50 hover:bg-purple-900/20 transition-all"
                >
                  Learn More
                </button>
                
                {/* Back to Hub Button */}
                <div className="pt-1">
                  <a
                    href="/hub"
                    className="inline-block px-8 py-2 text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    ← Back to OPN Hub
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="w-full relative z-10">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-600/50 to-transparent" />
            
            <div className="pt-4 pb-3 px-4 sm:px-6 md:px-8">
              {/* MOBILE */}
              <div className="sm:hidden">
                <div className="space-y-3">
                  <div className="text-left">
                    <p className="text-purple-300/40 text-[9px] font-medium tracking-[0.15em] uppercase">
                      Powered by
                    </p>
                    <p className="text-purple-300/60 text-xs font-light tracking-wider"
                       style={{ textShadow: '0 0 20px rgba(123,50,141,0.3)' }}>
                      OPN Chain
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <a 
                      href="https://chain.iopn.io/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative px-3 py-1.5 text-[10px] overflow-hidden rounded-full transition-all duration-300 flex-1 max-w-[145px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-purple-800/20 group-hover:from-purple-800/30 group-hover:to-purple-700/30 transition-all duration-300" />
                      <span className="relative text-purple-300/80 group-hover:text-purple-200 font-medium whitespace-nowrap block text-center">
                        Visit OPN Chain →
                      </span>
                    </a>
                    
                    <a 
                      href="https://faucet.iopn.tech/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative px-3 py-1.5 text-[10px] overflow-hidden rounded-full transition-all duration-300 flex-1 max-w-[145px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-purple-800/20 group-hover:from-purple-800/30 group-hover:to-purple-700/30 transition-all duration-300" />
                      <span className="relative text-purple-300/80 group-hover:text-purple-200 font-medium whitespace-nowrap block text-center">
                        Get Test Tokens →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Desktop */}
              <div className="hidden sm:flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex-1">
                  <div className="text-left">
                    <p className="text-purple-300/40 text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase">
                      Powered by
                    </p>
                    <p className="text-purple-300/60 text-sm sm:text-base font-light tracking-wider"
                       style={{ textShadow: '0 0 20px rgba(123,50,141,0.3)' }}>
                      OPN Chain
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-1">
                  <a 
                    href="https://chain.iopn.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative px-4 sm:px-5 py-2 text-xs sm:text-sm overflow-hidden rounded-full transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-purple-800/20 group-hover:from-purple-800/30 group-hover:to-purple-700/30 transition-all duration-300" />
                    <span className="relative text-purple-300/80 group-hover:text-purple-200 font-medium whitespace-nowrap">
                      Visit OPN Chain →
                    </span>
                  </a>
                  
                  <div className="w-px h-4 bg-purple-800/30" />
                  
                  <a 
                    href="https://faucet.iopn.tech/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative px-4 sm:px-5 py-2 text-xs sm:text-sm overflow-hidden rounded-full transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-purple-800/20 group-hover:from-purple-800/30 group-hover:to-purple-700/30 transition-all duration-300" />
                    <span className="relative text-purple-300/80 group-hover:text-purple-200 font-medium whitespace-nowrap">
                      Get Test Tokens →
                    </span>
                  </a>
                </div>
                
                <div className="flex-1" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}