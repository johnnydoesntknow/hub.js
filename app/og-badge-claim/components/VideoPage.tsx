'use client';

import { useState, useEffect, useRef } from 'react';
import { BADGE_ENV } from '../lib/constants';
import AnimatedBackground from './AnimatedBackground';
import type { BadgePage } from '../types';

interface VideoPageProps {
  onNavigate: (page: BadgePage) => void;
}

export default function VideoPage({ onNavigate }: VideoPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play was prevented');
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setIsPlaying(false);
  };

  const handleContinue = () => {
    onNavigate('claim');
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setVideoEnded(false);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain sm:object-cover"
        src={BADGE_ENV.VIDEO_URL}
        onEnded={handleVideoEnd}
        playsInline
        controls={true}
      />
      
      {videoEnded && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-between backdrop-blur-sm p-4">
          <AnimatedBackground />
          
          <div className="w-full" />
          
          <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 relative z-10 max-w-2xl px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                    style={{ textShadow: '0 0 40px rgba(193,84,131,0.4)' }}>
                You're ready to claim the OG Badge
              </span>
            </h1>

            <div className="text-gray-300 space-y-2 px-2 sm:px-4">
              <p className="text-xs sm:text-sm md:text-base leading-relaxed" style={{ color: '#f8fdf1' }}>
                This soulbound NFT represents your status as an original member of the OPN Chain community. 
                It's non-transferable and permanently linked to your wallet, serving as proof of your 
                early support and participation in the IOPn ecosystem.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={handleReplay}
                className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm border border-purple-800/50 text-white font-medium rounded-full hover:border-purple-600/50 hover:bg-purple-900/20 transition-all"
              >
                Watch Again
              </button>
              <button
                onClick={handleContinue}
                className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                Continue
              </button>
              
              {/* MOBILE ONLY - Links */}
              <div className="flex items-center justify-center gap-2 mt-1 sm:hidden">
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
          
          <footer className="w-full relative z-10">
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-600/50 to-transparent" />
              
              <div className="pt-4 pb-3 px-4 sm:px-6 md:px-8">
                {/* MOBILE */}
                <div className="sm:hidden">
                  <div className="text-center">
                    <p className="text-purple-300/40 text-[9px] font-medium tracking-[0.2em] uppercase">
                      Powered by
                    </p>
                    <p className="text-purple-300/60 text-xs font-light tracking-wider"
                       style={{ textShadow: '0 0 20px rgba(123,50,141,0.3)' }}>
                      OPN Chain
                    </p>
                  </div>
                </div>
                
                {/* Desktop */}
                <div className="hidden sm:flex items-center justify-between max-w-7xl mx-auto">
                  <div className="flex-1">
                    <div className="text-left">
                      <p className="text-purple-300/40 text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase">
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
      )}
    </div>
  );
}