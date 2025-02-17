import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCubieWallet } from "@/hooks/wallet-hook";
import { sendRequest } from "@/lib/utils";
import { getProvider } from "@/pages/launch/LaunchPage";
import { SendTransactionError, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SwapSuccess } from "../toasts/LaunchSuccess";

interface SwapProps {
  mint: string;
}

interface Quote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: number | null;
  priceImpactPct: string;
  routePlan: {
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }[];
  contextSlot: number;
  timeTaken: number;
}

async function fetchQuote(
  type: "buy" | "sell",
  uiAmount: string,
  mint: string,
  token: string
) {
  const slippageBps = 50;
  let inputMint = "So11111111111111111111111111111111111111112";
  let outputMint = mint;
  let amount = Math.floor(parseFloat(uiAmount) * 10 ** 9);
  if (type === "sell") {
    inputMint = mint;
    outputMint = "So11111111111111111111111111111111111111112";
    amount = Math.floor(parseFloat(uiAmount) * 10 ** 6);
  }

  if (!amount) {
    return;
  }

  const { error, data } = await sendRequest<Quote>(
    `/api/trade/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (error || !data) {
    toast.error(error || "Unable to get swap quote");
    return;
  }

  return data;
}

function SwapForm({
  mint,
  type,
  decimals,
}: {
  mint: string;
  type: "buy" | "sell";
  decimals: number;
}) {
  const { connection, token, wallet } = useCubieWallet();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [outputAmount, setOutputAmount] = useState(0);
  const [amount, setAmount] = useState("");

  const handleInputChange = (value: string) => {
    setAmount(value);
  };

  const getQuote = async () => {
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
        placeholder="0.5"
        value={amount}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <Button className="w-full" size="lg" onClick={() => getTransaction()}>
        Buy
      </Button>
      {outputAmount > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          You will receive: {outputAmount.toLocaleString()} tokens
        </div>
      )}
    </div>
  );
}

export function Swap({ mint }: SwapProps) {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>
        <TabsContent value="buy" className="space-y-4">
          <SwapForm mint={mint} type="buy" decimals={6} />
        </TabsContent>
        <TabsContent value="sell" className="space-y-4">
          <SwapForm mint={mint} type="sell" decimals={9} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
