/* wallet connect page */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useWallet } from '@/components/providers/WalletProvider';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const { login, isConnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/hub');
    }
  }, [isConnected, router]);

  return (
<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-4 relative">      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl w-full">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <img 
            src="/iopn.jpg" 
            alt="OPN Hub Logo" 
            className="w-32 h-32 rounded-full"
          />
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-iopn-purple to-iopn-blue bg-clip-text text-transparent">
            OPN Hub
          </h1>
          <p className="text-xl lg:text-2xl text-iopn-navy dark:text-gray-200 mb-4 font-light">
            Your Gateway to the Internet of People
          </p>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access all IOPn decentralized applications from one unified hub
          </p>
        </motion.div>

        {/* Connect Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center mb-16"
        >
          <button
            onClick={login}
            className="px-8 py-4 bg-gradient-to-r from-iopn-purple to-iopn-blue text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Connect Wallet
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Unified Access */}
          <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-iopn-purple dark:text-iopn-cyan mb-2">
              Unified Access
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              One wallet for all dApps
            </p>
          </div>

          {/* Secure */}
          <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-iopn-purple dark:text-iopn-cyan mb-2">
              Secure
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enterprise-grade security
            </p>
          </div>

          {/* Seamless */}
          <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-iopn-purple dark:text-iopn-cyan mb-2">
              Seamless
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Connect once, use everywhere
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}