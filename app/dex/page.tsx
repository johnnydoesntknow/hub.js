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
import './styles/dex-styles.css';

// Settings Modal Component (embedded to avoid import issues)
const SwapSettings: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  slippage: string;
  setSlippage: (value: string) => void;
}> = ({ isOpen, onClose, slippage, setSlippage }) => {
  if (!isOpen) return null;

  const handleSlippageClick = (value: string) => {
    setSlippage(value);
  };

  const handleCustomSlippage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 50) {
      setSlippage(value);
    }
  };

  return (
    <div className="settings-modal" onClick={onClose}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">Transaction Settings</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-label">Slippage Tolerance</div>
          
          <div className="slippage-buttons">
            <button
              className={`slippage-button ${slippage === '0.1' ? 'active' : ''}`}
              onClick={() => handleSlippageClick('0.1')}
            >
              0.1%
            </button>
            <button
              className={`slippage-button ${slippage === '0.5' ? 'active' : ''}`}
              onClick={() => handleSlippageClick('0.5')}
            >
              0.5%
            </button>
            <button
              className={`slippage-button ${slippage === '1.0' ? 'active' : ''}`}
              onClick={() => handleSlippageClick('1.0')}
            >
              1.0%
            </button>
          </div>

          <div className="slippage-input-container">
            <input
              type="text"
              className="slippage-input"
              value={slippage}
              onChange={handleCustomSlippage}
              placeholder="0.5"
            />
            <span style={{ color: '#fff' }}>%</span>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">Transaction Deadline</div>
          <div className="deadline-display">
            <span className="deadline-label">Current setting</span>
            <span className="deadline-value">20 minutes</span>
          </div>
        </div>

        <div className="info-message">
          <span className="info-icon">ⓘ</span>
          <span className="info-text">
            Slippage tolerance is the maximum price change you're willing to accept.
          </span>
        </div>

        <div className="info-message">
          <span className="info-icon">ⓘ</span>
          <span className="info-text">
            Transactions will revert if pending for longer than the deadline.
          </span>
        </div>
      </div>
    </div>
  );
};

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
  const [showSettings, setShowSettings] = useState(false);

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

  // Handle from amount change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateOutput(fromAmount);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fromAmount, fromToken, toToken, calculateOutput]);

  // Handle swap execution
  const handleSwap = async () => {
    if (!isConnected || !fromAmount || !toAmount) {
      toast.error('Please enter an amount');
      return;
    }

    try {
      await executeSwap(fromToken, toToken, fromAmount, toAmount, slippage); // Keep as string
      toast.success('Swap successful!');
      setFromAmount('');
      setToAmount('');
      await loadTokenBalances(); // NO PARAMETER
    } catch (error: any) {
      toast.error(error.message || 'Swap failed');
    }
  };

  // Handle token swap
  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Handle liquidity calculations - FIX: Add 4th parameter "A" and handle result as string
  useEffect(() => {
    if (liquidityTab === 'add' && amountA && tokenA && tokenB) {
      const timeoutId = setTimeout(async () => {
        try {
          const calculatedB = await calculateLiquidityAmounts(
            tokenA,
            tokenB,
            amountA,
            "A"  // FIX: Add 4th parameter
          );
          setAmountB(calculatedB); // FIX: calculatedB is already a string
        } catch (error) {
          console.error('Error calculating liquidity:', error);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [amountA, tokenA, tokenB, liquidityTab, calculateLiquidityAmounts]);

  // Handle add liquidity
  const handleAddLiquidity = async () => {
    if (!isConnected || !amountA || !amountB) {
      toast.error('Please enter amounts');
      return;
    }

    try {
      await addLiquidity(tokenA, tokenB, amountA, amountB, parseFloat(slippage)); // Convert to number
      toast.success('Liquidity added successfully!');
      setAmountA('');
      setAmountB('');
      await loadTokenBalances(); // NO PARAMETER
      await loadLiquidityPositions(); // NO PARAMETER
    } catch (error: any) {
      toast.error(error.message || 'Failed to add liquidity');
    }
  };

  // Handle remove liquidity - FIX: Remove address parameters
  const handleRemoveLiquidity = async () => {
    if (!selectedPosition) {
      toast.error('Please select a position');
      return;
    }

    try {
      await removeLiquidity(selectedPosition, removePercentage);
      toast.success('Liquidity removed successfully!');
      setSelectedPosition(null);
      setRemovePercentage(25);
      await loadTokenBalances(); // NO PARAMETER
      await loadLiquidityPositions(); // NO PARAMETER
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove liquidity');
    }
  };

  // Handle add liquidity navigation
  const handleAddLiquidityClick = (token0: Token, token1: Token) => {
    setTokenA(token0);
    setTokenB(token1);
    setActiveTab('liquidity');
    setLiquidityTab('add');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Purple gradient background */}
      <div className="dex-background" />
      <div className="dex-glow" />

      {/* Header */}
      <header className="dex-header">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand - FIX: Add your actual logo */}
            <div className="flex items-center gap-2">
              <img 
                src="/images/badge/favicon.jpeg" 
                alt="OPN Logo" 
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl font-medium text-white">
                OPN<span className="text-purple-400">swap</span>
              </span>
            </div>

            {/* Navigation tabs */}
            <nav className="flex items-center gap-2">
              {(['swap', 'liquidity', 'pools', 'farm'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            {/* Wallet info */}
            <div className="flex items-center gap-3">
              {isConnected && address ? (
                <>
                  <div className="text-sm text-gray-400">
                    <span>Balance</span>
                    <span className="ml-2 text-white">
                      {formatBalance(tokenBalances[fromToken.address] || '0')} OPN
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 rounded-lg">
                    <span className="text-white text-sm font-medium">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  </div>
                </>
              ) : (
                <button className="text-gray-400 text-sm">
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex justify-center items-start px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px]"
        >
          <div className="swap-container rounded-3xl p-6">
            {/* Swap Interface */}
            {activeTab === 'swap' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Swap</h2>
                    <p className="text-gray-400 text-sm">Trade tokens instantly</p>
                  </div>
                  <button 
                    className="settings-btn"
                    onClick={() => setShowSettings(true)}
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>

                {/* From Token */}
                <div className="token-input-card rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">From</span>
                    <div className="text-gray-400 text-sm">
                      Balance: {formatBalance(fromToken.balance)} 
                      {fromToken.balance && (
                        <button
                          onClick={() => setFromAmount(fromToken.balance || '0')}
                          className="ml-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
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
                      className="flex-1 bg-transparent text-white text-3xl outline-none placeholder-gray-500 w-0"
                    />
                    <button 
                      onClick={() => setShowTokenSelectorFor('from')}
                      className="token-selector-btn flex items-center gap-2 px-3 py-2 rounded-xl"
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
                    className="swap-arrows-btn"
                  >
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                {/* To Token */}
                <div className="token-input-card rounded-2xl p-4">
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
                      className="flex-1 bg-transparent text-white text-3xl outline-none placeholder-gray-500 w-0"
                    />
                    <button 
                      onClick={() => setShowTokenSelectorFor('to')}
                      className="token-selector-btn flex items-center gap-2 px-3 py-2 rounded-xl"
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

                {/* Swap Button */}
                <button
                  onClick={handleSwap}
                  disabled={!isConnected || swapLoading || !fromAmount || parseFloat(fromAmount || '0') > parseFloat(fromToken.balance || '0')}
                  className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
                    !isConnected || swapLoading || !fromAmount || parseFloat(fromAmount || '0') > parseFloat(fromToken.balance || '0')
                      ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                      : 'swap-button-active text-white'
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

            {/* Liquidity Interface */}
            {activeTab === 'liquidity' && (
              <LiquidityInterface activeTab={liquidityTab} setActiveTab={setLiquidityTab}>
                {liquidityTab === 'add' ? (
                  <AddLiquidity
                    tokenA={tokenA}
                    tokenB={tokenB}
                    amountA={amountA}
                    amountB={amountB}
                    onAmountAChange={setAmountA}
                    onAmountBChange={setAmountB}
                    onTokenASelect={() => setShowTokenSelectorFor('tokenA')}
                    onTokenBSelect={() => setShowTokenSelectorFor('tokenB')}
                    onAddLiquidity={handleAddLiquidity}
                    loading={liquidityLoading}
                    disabled={!isConnected || liquidityLoading || !amountA || !amountB}
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

            {/* Pools Interface - WITH ALL UI ELEMENTS */}
            {activeTab === 'pools' && (
              <div className="pools-container">
                <div className="pools-header">
                  <h2 className="pools-title">Pools</h2>
                  <p className="pools-subtitle">Add liquidity to pools and earn fees on swaps.</p>
                </div>

                <input
                  type="text"
                  className="pools-search"
                  placeholder="Search by name or paste address"
                />

                <div className="pools-filters">
                  <label className="hide-small-pools">
                    <input type="checkbox" />
                    <span>Hide small pools</span>
                  </label>
                  <button className="new-position-button">
                    + New Position
                  </button>
                </div>

                <div className="pools-table-header">
                  <span>Pool</span>
                  <span>TVL</span>
                  <span>24h Volume</span>
                  <span>7d Volume</span>
                  <span>24h Fees</span>
                </div>

                <PoolsList
                  pools={pools}
                  loading={poolsLoading}
                  onAddLiquidity={handleAddLiquidityClick}
                />
              </div>
            )}

            {/* Farm Interface - WITH ALL UI ELEMENTS */}
            {activeTab === 'farm' && (
              <div className="farm-container">
                <div className="farm-header">
                  <h2 className="farm-title">Yield Farming</h2>
                  <p className="farm-subtitle">Stake LP tokens to earn WOPN rewards</p>
                </div>

                <div className="farm-stats">
                  <div className="farm-stat-card">
                    <div className="farm-stat-label">Total Value Locked</div>
                    <div className="farm-stat-value">$0</div>
                  </div>
                  <div className="farm-stat-card">
                    <div className="farm-stat-label">Your Total Staked</div>
                    <div className="farm-stat-value">$0.00</div>
                  </div>
                  <div className="farm-stat-card">
                    <div className="farm-stat-label">Total Rewards</div>
                    <div className="farm-stat-value purple">
                      {formatBalance(
                        Object.values(pendingRewards).reduce((sum, val) => sum + parseFloat(val || '0'), 0).toString()
                      )} WOPN
                    </div>
                  </div>
                </div>

                {farmsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                ) : farms.length === 0 ? (
                  <div className="no-farms">
                    <div className="no-farms-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="no-farms-title">No farms available</div>
                    <div className="no-farms-subtitle">Check back later for farming opportunities</div>
                  </div>
                ) : (
                  <FarmList
                    farms={farms}
                    userStakes={userStakes}
                    pendingRewards={pendingRewards}
                    loading={farmsLoading}
                    onStake={(poolId) => {
                      const farm = farms.find(f => f.poolId === poolId);
                      if (farm) {
                        setSelectedFarm(farm);
                        setStakeMode('stake');
                        setShowStakeModal(true);
                      }
                    }}
                    onUnstake={(poolId) => {
                      const farm = farms.find(f => f.poolId === poolId);
                      if (farm) {
                        setSelectedFarm(farm);
                        setStakeMode('unstake');
                        setShowStakeModal(true);
                      }
                    }}
                    onHarvest={harvest}
                  />
                )}
              </div>
            )}
          </div>

          {/* Back to Hub Link */}
          <div className="text-center mt-6">
            <Link href="/hub" className="back-to-hub">
              ← Back to Hub
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Token Selector Modal */}
      {showTokenSelectorFor && (
        <TokenSelector
          isOpen={true}
          onClose={() => setShowTokenSelectorFor(null)}
          onSelect={(token) => {
            if (showTokenSelectorFor === 'from') setFromToken(token);
            else if (showTokenSelectorFor === 'to') setToToken(token);
            else if (showTokenSelectorFor === 'tokenA') setTokenA(token);
            else if (showTokenSelectorFor === 'tokenB') setTokenB(token);
            setShowTokenSelectorFor(null);
          }}
          currentToken={showTokenSelectorFor === 'from' ? fromToken : 
                        showTokenSelectorFor === 'to' ? toToken :
                        showTokenSelectorFor === 'tokenA' ? tokenA : tokenB}
          otherToken={showTokenSelectorFor === 'from' ? toToken : 
                      showTokenSelectorFor === 'to' ? fromToken :
                      showTokenSelectorFor === 'tokenA' ? tokenB : tokenA}
          tokenBalances={tokenBalances}
        />
      )}

      {/* Settings Modal */}
      <SwapSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        slippage={slippage}
        setSlippage={setSlippage}
      />

      {/* Stake Modal */}
      {showStakeModal && selectedFarm && (
        <StakeModal
          isOpen={showStakeModal}
          onClose={() => {
            setShowStakeModal(false);
            setStakeAmount('');
          }}
          farm={selectedFarm}
          mode={stakeMode}
          amount={stakeAmount}
          onAmountChange={setStakeAmount}
          onConfirm={async () => {
            try {
              if (stakeMode === 'stake') {
                await stake(selectedFarm.poolId, stakeAmount);
                toast.success('Staked successfully!');
              } else {
                await unstake(selectedFarm.poolId, stakeAmount);
                toast.success('Unstaked successfully!');
              }
              setShowStakeModal(false);
              setStakeAmount('');
            } catch (error: any) {
              toast.error(error.message || 'Transaction failed');
            }
          }}
          lpBalance={getLPBalance(selectedFarm.lpToken)}
          stakedBalance={userStakes[selectedFarm.poolId] || '0'}
          loading={false}
        />
      )}
    </div>
  );
}