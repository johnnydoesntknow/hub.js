'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useHubWallet } from './hooks/useHubWallet';
import { useTokenBalances } from './hooks/useTokenBalances';
import { useSwap } from './hooks/useSwap';
import { useLiquidity } from './hooks/useLiquidity';
import { usePools } from './hooks/usePools';
import { useFarming } from '@/app/dex/hooks/useFarming';
import { TokenSelector } from './components/TokenSelector';
import { SwapButton } from './components/SwapButton';
import { LiquidityInterface } from './components/liquidity/LiquidityInterface';
import { AddLiquidity } from './components/liquidity/AddLiquidity';
import { RemoveLiquidity } from './components/liquidity/RemoveLiquidity';
import { PoolsList } from './components/pools/PoolsList';
import { FarmList } from './components/farming/FarmList';
import { StakeModal } from './components/farming/StakeModal';
import { Token, TabType, LiquidityTabType, LiquidityPosition, FarmPool } from './types';
import { DEFAULT_TOKENS } from './constants';
import { formatBalance } from './utils/formatters';
import { isValidAmount } from './utils/validators';
import Link from 'next/link';

export default function DexPage() {
  const { isConnected, address } = useHubWallet();
  const { tokenBalances, loadTokenBalances } = useTokenBalances();
  const { calculateSwapOutput, executeSwap, loading: swapLoading } = useSwap();
  const { 
    calculateLiquidityAmounts, 
    addLiquidity, 
    removeLiquidity, 
    loadLiquidityPositions,
    positions,
    loading: liquidityLoading 
  } = useLiquidity();
  const { pools, loading: poolsLoading } = usePools();
  const {
    farms,
    userStakes,
    pendingRewards,
    loading: farmsLoading,
    stake,
    unstake,
    harvest,
    getLPBalance
  } = useFarming();

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('swap');
  const [showTokenSelectorFor, setShowTokenSelectorFor] = useState<'from' | 'to' | 'tokenA' | 'tokenB' | null>(null);

  // Swap State
  const [fromToken, setFromToken] = useState<Token>(DEFAULT_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(DEFAULT_TOKENS[2]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [calculating, setCalculating] = useState(false);

  // Liquidity State
  const [liquidityTab, setLiquidityTab] = useState<LiquidityTabType>('add');
  const [tokenA, setTokenA] = useState<Token>(DEFAULT_TOKENS[0]);
  const [tokenB, setTokenB] = useState<Token>(DEFAULT_TOKENS[2]);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<LiquidityPosition | null>(null);
  const [removePercentage, setRemovePercentage] = useState(25);

  // Farming State
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmPool | null>(null);
  const [stakeMode, setStakeMode] = useState<'stake' | 'unstake'>('stake');
  const [stakeAmount, setStakeAmount] = useState('');

  // Update token balances
  useEffect(() => {
    setFromToken(prev => ({ ...prev, balance: tokenBalances[prev.address] }));
    setToToken(prev => ({ ...prev, balance: tokenBalances[prev.address] }));
    setTokenA(prev => ({ ...prev, balance: tokenBalances[prev.address] }));
    setTokenB(prev => ({ ...prev, balance: tokenBalances[prev.address] }));
  }, [tokenBalances]);

  // Calculate swap output
  const calculateOutput = useCallback(async (amount: string) => {
    if (!isValidAmount(amount) || !fromToken || !toToken) {
      setToAmount('');
      return;
    }

    setCalculating(true);
    try {
      const output = await calculateSwapOutput(fromToken, toToken, amount);
      setToAmount(output);
    } catch (error) {
      console.error('Error calculating output:', error);
      setToAmount('0');
    } finally {
      setCalculating(false);
    }
  }, [fromToken, toToken, calculateSwapOutput]);

  useEffect(() => {
    if (fromAmount) {
      calculateOutput(fromAmount);
    }
  }, [fromAmount, calculateOutput]);

  // Calculate liquidity ratio
  useEffect(() => {
    const calculateRatio = async () => {
      if (liquidityTab === 'add' && amountA && tokenA && tokenB) {
        const amountBCalculated = await calculateLiquidityAmounts(tokenA, tokenB, amountA, 'A');
        setAmountB(amountBCalculated);
      }
    };
    calculateRatio();
  }, [amountA, tokenA, tokenB, liquidityTab, calculateLiquidityAmounts]);

  // Handlers
  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!isConnected || !isValidAmount(fromAmount) || parseFloat(toAmount) === 0) {
      return;
    }

    try {
      await executeSwap(fromToken, toToken, fromAmount, toAmount, slippage);
      setFromAmount('');
      setToAmount('');
      await loadTokenBalances();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAddLiquidity = async () => {
    if (!isConnected || !amountA || !amountB) return;
    
    try {
      await addLiquidity(tokenA, tokenB, amountA, amountB, parseFloat(slippage));
      setAmountA('');
      setAmountB('');
      await loadTokenBalances();
      await loadLiquidityPositions();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleAddLiquidityFromPool = (token0: Token, token1: Token) => {
    setTokenA(token0);
    setTokenB(token1);
    setActiveTab('liquidity');
    setLiquidityTab('add');
  };

  const handleRemoveLiquidity = async () => {
    if (!selectedPosition) return;
    
    try {
      await removeLiquidity(selectedPosition, removePercentage);
      setSelectedPosition(null);
      setRemovePercentage(25);
      await loadTokenBalances();
      await loadLiquidityPositions();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleStakeClick = async (poolId: number) => {
    const farm = farms.find((farmItem: FarmPool) => farmItem.poolId === poolId);
    if (farm) {
      setSelectedFarm(farm);
      setStakeMode('stake');
      setStakeAmount('');
      setShowStakeModal(true);
    }
  };

  const handleUnstakeClick = (poolId: number) => {
    const farm = farms.find((farmItem: FarmPool) => farmItem.poolId === poolId);
    if (farm) {
      setSelectedFarm(farm);
      setStakeMode('unstake');
      setStakeAmount('');
      setShowStakeModal(true);
    }
  };

  const handleHarvest = async (poolId: number) => {
    try {
      await harvest(poolId);
      await loadTokenBalances();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleStakeConfirm = async () => {
    if (!selectedFarm || !stakeAmount) return;

    try {
      if (stakeMode === 'stake') {
        await stake(selectedFarm.poolId, stakeAmount);
      } else {
        await unstake(selectedFarm.poolId, stakeAmount);
      }
      setShowStakeModal(false);
      setStakeAmount('');
      await loadTokenBalances();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(31, 7, 46, 0.9)',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

     {/* Header Bar */}
<header className="bg-transparent">
  <div className="max-w-7xl mx-auto px-8">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img 
          src="/images/badge/favicon.jpeg" 
          alt="OPN Logo" 
          className="w-10 h-10 rounded-full"
        />
        <h1 className="text-2xl font-bold">
          <span className="text-white">OPN</span>
          <span className="text-purple-500">swap</span>
        </h1>
      </div>

      {/* Navigation Tabs - Centered (removed box, kept underline) */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
        {(['swap', 'liquidity', 'pools', 'farm'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-1 py-2 font-medium text-base transition-all relative ${
              activeTab === tab
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-purple-500"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Wallet Info */}
      <div className="flex items-center gap-3">
        {isConnected && (
          <>
            <div className="text-right">
              <div className="text-gray-400 text-xs">Balance</div>
              <div className="text-white font-medium">
                {formatBalance(tokenBalances['0x0000000000000000000000000000000000000000'] || '0', 4)} OPN
              </div>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-2 rounded-xl border border-purple-500/20">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {address?.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <span className="text-white text-sm">
                {address ? `${address.slice(0, 6)}...${address.slice(-4).toUpperCase()}` : ''}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
</header>

      {/* Main Content - Properly centered and sized */}
      <div className="flex justify-center items-start px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px]"
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-6">
            {/* Swap Interface */}
            {activeTab === 'swap' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Swap</h2>
                    <p className="text-gray-400 text-sm">Trade tokens instantly</p>
                  </div>
                  <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>

                {/* From Token */}
                <div className="bg-black/30 rounded-2xl p-4 border border-purple-500/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">From</span>
                    <div className="text-gray-400 text-sm">
                      Balance: {formatBalance(fromToken.balance)} 
                      {fromToken.balance && (
                        <button
                          onClick={() => setFromAmount(fromToken.balance || '0')}
                          className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
                        >
                          MAX
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-white text-3xl outline-none placeholder-gray-600 w-0"
                    />
                    <button 
                      onClick={() => setShowTokenSelectorFor('from')}
                      className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-xl hover:bg-purple-500/20 transition-all flex-shrink-0"
                    >
                      {fromToken.logoURI && (
                        <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-white font-medium">{fromToken.symbol}</span>
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button 
                    onClick={handleSwapTokens}
                    className="p-2.5 bg-black/50 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-all hover:rotate-180 duration-300"
                  >
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                {/* To Token */}
                <div className="bg-black/30 rounded-2xl p-4 border border-purple-500/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">To</span>
                    <span className="text-gray-400 text-sm">
                      Balance: {formatBalance(toToken.balance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="number"
                      value={calculating ? '' : toAmount}
                      readOnly
                      placeholder={calculating ? 'Calculating...' : '0.0'}
                      className="flex-1 bg-transparent text-white text-3xl outline-none placeholder-gray-600 w-0"
                    />
                    <button 
                      onClick={() => setShowTokenSelectorFor('to')}
                      className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-xl hover:bg-purple-500/20 transition-all flex-shrink-0"
                    >
                      {toToken.logoURI && (
                        <img src={toToken.logoURI} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-white font-medium">{toToken.symbol}</span>
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Swap Details */}
                {fromAmount && toAmount && parseFloat(fromAmount) > 0 && parseFloat(toAmount) > 0 && (
                  <div className="bg-black/30 rounded-xl p-3 border border-purple-500/10 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rate</span>
                      <span className="text-white">
                        1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Slippage Tolerance</span>
                      <span className="text-white">{slippage}%</span>
                    </div>
                  </div>
                )}

                {/* Swap Button */}
                <button
                  onClick={handleSwap}
                  disabled={!isConnected || swapLoading || !fromAmount || parseFloat(fromAmount || '0') > parseFloat(fromToken.balance || '0')}
                  className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
                    !isConnected || swapLoading || !fromAmount || parseFloat(fromAmount || '0') > parseFloat(fromToken.balance || '0')
                      ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  }`}
                >
                  {!isConnected ? 'Connect Wallet' :
                   swapLoading ? 'Swapping...' :
                   !fromAmount ? 'Enter Amount' :
                   parseFloat(fromAmount || '0') > parseFloat(fromToken.balance || '0') ? `Insufficient ${fromToken.symbol}` :
                   'Swap'}
                </button>
              </div>
            )}

            {/* Other tabs content */}
            {activeTab === 'liquidity' && (
              <LiquidityInterface activeTab={liquidityTab} setActiveTab={setLiquidityTab}>
                {liquidityTab === 'add' ? (
                  <AddLiquidity
                    tokenA={tokenA}
                    tokenB={tokenB}
                    amountA={amountA}
                    amountB={amountB}
                    onAmountAChange={(value) => setAmountA(value)}
                    onAmountBChange={(value) => setAmountB(value)}
                    onTokenASelect={() => setShowTokenSelectorFor('tokenA')}
                    onTokenBSelect={() => setShowTokenSelectorFor('tokenB')}
                    onAddLiquidity={handleAddLiquidity}
                    loading={liquidityLoading}
                    disabled={!isConnected || !amountA || !amountB}
                    isConnected={isConnected}
                  />
                ) : (
                  <RemoveLiquidity
                    positions={positions}
                    selectedPosition={selectedPosition}
                    removePercentage={removePercentage}
                    onPercentageChange={setRemovePercentage}
                    onSelectPosition={setSelectedPosition}
                    onRemove={handleRemoveLiquidity}
                    loading={liquidityLoading}
                  />
                )}
              </LiquidityInterface>
            )}

            {activeTab === 'pools' && (
              <PoolsList 
                pools={pools}
                loading={poolsLoading}
                onAddLiquidity={handleAddLiquidityFromPool}
              />
            )}

            {activeTab === 'farm' && (
              <FarmList
                farms={farms}
                userStakes={userStakes}
                pendingRewards={pendingRewards}
                loading={farmsLoading}
                onStake={handleStakeClick}
                onUnstake={handleUnstakeClick}
                onHarvest={handleHarvest}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Token Selectors */}
      <TokenSelector
        isOpen={showTokenSelectorFor === 'from'}
        onClose={() => setShowTokenSelectorFor(null)}
        onSelect={(token) => {
          setFromToken(token);
          setShowTokenSelectorFor(null);
        }}
        currentToken={fromToken}
        otherToken={toToken}
        tokenBalances={tokenBalances}
      />

      <TokenSelector
        isOpen={showTokenSelectorFor === 'to'}
        onClose={() => setShowTokenSelectorFor(null)}
        onSelect={(token) => {
          setToToken(token);
          setShowTokenSelectorFor(null);
        }}
        currentToken={toToken}
        otherToken={fromToken}
        tokenBalances={tokenBalances}
      />

      <TokenSelector
        isOpen={showTokenSelectorFor === 'tokenA'}
        onClose={() => setShowTokenSelectorFor(null)}
        onSelect={(token) => {
          setTokenA(token);
          setShowTokenSelectorFor(null);
        }}
        currentToken={tokenA}
        otherToken={tokenB}
        tokenBalances={tokenBalances}
      />

      <TokenSelector
        isOpen={showTokenSelectorFor === 'tokenB'}
        onClose={() => setShowTokenSelectorFor(null)}
        onSelect={(token) => {
          setTokenB(token);
          setShowTokenSelectorFor(null);
        }}
        currentToken={tokenB}
        otherToken={tokenA}
        tokenBalances={tokenBalances}
      />

      {/* Stake Modal */}
      <StakeModal
        isOpen={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        farm={selectedFarm}
        mode={stakeMode}
        amount={stakeAmount}
        onAmountChange={setStakeAmount}
        onConfirm={handleStakeConfirm}
        lpBalance={selectedFarm ? getLPBalance(selectedFarm.lpToken) : '0'}
        stakedBalance={selectedFarm ? userStakes[selectedFarm.poolId] || '0' : '0'}
        loading={farmsLoading}
      />

      {/* Back to Hub Link */}
<div className="text-center py-8">
  <Link 
    href="/" 
    className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
  >
    ← Back to Hub
  </Link>
</div>
    </div>
  );
}