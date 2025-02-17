import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, []);

  return (
    <Button
      variant="outline"
      className={`w-full flex items-center gap-2 font-mono truncate ${
        copied ? "border-green-500 text-green-500" : ""
      }`}
      onClick={() => copyToClipboard()}
    >
      <span className="truncate max-w-[200px]">{text}</span>
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
