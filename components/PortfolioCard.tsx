'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PortfolioCardProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

export default function PortfolioCard({ title, children, delay = 0 }: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-6 shadow-glass hover:shadow-glass-hover dark:shadow-glass-dark dark:hover:shadow-glass-dark-hover transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-iopn-purple dark:text-white/90 mb-4">{title}</h3>
      <div className="text-iopn-navy dark:text-white">{children}</div>
    </motion.div>
  );
}