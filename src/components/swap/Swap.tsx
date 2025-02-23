import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCubieWallet } from "@/hooks/wallet-hook";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { SwapTab } from "./SwapTab";
import { BalanceStateParams, SwapProps } from "./types";

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export function Swap({ mint, ticker }: SwapProps) {
  const { connection, wallet } = useCubieWallet();

  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [slippage, setSlippage] = useState(5.0);
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [balances, setBalances] = useState<BalanceStateParams>({
    solanaBalance: "",
    tokenBalance: "",
  });

  useEffect(() => {
    const getBalances = async () => {
      if (!wallet || !wallet.publicKey) {
        return;
      }
      const address = wallet.publicKey;
      const [associatedAddress] = PublicKey.findProgramAddressSync(
        [
          wallet.publicKey?.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          new PublicKey(mint).toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const tokenAccount = await connection.getTokenAccountBalance(
        associatedAddress
      );

      const solanaBalance = await connection.getAccountInfo(address);

      setBalances({
        solanaBalance: "" + (solanaBalance?.lamports || 0) / LAMPORTS_PER_SOL,
        tokenBalance: tokenAccount.value?.uiAmountString ?? "",
      });
    };

    getBalances();
  }, [connection]);

  const handleSlippageChange = (value: string) => {
    // Allow empty string and numbers only
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    const num = parseFloat(inputValue);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      // Round to 1 decimal place
      setSlippage(Math.round(num * 10) / 10);
    }
    setInputValue(""); // Reset input value
  };

  const handleFocus = () => {
    setIsEditing(true);
    setInputValue(slippage.toString());
  };

  const updateBalance = useCallback(
    async (updatedBalances: {
      solanaBalance: number;
      tokenBalance: number;
    }) => {
      console.log("updateBalance", updatedBalances);
      console.log("balances", balances);
      const balance = {
        solanaBalance:
          "" +
          Math.floor(
            (Number(balances.solanaBalance) + updatedBalances.solanaBalance) *
              LAMPORTS_PER_SOL
          ) /
            LAMPORTS_PER_SOL,
        tokenBalance:
          "" +
          Math.floor(
            (Number(balances.tokenBalance) + updatedBalances.tokenBalance) *
              Math.pow(10, 6)
          ) /
            Math.pow(10, 6),
      };
      setBalances(balance);
    },
    [balances]
  );

  return (
    <div className="p-4 border rounded-lg space-y-4">
      {/* Header Row */}
      <div className="flex justify-between items-center">
        {/* Balance Display */}
        <div className="text-sm text-muted-foreground">
          Balance:{" "}
          {tab === "buy"
            ? `${balances.solanaBalance} SOL`
            : `${balances.tokenBalance} ${ticker}`}
        </div>
        {/* Slippage Control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Slippage:</span>
          {isEditing ? (
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleSlippageChange(e.target.value)}
              onBlur={handleBlur}
              className="w-20 h-6 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
            />
          ) : (
            <button
              onClick={handleFocus}
              className="text-sm hover:text-primary transition-colors"
            >
              {slippage}%
            </button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="buy"
        className="w-full"
        onValueChange={(value) => setTab(value as "buy" | "sell")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>
        <TabsContent value="buy" className="space-y-4">
          <SwapTab
            mint={mint}
            type="buy"
            decimals={6}
            placeholder="0.5 SOL"
            slippage={slippage}
            updateBalance={updateBalance}
          />
        </TabsContent>
        <TabsContent value="sell" className="space-y-4">
          <SwapTab
            mint={mint}
            type="sell"
            decimals={9}
            placeholder={`100000 $${ticker}`}
            slippage={slippage}
            updateBalance={updateBalance}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
