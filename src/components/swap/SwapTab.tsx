import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCubieWallet } from "@/hooks/wallet-hook";
import { sendRequest } from "@/lib/utils";
import { getProvider } from "@/pages/launch/LaunchPage";
import { SendTransactionError, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SwapSuccess } from "../toasts/LaunchSuccess";
import { Quote, SwapTabProps } from "./types";
import { fetchQuote } from "./util";

export function SwapTab({ mint, type, decimals, placeholder }: SwapTabProps) {
  const { connection, token, wallet } = useCubieWallet();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [outputAmount, setOutputAmount] = useState(0);
  const [amount, setAmount] = useState("");

  const handleInputChange = (value: string) => {
    setAmount(value);
  };

  const getQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    if (!token) {
      toast.error("Connect your wallet to swap");
      return;
    }

    const quote = await fetchQuote(type, amount, mint, token);
    if (!quote) {
      toast.error("Unable to get swap quote");
      return;
    }
    setQuote(quote);
    setOutputAmount(Number(quote.outAmount) / 10 ** decimals);
  };

  const getTransaction = async () => {
    if (!quote) {
      return;
    }

    if (!wallet || !wallet.signTransaction) {
      toast.error("Wallet not connected");
      return;
    }
    console.log("Getting transaction");
    console.log(quote);
    const { error, data } = await sendRequest<{ swapTransaction: string }>(
      `/api/trade/transaction`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          quote,
        }),
      }
    );
    if (error || !data) {
      toast.error(error || "Unable to get swap transaction");
      return;
    }

    try {
      const provider = getProvider();
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(data.swapTransaction, "base64")
      );
      let signature: string;
      if (provider) {
        const signAndSend = await provider.signAndSendTransaction(transaction);
        signature = signAndSend.signature;
      } else {
        const signedTransaction = await wallet.signTransaction(transaction);
        signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          {
            maxRetries: 5,
          }
        );
      }

      toast.success(() => <SwapSuccess signature={signature} />);
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed");
      if (error instanceof SendTransactionError) {
        console.log(await error.getLogs(connection));
      }
    }
  };

  useEffect(() => {
    getQuote();
  }, [amount]);

  return (
    <div className="space-y-2">
      <Input
        type="number"
        placeholder={placeholder}
        value={amount}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <Button className="w-full" size="lg" onClick={() => getTransaction()}>
        {type === "buy" ? "Buy" : "Sell"}
      </Button>
      {outputAmount > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          You will receive: {outputAmount.toLocaleString()}{" "}
          {type === "buy" ? "tokens" : "SOL"}
        </div>
      )}
    </div>
  );
}
