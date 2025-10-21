'use client';

import { PoolInfo } from '../../types';
import { formatBalance } from '../../utils/formatters';

interface PoolsListProps {
  pools: PoolInfo[];
  loading: boolean;
  onAddLiquidity: (token0: any, token1: any) => void;
}

export const PoolsList: React.FC<PoolsListProps> = ({
  pools,
  loading,
  onAddLiquidity
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="text-gray-400 mt-2">Loading pools...</p>
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No active pools found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-2 px-4 text-xs text-gray-400 font-medium">
        <div className="col-span-3">Pool</div>
        <div className="col-span-2 text-right">TVL</div>
        <div className="col-span-2 text-right">24h Volume</div>
        <div className="col-span-2 text-right">APR</div>
        <div className="col-span-3"></div>
      </div>

      {pools.map((pool, index) => (
        <div
          key={`${pool.pair}-${index}`}
          className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-colors"
        >
          <div className="grid grid-cols-12 gap-2 items-center">
            {/* Pool Pair */}
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {pool.token0.logoURI && (
                    <img 
                      src={pool.token0.logoURI} 
                      alt={pool.token0.symbol}
                      className="w-6 h-6 rounded-full border-2 border-slate-800"
                    />
                  )}
                  {pool.token1.logoURI && (
                    <img 
                      src={pool.token1.logoURI} 
                      alt={pool.token1.symbol}
                      className="w-6 h-6 rounded-full border-2 border-slate-800"
                    />
                  )}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">
                    {pool.token0.symbol}/{pool.token1.symbol}
                  </div>
                </div>
              </div>
            </div>

            {/* TVL */}
            <div className="col-span-2 text-right">
              <div className="text-white text-sm">
                ${formatBalance(pool.tvl, 2)}
              </div>
            </div>

            {/* 24h Volume */}
            <div className="col-span-2 text-right">
              <div className="text-white text-sm">
                ${formatBalance(pool.volume24h, 2)}
              </div>
            </div>

            {/* APR */}
            <div className="col-span-2 text-right">
              <div className="text-green-400 text-sm font-medium">
                {pool.apr}%
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-3 flex justify-end gap-2">
              <button
                onClick={() => onAddLiquidity(pool.token0, pool.token1)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
              >
                Add Liquidity
              </button>
              <button
                className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded-lg transition-colors"
              >
                Details
              </button>
            </div>
          </div>

          {/* Expanded Details (hidden by default) */}
          <div className="hidden mt-4 pt-4 border-t border-slate-600 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Reserve {pool.token0.symbol}:</span>
              <span className="text-white ml-2">{formatBalance(pool.reserve0)}</span>
            </div>
            <div>
              <span className="text-gray-400">Reserve {pool.token1.symbol}:</span>
              <span className="text-white ml-2">{formatBalance(pool.reserve1)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};