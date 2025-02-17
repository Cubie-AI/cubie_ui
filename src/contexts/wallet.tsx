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
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <Button variant="outline">
              <WalletMultiButton />
            </Button>
          </div>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
