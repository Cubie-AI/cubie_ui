export interface SwapProps {
  mint: string;
  ticker: string;
}

export interface Quote {
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

export interface BalanceStateParams {
  solanaBalance: string;
  tokenBalance: string;
}
export interface SwapTabProps {
  mint: string;
  type: "buy" | "sell";
  decimals: number;
  placeholder?: string;
  slippage: number;
  updateBalance: (params: {
    solanaBalance: number;
    tokenBalance: number;
  }) => void;
}
