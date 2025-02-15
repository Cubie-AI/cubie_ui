import { createContext,  useEffect,  useMemo, useState } from "react";
import { ConnectionContextState, ConnectionProvider, useConnection, useWallet, WalletContextState, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletMultiButton, 
} from '@solana/wallet-adapter-react-ui';
import "@solana/wallet-adapter-react-ui/styles.css"
import { Button } from "@/components/ui/button"
import { WalletSignMessageError } from "@solana/wallet-adapter-base";
import { toast } from "sonner";
import bs58 from "bs58";

interface WalletContextType {
  // wallet: string | null;
  // connect: () => Promise<void>;
  // disconnect: () => Promise<void>;
  // signMessage: (message: string) => Promise<string>;
  // signTransaction: (transaction: Transaction) => Promise<string>;
}

const CubieWalletContext = createContext<WalletContextType>({
  // wallet: null,
  // connect: async () => {},
  // disconnect: async () => {},
  // signMessage: async () => {
  //   throw new Error("Not implemented");
  // },
  // signTransaction: async () => {
  //   throw new Error("Not implemented");
  // },
});

export function useCubieWallet(): [WalletContextState, string | null, ConnectionContextState] {
  const wallet = useWallet();
  const connection = useConnection();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || null);

  const signIn = async () => {
    if(!wallet || !wallet.signMessage || !wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }
    const nonce = await fetch(`/api/auth/nonce?address=${wallet.publicKey.toBase58()}`);
    if(!nonce.ok) {
      console.error("Failed to fetch nonce");
      return;
    }
    const nonceData = await nonce.json();
    console.log("nonceData", nonceData);
    try {
      const signedMessage = await wallet.signMessage(new TextEncoder().encode(nonceData.nonce));
      const signature = bs58.encode(signedMessage);
    const response = await fetch("/api/auth/sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signature, address: wallet.publicKey.toBase58(), nonce: nonceData.nonce }),
    });
    if(!response.ok) {
      if (response.status === 500) {
        toast.error("Failed to sign in");
        wallet.disconnect();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error);
      }
      console.error("Failed to sign in");
      return;
      }
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast.success("Signed in successfully");
    } catch (error) {
      if (error instanceof WalletSignMessageError) {
        toast.error("User rejected the message");
        wallet.disconnect();
      }
      console.error("Failed to sign in", error);
    }
  };

  const disconnect = async () => {
    setToken(null);
    localStorage.removeItem("token");
  };



  useEffect(() => {
    if (wallet.connected && !token) {
      signIn();
    } else if (wallet.disconnecting && token) {
      disconnect();
    }
  }, [wallet]);

  return [wallet, token, connection];
}

export function CubieWalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, _setWallet] = useState<string | null>(null);


  const endpoint = 'https://magical-radial-thunder.solana-mainnet.quiknode.pro/44c4370a09470acd8571d8d16d0f3a7aa43714b7';
  const supportedWallets = useMemo(() => [], []);


  return (
   
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={supportedWallets} autoConnect={true}>
          <WalletModalProvider>
            <div className="absolute top-4 right-4 md:top-8 md:right-8">
              <Button variant="outline" className="font-normal h-auto w-auto px-4 py-2">
                <WalletMultiButton />
              </Button>
            </div>
             <CubieWalletContext.Provider
              value={{ wallet }}>
              {children}
            </CubieWalletContext.Provider>

          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  );
}

