import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { CommentProps } from "./types";

export function Comment({
  id,
  replyTo,
  content,
  address,
  onReply,
  isReplying,
  isHighlighted,
  onHighlight,
  isDev,
}: CommentProps) {
  const commentRef = useRef<HTMLDivElement>(null);
  const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  useEffect(() => {
    if (isHighlighted && commentRef.current) {
      commentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isHighlighted]);

  return (
    <div
      ref={commentRef}
      className={cn(
        "p-4 border rounded-lg space-y-2",
        isHighlighted && "bump-animation"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            {truncatedAddress}
          </span>
          {isDev && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              dev
            </span>
          )}
          <button
            onClick={onReply}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            [reply]
          </button>
        </div>
      </div>
      <div className="text-sm">
        {replyTo && (
          <a
            href={`#comment-${replyTo}`}
            onClick={(e) => {
              e.preventDefault();
              onHighlight(replyTo);
            }}
            className="text-muted-foreground hover:text-primary"
          >
            [replied to #{replyTo}]:{" "}
          </a>
        )}
        {content}
      </div>
    </div>
  );
}
