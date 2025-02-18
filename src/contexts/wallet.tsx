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
    "https://palpable-flashy-water.solana-mainnet.quiknode.pro/a24d45a88242df8cc4f32c8070df47b66e287c25";
  const supportedWallets = useMemo(() => [], []);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        wsEndpoint:
          "wss://palpable-flashy-water.solana-mainnet.quiknode.pro/a24d45a88242df8cc4f32c8070df47b66e287c25",
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
