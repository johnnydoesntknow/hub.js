'use client';

import { Token } from '../../types';
import { formatBalance } from '../../utils/formatters';

interface AddLiquidityProps {
  tokenA: Token;
  tokenB: Token;
  amountA: string;
  amountB: string;
  onAmountAChange: (value: string) => void;
  onAmountBChange: (value: string) => void;
  onTokenASelect: () => void;
  onTokenBSelect: () => void;
  onAddLiquidity: () => void;
  loading: boolean;
  disabled: boolean;
  isConnected: boolean;
}

export const AddLiquidity: React.FC<AddLiquidityProps> = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  onAmountAChange,
  onAmountBChange,
  onTokenASelect,
  onTokenBSelect,
  onAddLiquidity,
  loading,
  disabled,
  isConnected,
}) => {
  return (
    <div className="space-y-4">
      {/* Token A Input */}
      <div className="bg-black/30 rounded-2xl p-4 border border-purple-500/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Input</span>
          <span className="text-gray-400 text-sm">
            Balance: {formatBalance(tokenA.balance)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            value={amountA}
            onChange={(e) => onAmountAChange(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent text-white text-3xl outline-none placeholder-gray-600 w-0"
          />
          <button 
            onClick={onTokenASelect}
            className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-xl hover:bg-purple-500/20 transition-all flex-shrink-0"
          >
            {tokenA.logoURI && (
              <img src={tokenA.logoURI} alt={tokenA.symbol} className="w-6 h-6 rounded-full" />
            )}
            <span className="text-white font-medium">{tokenA.symbol}</span>
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-black/50 border border-purple-500/20 p-2 rounded-xl">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>

      {/* Token B Input */}
      <div className="bg-black/30 rounded-2xl p-4 border border-purple-500/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Input</span>
          <span className="text-gray-400 text-sm">
            Balance: {formatBalance(tokenB.balance)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            value={amountB}
            onChange={(e) => onAmountBChange(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent text-white text-3xl outline-none placeholder-gray-600 w-0"
          />
          <button 
            onClick={onTokenBSelect}
            className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-xl hover:bg-purple-500/20 transition-all flex-shrink-0"
          >
            {tokenB.logoURI && (
              <img src={tokenB.logoURI} alt={tokenB.symbol} className="w-6 h-6 rounded-full" />
            )}
            <span className="text-white font-medium">{tokenB.symbol}</span>
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Pool Share Info */}
      {amountA && amountB && (
        <div className="bg-black/30 rounded-xl p-3 border border-purple-500/10 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price</span>
            <div className="text-white text-right">
              <div>1 {tokenA.symbol} = {(parseFloat(amountB) / parseFloat(amountA)).toFixed(6)} {tokenB.symbol}</div>
              <div>1 {tokenB.symbol} = {(parseFloat(amountA) / parseFloat(amountB)).toFixed(6)} {tokenA.symbol}</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={onAddLiquidity}
        disabled={disabled || loading}
        className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
          disabled || loading
            ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
            : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
        }`}
      >
        {loading ? 'Adding Liquidity...' : 
         !isConnected ? 'Connect Wallet' :
         !amountA || !amountB ? 'Enter amounts' :
         'Add Liquidity'}
      </button>
    </div>
  );
};