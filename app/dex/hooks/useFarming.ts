'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useHubWallet } from './useHubWallet';
import { FarmPool } from '../types';
import { FarmingService } from '../services/FarmingService';
import { toast } from 'react-hot-toast';

export const useFarming = () => {
  const { provider, address } = useHubWallet();
  const [farms, setFarms] = useState<FarmPool[]>([]);
  const [userStakes, setUserStakes] = useState<{ [poolId: number]: string }>({});
  const [pendingRewards, setPendingRewards] = useState<{ [poolId: number]: string }>({});
  const [lpBalances, setLpBalances] = useState<{ [token: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const farmingService = useMemo(() => {
    if (!provider) return null;
    return new FarmingService(provider);
  }, [provider]);

  const loadFarms = useCallback(async () => {
    if (!farmingService) {
      setFarms([]);
      return;
    }

    setLoading(true);
    try {
      const allFarms = await farmingService.getFarmPools();
      setFarms(allFarms);

      if (address) {
        const stakes: { [poolId: number]: string } = {};
        const rewards: { [poolId: number]: string } = {};

        for (const farm of allFarms) {
          const userInfo = await farmingService.getUserStakeInfo(farm.poolId, address);
          const pending = await farmingService.getPendingRewards(farm.poolId, address);
          
          stakes[farm.poolId] = userInfo.amount;
          rewards[farm.poolId] = pending;
        }

        setUserStakes(stakes);
        setPendingRewards(rewards);
      }
    } catch (error) {
      console.error('Error loading farms:', error);
      setFarms([]);
    } finally {
      setLoading(false);
    }
  }, [farmingService, address]);

  const stake = useCallback(async (poolId: number, amount: string) => {
    if (!farmingService) return;

    const loadingToast = toast.loading('Staking LP tokens...');
    try {
      const tx = await farmingService.stake(poolId, amount);
      toast.loading('Waiting for confirmation...', { id: loadingToast });
      await tx.wait();
      toast.success('Staked successfully!', { id: loadingToast });
      await loadFarms();
    } catch (error: any) {
      console.error('Stake error:', error);
      const message = error?.reason || error?.message || 'Failed to stake';
      toast.error(message, { id: loadingToast });
      throw error;
    }
  }, [farmingService, loadFarms]);

  const unstake = useCallback(async (poolId: number, amount: string) => {
    if (!farmingService) return;

    const loadingToast = toast.loading('Unstaking LP tokens...');
    try {
      const tx = await farmingService.unstake(poolId, amount);
      toast.loading('Waiting for confirmation...', { id: loadingToast });
      await tx.wait();
      toast.success('Unstaked successfully!', { id: loadingToast });
      await loadFarms();
    } catch (error: any) {
      console.error('Unstake error:', error);
      const message = error?.reason || error?.message || 'Failed to unstake';
      toast.error(message, { id: loadingToast });
      throw error;
    }
  }, [farmingService, loadFarms]);

  const harvest = useCallback(async (poolId: number) => {
    if (!farmingService) return;

    const loadingToast = toast.loading('Harvesting rewards...');
    try {
      const tx = await farmingService.harvest(poolId);
      toast.loading('Waiting for confirmation...', { id: loadingToast });
      await tx.wait();
      toast.success('Rewards harvested!', { id: loadingToast });
      await loadFarms();
    } catch (error: any) {
      console.error('Harvest error:', error);
      const message = error?.reason || error?.message || 'Failed to harvest';
      toast.error(message, { id: loadingToast });
      throw error;
    }
  }, [farmingService, loadFarms]);

  const getLPBalance = useCallback((lpToken: string): string => {
    return lpBalances[lpToken] || '0';
  }, [lpBalances]);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  return {
    farms,
    userStakes,
    pendingRewards,
    loading,
    stake,
    unstake,
    harvest,
    getLPBalance,
    loadFarms
  };
};