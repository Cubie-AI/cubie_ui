import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { SwapTab } from "./SwapTab";
import { SwapProps } from "./types";

export function Swap({ mint, ticker }: SwapProps) {
  const [slippage, setSlippage] = useState(5.0);
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="p-4 border rounded-lg space-y-4">
      {/* Slippage Control */}
      <div className="flex justify-end items-center gap-2">
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

      <Tabs defaultValue="buy" className="w-full">
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
          />
        </TabsContent>
        <TabsContent value="sell" className="space-y-4">
          <SwapTab
            mint={mint}
            type="sell"
            decimals={9}
            placeholder={`100000 $${ticker}`}
            slippage={slippage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
