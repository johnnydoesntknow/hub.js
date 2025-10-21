'use client';

import { FarmPool } from '../../types';
import { formatBalance } from '../../utils/formatters';

interface FarmListProps {
  farms: FarmPool[];
  userStakes: { [poolId: number]: string };
  pendingRewards: { [poolId: number]: string };
  loading: boolean;
  onStake: (poolId: number) => void;
  onUnstake: (poolId: number) => void;
  onHarvest: (poolId: number) => void;
}

export const FarmList: React.FC<FarmListProps> = ({
  farms,
  userStakes,
  pendingRewards,
  loading,
  onStake,
  onUnstake,
  onHarvest,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="text-gray-400 mt-2">Loading farms...</p>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No active farms available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {farms.map((farm) => (
        <div key={farm.poolId} className="bg-slate-700/50 rounded-xl p-5">
          {/* Farm Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {farm.token0.logoURI && (
                  <img 
                    src={farm.token0.logoURI} 
                    alt={farm.token0.symbol}
                    className="w-8 h-8 rounded-full border-2 border-slate-800"
                  />
                )}
                {farm.token1.logoURI && (
                  <img 
                    src={farm.token1.logoURI} 
                    alt={farm.token1.symbol}
                    className="w-8 h-8 rounded-full border-2 border-slate-800"
                  />
                )}
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {farm.token0.symbol}-{farm.token1.symbol} LP
                </h3>
                <p className="text-gray-400 text-sm">Earn {farm.rewardToken.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{farm.apr}%</div>
              <div className="text-xs text-gray-400">APR</div>
            </div>
          </div>

          {/* Farm Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-400">Total Staked:</span>
              <p className="text-white">${formatBalance(farm.totalStaked, 2)}</p>
            </div>
            <div>
              <span className="text-gray-400">Daily Rewards:</span>
              <p className="text-white">
                {formatBalance(farm.rewardsPerDay)} {farm.rewardToken.symbol}
              </p>
            </div>
          </div>

          {/* User Stats */}
          {userStakes[farm.poolId] && parseFloat(userStakes[farm.poolId]) > 0 ? (
            <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Your Stake:</span>
                  <p className="text-white">{formatBalance(userStakes[farm.poolId])} LP</p>
                </div>
                <div>
                  <span className="text-gray-400">Pending Rewards:</span>
                  <p className="text-purple-400 font-medium">
                    {formatBalance(pendingRewards[farm.poolId])} {farm.rewardToken.symbol}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex gap-2">
            {userStakes[farm.poolId] && parseFloat(userStakes[farm.poolId]) > 0 ? (
              <>
                <button
                  onClick={() => onStake(farm.poolId)}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Stake More
                </button>
                <button
                  onClick={() => onUnstake(farm.poolId)}
                  className="flex-1 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Unstake
                </button>
                {parseFloat(pendingRewards[farm.poolId] || '0') > 0 && (
                  <button
                    onClick={() => onHarvest(farm.poolId)}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Harvest
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => onStake(farm.poolId)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Start Farming
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};