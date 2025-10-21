'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FarmPool } from '../../types';
import { formatBalance } from '../../utils/formatters';

interface StakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: FarmPool | null;
  mode: 'stake' | 'unstake';
  amount: string;
  onAmountChange: (value: string) => void;
  onConfirm: () => void;
  lpBalance: string;
  stakedBalance: string;
  loading: boolean;
}

export const StakeModal: React.FC<StakeModalProps> = ({
  isOpen,
  onClose,
  farm,
  mode,
  amount,
  onAmountChange,
  onConfirm,
  lpBalance,
  stakedBalance,
  loading,
}) => {
  if (!isOpen || !farm) return null;

  const maxAmount = mode === 'stake' ? lpBalance : stakedBalance;
  const title = mode === 'stake' ? 'Stake LP Tokens' : 'Unstake LP Tokens';
  const buttonText = mode === 'stake' ? 'Stake' : 'Unstake';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex -space-x-2">
                {farm.token0.logoURI && (
                  <img 
                    src={farm.token0.logoURI} 
                    alt={farm.token0.symbol}
                    className="w-6 h-6 rounded-full border-2 border-slate-800"
                  />
                )}
                {farm.token1.logoURI && (
                  <img 
                    src={farm.token1.logoURI} 
                    alt={farm.token1.symbol}
                    className="w-6 h-6 rounded-full border-2 border-slate-800"
                  />
                )}
              </div>
              <span className="text-white font-medium">
                {farm.token0.symbol}-{farm.token1.symbol} LP
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Available: {formatBalance(maxAmount)} LP
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-white text-2xl outline-none"
            />
            <div className="flex justify-between mt-2">
              <span className="text-gray-400 text-sm">Amount to {mode}</span>
              <button
                onClick={() => onAmountChange(maxAmount)}
                className="text-purple-400 text-sm hover:text-purple-300"
              >
                MAX
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || !amount || parseFloat(amount) === 0}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                loading || !amount || parseFloat(amount) === 0
                  ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {loading ? 'Processing...' : buttonText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};