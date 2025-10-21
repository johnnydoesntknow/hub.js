import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { BADGE_ENV, BADGE_CHAIN, OG_BADGE_ABI } from './constants';

// Get RPC URL from chain config
const RPC_URL = BADGE_CHAIN.rpcUrls.default.http[0];

export async function checkClaimStatus(address: `0x${string}`) {
  const publicClient = createPublicClient({
    chain: BADGE_CHAIN as any,
    transport: http(RPC_URL, {
      timeout: 10_000, // Reduced to 10 seconds for faster feedback
      retryCount: 2, // Reduced retries
      retryDelay: 500, // Faster retry
    }),
  });

  try {
    // Check both in parallel for speed
    const [isClaimOpen, balance] = await Promise.all([
      publicClient.readContract({
        address: BADGE_ENV.CONTRACT_ADDRESS,
        abi: OG_BADGE_ABI,
        functionName: 'claimOpen',
      }),
      publicClient.readContract({
        address: BADGE_ENV.CONTRACT_ADDRESS,
        abi: OG_BADGE_ABI,
        functionName: 'balanceOf',
        args: [address],
      }),
    ]);

    return {
      claimOpen: isClaimOpen,
      hasClaimed: balance > BigInt(0),
    };
  } catch (error: any) {
    console.error('❌ Contract call failed:', error?.shortMessage || error?.message);
    throw error;
  }
}

export async function claimBadge(
  address: `0x${string}`,
  provider: any,
  onTransactionHash?: (hash: `0x${string}`) => void
) {
  const walletClient = createWalletClient({
    account: address,
    chain: BADGE_CHAIN as any,
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain: BADGE_CHAIN as any,
    transport: http(RPC_URL, {
      timeout: 30_000,
      retryCount: 3,
      retryDelay: 1000,
    }),
  });

  // Write the claim transaction
  const hash = await walletClient.writeContract({
    address: BADGE_ENV.CONTRACT_ADDRESS,
    abi: OG_BADGE_ABI,
    functionName: 'claim',
    chain: BADGE_CHAIN as any,
  });

  console.log('✅ Transaction submitted:', hash);
  onTransactionHash?.(hash);

  // Wait for confirmation
  try {
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
      timeout: 120_000,
      pollingInterval: 2_000,
    });

    if (receipt.status === 'success') {
      console.log('✅ Transaction confirmed:', hash);
      return { success: true, hash };
    } else {
      throw new Error('Transaction reverted');
    }
  } catch (receiptError) {
    console.warn('⚠️ Receipt lookup timed out, checking balance...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const balance = await publicClient.readContract({
      address: BADGE_ENV.CONTRACT_ADDRESS,
      abi: OG_BADGE_ABI,
      functionName: 'balanceOf',
      args: [address],
    });
    
    if (balance > BigInt(0)) {
      console.log('✅ Balance confirmed - claim successful');
      return { success: true, hash };
    }
    
    throw new Error(`Transaction may still be processing. Hash: ${hash}`);
  }
}