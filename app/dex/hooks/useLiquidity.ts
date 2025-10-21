'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useHubWallet } from './useHubWallet';
import { Token, LiquidityPosition } from '../types';
import { LiquidityService } from '../services/LiquidityService';
import { toast } from 'react-hot-toast';

export const useLiquidity = () => {
  const { provider, address } = useHubWallet();
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<LiquidityPosition[]>([]);

  const liquidityService = useMemo(() => {
    if (!provider) return null;
    return new LiquidityService(provider);
  }, [provider]);

  const calculateLiquidityAmounts = useCallback(async (
    tokenA: Token,
    tokenB: Token,
    amount: string,
    inputField: 'A' | 'B'
  ): Promise<string> => {
    if (!liquidityService || !amount || parseFloat(amount) === 0) return '0';

    try {
      return await liquidityService.calculateLiquidityAmounts(tokenA, tokenB, amount, inputField);
    } catch (error) {
      console.error('Error calculating liquidity amounts:', error);
      return '0';
    }
  }, [liquidityService]);

  const addLiquidity = useCallback(async (
    tokenA: Token,
    tokenB: Token,
    amountA: string,
    amountB: string,
    slippage: number = 0.5
  ) => {
    if (!liquidityService || !address) {
      toast.error('Wallet not connected');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Adding liquidity...');

    try {
      const tx = await liquidityService.addLiquidity(
        tokenA,
        tokenB,
        amountA,
        amountB,
        address,
        slippage
      );

      toast.loading('Waiting for confirmation...', { id: loadingToast });
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success(
          `Added ${amountA} ${tokenA.symbol} + ${amountB} ${tokenB.symbol} liquidity!`,
          { id: loadingToast }
        );
        return receipt;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Add liquidity error:', error);
      
      let errorMessage = 'Failed to add liquidity';
      if (error?.reason || error?.message) {
        const message = error.reason || error.message;
        
        if (message.includes('user rejected')) {
          errorMessage = 'Transaction cancelled';
        } else if (message.includes('insufficient')) {
          errorMessage = 'Insufficient balance';
        }
      }
      
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [address, liquidityService]);

  const removeLiquidity = useCallback(async (
    position: LiquidityPosition,
    removePercentage: number
  ) => {
    if (!liquidityService || !address) {
      toast.error('Wallet not connected');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(`Removing ${removePercentage}% liquidity...`);

    try {
      const tx = await liquidityService.removeLiquidity(position, removePercentage, address);

      toast.loading('Waiting for confirmation...', { id: loadingToast });
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success(
          `Removed ${removePercentage}% of ${position.token0.symbol}/${position.token1.symbol} liquidity!`,
          { id: loadingToast }
        );
        return receipt;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Remove liquidity error:', error);
      
      let errorMessage = 'Failed to remove liquidity';
      if (error?.reason || error?.message) {
        const message = error.reason || error.message;
        if (message.includes('user rejected')) {
          errorMessage = 'Transaction cancelled';
        }
      }
      
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [address, liquidityService]);

  const loadLiquidityPositions = useCallback(async () => {
    if (!liquidityService || !address) {
      setPositions([]);
      return;
    }

    try {
      const userPositions = await liquidityService.getLiquidityPositions(address);
      setPositions(userPositions);
    } catch (error) {
      console.error('Error loading liquidity positions:', error);
      setPositions([]);
    }
  }, [address, liquidityService]);

  useEffect(() => {
    loadLiquidityPositions();
  }, [loadLiquidityPositions]);

  return {
    calculateLiquidityAmounts,
    addLiquidity,
    removeLiquidity,
    loadLiquidityPositions,
    positions,
    loading
  };
};