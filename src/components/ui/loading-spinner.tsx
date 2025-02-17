import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className={cn("h-8 w-8 animate-spin", className)} />
    </div>
  );
}
