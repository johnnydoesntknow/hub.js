'use client';

import Image from 'next/image';
import AnimatedBackground from './AnimatedBackground';
import type { BadgePage } from '../types';

interface LandingPageProps {
  onNavigate: (page: BadgePage) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <AnimatedBackground />
      
      <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto relative z-10 px-4">
        {/* Logo */}
        <div className="mb-8 sm:mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20" />
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
              <Image 
                src="/images/badge/logo.jpeg" 
                alt="OPN Chain" 
                fill
                className="rounded-full object-cover border-2 border-purple-500/20"
                style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-white mb-6 sm:mb-8 tracking-tight"
            style={{ textShadow: '0 0 40px rgba(193,84,131,0.5)' }}>
          OG Badge
        </h1>
        
        {/* Subtitle */}
        <div className="space-y-1 mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
                  style={{ textShadow: '0 0 60px rgba(193,84,131,0.5)' }}>
              The Definitive
            </span>
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
                  style={{ textShadow: '0 0 60px rgba(123,50,141,0.5)' }}>
              OPN Chain Badge
            </span>
          </h2>
        </div>

        {/* Tag line */}
        <p className="text-gray-400 text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-12 sm:mb-14 md:mb-16">
          Exclusive Access | Limited Edition
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={() => onNavigate('video')}
            className="px-10 sm:px-12 md:px-16 py-4 sm:py-4 text-base sm:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Start Claim
          </button>
        </div>
      </div>
    </div>
  );
}