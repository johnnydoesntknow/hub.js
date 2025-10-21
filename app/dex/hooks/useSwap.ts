'use client';

import { useState, useCallback, useMemo } from 'react';
import { useHubWallet } from './useHubWallet';
import { Token } from '../types';
import { SwapService } from '../services/SwapService';
import { toast } from 'react-hot-toast';

export const useSwap = () => {
  const { provider, address } = useHubWallet();
  const [loading, setLoading] = useState(false);

  const swapService = useMemo(() => {
    if (!provider) return null;
    return new SwapService(provider);
  }, [provider]);

  const calculateSwapOutput = useCallback(async (
    fromToken: Token,
    toToken: Token,
    amount: string
  ): Promise<string> => {
    if (!swapService || !amount || parseFloat(amount) === 0) return '0';

    try {
      return await swapService.calculateSwapOutput(fromToken, toToken, amount);
    } catch (error) {
      console.error('Error calculating swap output:', error);
      return '0';
    }
  }, [swapService]);

  const executeSwap = useCallback(async (
    fromToken: Token,
    toToken: Token,
    fromAmount: string,
    toAmount: string,
    slippage: string
  ) => {
    if (!swapService || !address) {
      toast.error('Wallet not connected');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Preparing swap...');

    try {
      const slippageTolerance = parseFloat(slippage);
      const tx = await swapService.executeSwap(
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        address,
        slippageTolerance
      );
      
      toast.loading('Swapping...', { id: loadingToast });
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success('Swap successful!', { id: loadingToast });
        return receipt;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Swap error:', error);
      
      let errorMessage = 'Swap failed';
      if (error?.reason || error?.message) {
        const message = error.reason || error.message;
        
        if (message.includes('user rejected')) {
          errorMessage = 'Transaction cancelled';
        } else if (message.includes('insufficient funds')) {
          errorMessage = 'Insufficient balance';
        } else if (message.includes('INSUFFICIENT_LIQUIDITY')) {
          errorMessage = 'Not enough liquidity in the pool';
        }
      }
      
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [address, swapService]);

  return {
    calculateSwapOutput,
    executeSwap,
    loading
  };
};