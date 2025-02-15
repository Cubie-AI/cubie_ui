import { clusterApiUrl, Transaction } from "@solana/web3.js";
import { createContext, useContext, useMemo, useState } from "react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

interface WalletContextType {
  wallet: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (transaction: Transaction) => Promise<string>;
}

const CubieWalletContext = createContext<WalletContextType>({
  wallet: null,
  connect: async () => {},
  disconnect: async () => {},
  signMessage: async (message: string) => {
    throw new Error("Not implemented");
  },
  signTransaction: async (transaction: Transaction) => {
    throw new Error("Not implemented");
  },
});

export function CubieWalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);

  const connect = async () => {};

  const disconnect = async () => {};

  const signMessage = async (message: string) => {
    throw new Error("Not implemented");
  };

  const signTransaction = async (transaction: Transaction) => {
    throw new Error("Not implemented");
  };

  const network = WalletAdapterNetwork.Devnet;
 
    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
 
    const supportedWallets = useMemo(() => [], [network]);
  
  return (
    <CubieWalletContext.Provider
      value={{ wallet, connect, disconnect, signMessage, signTransaction }}
    >
      <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={supportedWallets }>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
      {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    </CubieWalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(CubieWalletContext);
}
