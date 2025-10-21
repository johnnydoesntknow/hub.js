'use client';

import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import VideoPage from './components/VideoPage';
import ClaimPage from './components/ClaimPage';
import SuccessPage from './components/SuccessPage';
import type { BadgePage } from './types';

export default function OGBadgeClaimPage() {
  const [currentPage, setCurrentPage] = useState<BadgePage>('landing');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const handleNavigate = (page: BadgePage) => {
    setCurrentPage(page);
    
    // Update URL hash for navigation state (but not for landing)
    if (typeof window !== 'undefined') {
      if (page === 'landing') {
        // Clear hash when going to landing
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        window.location.hash = page;
      }
    }
  };

  // Handle browser back/forward - only runs ONCE on mount and on hash changes
  useEffect(() => {
    // Don't check hash on initial mount - always start at landing
    const hash = window.location.hash.slice(1);
    
    // Only change page if there's an actual hash in the URL
    if (hash && (hash === 'video' || hash === 'claim' || hash === 'success')) {
      setCurrentPage(hash as BadgePage);
    }
    
    // Listen for hash changes (browser back/forward)
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash === 'video' || newHash === 'claim' || newHash === 'success') {
        setCurrentPage(newHash as BadgePage);
      } else {
        setCurrentPage('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // Empty dependency array - only run once

  return (
    <div className="min-h-screen relative bg-black">
      {/* Global styles for badge section */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap');
        
        .badge-container * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
      
      <div className="badge-container">
        {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === 'video' && <VideoPage onNavigate={handleNavigate} />}
        {currentPage === 'claim' && <ClaimPage onNavigate={handleNavigate} />}
        {currentPage === 'success' && <SuccessPage txHash={txHash} />}
      </div>
    </div>
  );
}