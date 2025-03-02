import { Button } from "@/components/ui/button";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useMemo } from "react";

export function CubieWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const endpoint =
    "https://alpha-ancient-gadget.solana-mainnet.quiknode.pro/46813a83659fb92a05018b2351091382e5a4fbb1/";
  const supportedWallets = useMemo(() => [], []);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        wsEndpoint:
          "wss://alpha-ancient-gadget.solana-mainnet.quiknode.pro/46813a83659fb92a05018b2351091382e5a4fbb1/",
      }}
    >
      <WalletProvider wallets={supportedWallets} autoConnect={true}>
        <WalletModalProvider>
          <div className="flex flex-col min-h-screen">
            <div className="container mx-auto p-4">
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <WalletMultiButton />
                </Button>
              </div>
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
