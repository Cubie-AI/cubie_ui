import { sendRequest } from "@/lib/utils";
import { toast } from "sonner";
import { Quote } from "./types";

export async function fetchQuote(
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
