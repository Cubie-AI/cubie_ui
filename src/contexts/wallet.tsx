import { clusterApiUrl, Transaction } from "@solana/web3.js";
import { createContext,  useMemo, useState } from "react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletMultiButton, 
} from '@solana/wallet-adapter-react-ui';
import "@solana/wallet-adapter-react-ui/styles.css"
import { Button } from "@/components/ui/button"


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
  signMessage: async () => {
    throw new Error("Not implemented");
  },
  signTransaction: async () => {
    throw new Error("Not implemented");
  },
});

export function CubieWalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);

  const connect = async () => {};

  const disconnect = async () => {};

  const signMessage = async (message: string) => {
    console.log("signMessage", message);
    throw new Error("Not implemented");
  };

  const signTransaction = async (transaction: Transaction) => {
    console.log("signTransaction", transaction);
    throw new Error("Not implemented");
  };

  const endpoint = clusterApiUrl("devnet");
  const supportedWallets = useMemo(() => [], []);


  return (
    <CubieWalletContext.Provider
      value={{ wallet, connect, disconnect, signMessage, signTransaction }}
    >
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={supportedWallets} autoConnect={true}>
          <WalletModalProvider>
            <div className="absolute top-4 right-4 md:top-8 md:right-8">
              <Button variant="outline" className="font-normal h-auto w-auto px-4 py-2">
                <WalletMultiButton />
              </Button>
            </div>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </CubieWalletContext.Provider>
  );
}

