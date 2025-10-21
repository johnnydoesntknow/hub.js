'use client';

import { Token } from '../types';

interface SwapButtonProps {
  isConnected: boolean;
  hasAmount: boolean;
  exceedsBalance: boolean;
  loading: boolean;
  onSwap: () => void;
  fromToken: Token;
  toToken: Token;
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  isConnected,
  hasAmount,
  exceedsBalance,
  loading,
  onSwap,
  fromToken,
  toToken,
}) => {
  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (loading) return 'Swapping...';
    if (!hasAmount) return 'Enter an amount';
    if (exceedsBalance) return `Insufficient ${fromToken.symbol} balance`;
    return `Swap ${fromToken.symbol} for ${toToken.symbol}`;
  };

  const isDisabled = !isConnected || loading || !hasAmount || exceedsBalance;

  return (
    <button
      onClick={onSwap}
      disabled={isDisabled}
      className={`w-full py-4 rounded-xl font-semibold transition-all ${
        isDisabled
          ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
          : 'bg-purple-600 hover:bg-purple-700 text-white'
      }`}
    >
      {getButtonText()}
    </button>
  );
};