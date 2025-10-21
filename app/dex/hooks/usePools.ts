'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useHubWallet } from './useHubWallet';
import { PoolInfo } from '../types';
import { PoolsService } from '../services/PoolsService';

export const usePools = () => {
  const { provider } = useHubWallet();
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const poolsService = useMemo(() => {
    if (!provider) return null;
    return new PoolsService(provider);
  }, [provider]);

  const loadPools = useCallback(async () => {
    if (!poolsService) {
      setPools([]);
      return;
    }

    setLoading(true);
    try {
      const allPools = await poolsService.getAllPools();
      setPools(allPools);
    } catch (error) {
      console.error('Error loading pools:', error);
      setPools([]);
    } finally {
      setLoading(false);
    }
  }, [poolsService]);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  return {
    pools,
    loading,
    loadPools
  };
};