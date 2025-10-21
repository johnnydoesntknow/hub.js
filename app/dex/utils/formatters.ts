export const formatBalance = (balance: string | undefined, decimals: number = 4): string => {
  if (!balance) return '0.0';
  const num = parseFloat(balance);
  if (num === 0) return '0.0';
  if (num < 0.0001) return '<0.0001';
  return num.toFixed(decimals);
};

export const formatTokenAmount = (amount: string, decimals: number): string => {
  try {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0';
    return num.toFixed(Math.min(6, decimals));
  } catch {
    return '0';
  }
};