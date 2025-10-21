# Network Switching Guide

## 🔄 How to Switch Between Sepolia and OPN Chain

All network configuration is driven by `.env.local` - no code changes needed!

---

## 📋 Current Setup: SEPOLIA (Testing)

**Active configuration in `.env.local`:**
```bash
NEXT_PUBLIC_BADGE_CHAIN_ID=11155111
NEXT_PUBLIC_BADGE_CHAIN_NAME=Sepolia
NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_NAME=Sepolia ETH
NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_SYMBOL=ETH
NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_DECIMALS=18
NEXT_PUBLIC_BADGE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_BADGE_BLOCK_EXPLORER_NAME=Etherscan Sepolia
NEXT_PUBLIC_BADGE_BLOCK_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_BADGE_IS_TESTNET=true
```

---

## 🚀 Switch to OPN CHAIN (Production)

### Step 1: Update .env.local

Comment out Sepolia config and uncomment OPN Chain config:

```bash
# ACTIVE NETWORK: SEPOLIA (Testing)
# NEXT_PUBLIC_BADGE_CHAIN_ID=11155111
# NEXT_PUBLIC_BADGE_CHAIN_NAME=Sepolia
# ... (comment out all Sepolia lines)

# PRODUCTION NETWORK: OPN CHAIN (Uncomment when ready to switch)
NEXT_PUBLIC_BADGE_CHAIN_ID=984
NEXT_PUBLIC_BADGE_CHAIN_NAME=OPN Testnet
NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_NAME=OPN
NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_SYMBOL=OPN
NEXT_PUBLIC_BADGE_NATIVE_CURRENCY_DECIMALS=18
NEXT_PUBLIC_BADGE_RPC_URL=https://testnet-rpc.iopn.tech
NEXT_PUBLIC_BADGE_BLOCK_EXPLORER_NAME=OPN Testnet Explorer
NEXT_PUBLIC_BADGE_BLOCK_EXPLORER_URL=https://testnet.iopn.tech
NEXT_PUBLIC_BADGE_IS_TESTNET=true
```

### Step 2: Update Contract Address (if different)

```bash
NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=0xYourOPNChainContractAddress
```

### Step 3: Restart Dev Server

```bash
rm -rf .next
yarn dev
```

---

## 🔍 Verify Configuration

Open browser console and check for:
```
🔗 Badge Chain Configuration: {
  chainId: 984,
  chainName: 'OPN Testnet',
  rpcUrl: 'https://testnet-rpc.iopn.tech',
  contract: '0x...',
  testnet: true
}
```

---

## 📝 Alternative RPC Endpoints

If you experience RPC issues, try these alternatives:

### Sepolia
- Public Node: `https://ethereum-sepolia-rpc.publicnode.com`
- Ankr: `https://rpc.ankr.com/eth_sepolia`
- Infura: `https://sepolia.infura.io/v3/YOUR_KEY`

### OPN Chain
- Main: `https://testnet-rpc.iopn.tech`
- (Add backup RPCs if available)

---

## 🎯 Production Checklist

Before switching to OPN Chain mainnet:

- [ ] Update contract address
- [ ] Test on OPN testnet first
- [ ] Update RPC URL to mainnet
- [ ] Change `NEXT_PUBLIC_BADGE_IS_TESTNET=false`
- [ ] Update block explorer URLs
- [ ] Verify all transactions work
- [ ] Update NFT metadata if needed