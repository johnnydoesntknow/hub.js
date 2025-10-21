'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { DApp } from '@/lib/dapps';
import { useRouter } from 'next/navigation';

interface DappModalProps {
  dapp: DApp | null;
  onClose: () => void;
}

export default function DappModal({ dapp, onClose }: DappModalProps) {
  const router = useRouter();

  const handleLaunch = () => {
    if (dapp) {
      router.push(dapp.url);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {dapp && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Content */}
              <div className="text-center">
                <div className="text-6xl mb-4">{dapp.icon}</div>
                <h2 className="text-2xl font-bold text-iopn-navy mb-2">
                  {dapp.name}
                </h2>
                {dapp.status === 'coming-soon' && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-4">
                    Coming Soon
                  </span>
                )}
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {dapp.description}
                </p>

                {/* Action Button */}
                {dapp.status === 'live' ? (
                  <button
                    onClick={handleLaunch}
                    className="w-full py-3 bg-iopn-navy text-white rounded-lg font-medium hover:bg-iopn-purple transition-colors"
                  >
                    Launch {dapp.name}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}