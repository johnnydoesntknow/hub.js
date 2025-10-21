'use client';

import { LiquidityPosition } from '../../types';
import { formatBalance } from '../../utils/formatters';

interface RemoveLiquidityProps {
  positions: LiquidityPosition[];
  selectedPosition: LiquidityPosition | null;
  removePercentage: number;
  onPercentageChange: (value: number) => void;
  onSelectPosition: (position: LiquidityPosition) => void;
  onRemove: () => void;
  loading: boolean;
}

export const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({
  positions,
  selectedPosition,
  removePercentage,
  onPercentageChange,
  onSelectPosition,
  onRemove,
  loading,
}) => {
  return (
    <div className="space-y-4">
      {/* Position Selector */}
      <div className="bg-black/30 rounded-2xl p-4 border border-purple-500/10">
        <h3 className="text-white font-semibold mb-3">Your Liquidity Positions</h3>
        {positions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No liquidity positions found</p>
        ) : (
          <div className="space-y-2">
            {positions.map((position) => (
              <button
                key={position.pair}
                onClick={() => onSelectPosition(position)}
                className={`w-full p-3 rounded-xl transition-all ${
                  selectedPosition?.pair === position.pair
                    ? 'bg-purple-500/20 border border-purple-500'
                    : 'bg-black/30 border border-purple-500/10 hover:bg-purple-500/10'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {position.token0.symbol}/{position.token1.symbol}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-white">{position.poolShare}%</div>
                    <div className="text-gray-400 text-sm">Pool Share</div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">
                    {position.token0.symbol}: {formatBalance(position.token0Deposited)}
                  </div>
                  <div className="text-gray-400">
                    {position.token1.symbol}: {formatBalance(position.token1Deposited)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Remove Amount Selector */}
      {selectedPosition && (
        <div className="bg-black/30 rounded-2xl p-4 space-y-4 border border-purple-500/10">
          <h3 className="text-white font-semibold">Amount to Remove</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Percentage</span>
              <span className="text-white">{removePercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="25"
              value={removePercentage}
              onChange={(e) => onPercentageChange(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick select buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((percent) => (
              <button
                key={percent}
                onClick={() => onPercentageChange(percent)}
                className={`py-2 rounded-lg transition-all ${
                  removePercentage === percent
                    ? 'bg-purple-500 text-white'
                    : 'bg-black/30 text-gray-400 hover:bg-purple-500/20 border border-purple-500/10'
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>

          {/* You will receive */}
          <div className="space-y-2 pt-4 border-t border-purple-500/10">
            <p className="text-gray-400 text-sm">You will receive:</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">{selectedPosition.token0.symbol}</span>
                <span className="text-white">
                  {(parseFloat(selectedPosition.token0Deposited) * removePercentage / 100).toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{selectedPosition.token1.symbol}</span>
                <span className="text-white">
                  {(parseFloat(selectedPosition.token1Deposited) * removePercentage / 100).toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Button */}
      <button
        onClick={onRemove}
        disabled={!selectedPosition || loading}
        className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
          !selectedPosition || loading
            ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
            : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
        }`}
      >
        {loading ? 'Removing Liquidity...' : 
         !selectedPosition ? 'Select a position' :
         'Remove Liquidity'}
      </button>
    </div>
  );
};