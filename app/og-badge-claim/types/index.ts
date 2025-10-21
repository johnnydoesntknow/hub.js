export type BadgePage = 'landing' | 'video' | 'claim' | 'success';

export interface BadgeEnv {
  VIDEO_URL: string;
  CONTRACT_ADDRESS: `0x${string}`;
  METADATA_URI: string;
  IMAGE_URI: string;
  METADATA_GATEWAY: string;
  IMAGE_GATEWAY: string;
}

export interface ChainConfig {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
    public: {
      http: string[];
    };
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
  testnet: boolean;
}

export interface WalletContextType {
  address?: string;
  isConnected: boolean;
  chainId?: number;
  switchChain: (chainId: number) => Promise<void>;
  getEthereumProvider: () => Promise<any>;
}