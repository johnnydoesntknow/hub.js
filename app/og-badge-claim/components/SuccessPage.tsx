'use client';

import Image from 'next/image';
import { BADGE_CHAIN } from '../lib/constants';
import { useWallet } from '../hooks/useWallet';
import AnimatedBackground from './AnimatedBackground';

interface SuccessPageProps {
  txHash?: `0x${string}`;
}

export default function SuccessPage({ txHash }: SuccessPageProps) {
  const { address } = useWallet();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      <AnimatedBackground />
      
      <div className="text-center max-w-2xl mx-auto relative z-10 px-4 flex-1 flex flex-col items-center justify-center">
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30" />
            <Image 
              src="/images/badge/logo.jpeg" 
              alt="OPN Chain" 
              width={96}
              height={96}
              className="rounded-full object-cover relative z-10 border-2 border-purple-500/20"
              style={{ filter: 'brightness(1.1) contrast(1.1)' }}
            />
          </div>
        </div>
        
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-purple-500/10 border border-purple-500/30">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white mb-3 sm:mb-4"
            style={{ textShadow: '0 0 40px rgba(123,50,141,0.4)' }}>
          Success
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
          Your OG Badge has been minted to your wallet
        </p>
        
        <div className="space-y-2 sm:space-y-3">
          {txHash && (
            <a 
              href={`${BADGE_CHAIN.blockExplorers.default.url}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              View Transaction
            </a>
          )}
          
          {address && (
            <p className="text-purple-400/50 text-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          )}
          
          {/* Back to Hub Button */}
          <div className="pt-4">
            <a
              href="/hub"
              className="inline-block px-8 py-2.5 text-sm border border-purple-800/50 text-purple-400 rounded-full hover:border-purple-600/50 hover:bg-purple-900/20 transition-all"
            >
              ← Back to OPN Hub
            </a>
          </div>
        </div>
      </div>
      
      <footer className="w-full relative z-10 mt-auto">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-600/50 to-transparent" />
          
          <div className="pt-4 pb-3 px-4 sm:px-6 md:px-8">
            {/* MOBILE */}
            <div className="sm:hidden">
              <div className="space-y-3">
                <div className="text-center">
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
  );
}