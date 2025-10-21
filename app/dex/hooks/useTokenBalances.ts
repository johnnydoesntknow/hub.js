'use client';

import { useState, useCallback, useEffect } from 'react';
import { Contract, formatEther, formatUnits } from 'ethers';
import { useHubWallet } from './useHubWallet';
import { DEFAULT_TOKENS } from '../constants';
import { ERC20_ABI } from '../contracts/abis';

export const useTokenBalances = () => {
  const { provider, address, isConnected } = useHubWallet();
  const [tokenBalances, setTokenBalances] = useState<{ [address: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const loadTokenBalances = useCallback(async () => {
    if (!provider || !address || !isConnected) {
      setTokenBalances({});
      return;
    }

    setLoading(true);
    const balances: { [address: string]: string } = {};

    try {
      // Load native OPN balance
      const ethBalance = await provider.getBalance(address);
      balances['0x0000000000000000000000000000000000000000'] = formatEther(ethBalance);

      // Load ERC20 token balances
      const promises = DEFAULT_TOKENS
        .filter(token => token.address !== '0x0000000000000000000000000000000000000000')
        .map(async (token) => {
          try {
            const contract = new Contract(token.address, ERC20_ABI, provider);
            const balance = await contract.balanceOf(address);
            balances[token.address] = formatUnits(balance, token.decimals);
          } catch (error) {
            console.error(`Error loading balance for ${token.symbol}:`, error);
            balances[token.address] = '0';
          }
        });

      await Promise.all(promises);
      setTokenBalances(balances);
    } catch (error) {
      console.error('Error loading token balances:', error);
    } finally {
      setLoading(false);
    }
  }, [provider, address, isConnected]);

  useEffect(() => {
    loadTokenBalances();
  }, [loadTokenBalances]);

  return {
    tokenBalances,
    loadTokenBalances,
    loading,
  };
};