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
import { CandlestickChart, Github, MessageCircle, Twitter } from "lucide-react";
import { useMemo } from "react";

const ICON_SIZE = 16;
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
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <a
                    href="https://x.com/cubieai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Twitter size={ICON_SIZE} />
                  </a>
                  <a
                    href="https://t.me/cubie_portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <MessageCircle size={ICON_SIZE} />
                  </a>
                  <a
                    href="https://github.com/cubie-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Github size={ICON_SIZE} />
                  </a>
                  <a
                    href="https://dexscreener.com/solana/v8juexssous63zrppaydwnxwmuuwaba335jzccqtckw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <CandlestickChart size={ICON_SIZE} />
                  </a>
                </div>
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
