'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Token } from '../types';
import { DEFAULT_TOKENS } from '../constants';
import { formatBalance } from '../utils/formatters';

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  currentToken?: Token;
  otherToken?: Token;
  tokenBalances: { [address: string]: string };
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentToken,
  otherToken,
  tokenBalances,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = useMemo(() => {
    return DEFAULT_TOKENS.filter(token => {
      // Don't show the other selected token to avoid duplicates
      if (otherToken && token.address === otherToken.address) return false;
      
      // Filter by search query
      const query = searchQuery.toLowerCase();
      return token.symbol.toLowerCase().includes(query) || 
             token.name.toLowerCase().includes(query);
    });
  }, [searchQuery, otherToken]);

  const handleSelect = (token: Token) => {
    // Add balance to token before selecting
    const tokenWithBalance = {
      ...token,
      balance: tokenBalances[token.address] || '0'
    };
    onSelect(tokenWithBalance);
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Select a Token</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <input
            type="text"
            placeholder="Search name or symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => handleSelect(token)}
                className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-700 transition-colors ${
                  currentToken?.address === token.address ? 'bg-slate-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {token.logoURI && (
                    <img 
                      src={token.logoURI} 
                      alt={token.symbol} 
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="text-left">
                    <div className="text-white font-medium">{token.symbol}</div>
                    <div className="text-gray-400 text-sm">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white">
                    {formatBalance(tokenBalances[token.address])}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};