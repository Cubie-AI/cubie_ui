import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCubieWallet } from "@/hooks/wallet-hook";
import { sendRequest } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Comment } from "./Comment";
import { CommentCardProps, CommentData, NewComment } from "./types";

export function CommentCard({
  initialComments,
  agentId,
  devAddress,
}: CommentCardProps) {
  const { token } = useCubieWallet();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHighlight = (id: number) => {
    setHighlightedId(id);
    setTimeout(() => setHighlightedId(null), 500);
  };

  const submitComment = async () => {
    if (!content.trim()) return;

    if (!token) {
      toast.error("Please connect your wallet to post a comment");
      return;
    }

    setIsSubmitting(true);
    const newComment: NewComment = {
      content: content.trim(),
      agentId: agentId,
    };

    if (replyingTo) {
      newComment.replyTo = replyingTo;
    }

    const { error, data } = await sendRequest<CommentData>("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newComment),
    });

    setIsSubmitting(false);
    if (!error && data) {
      setComments([...comments, data]);
      setContent("");
      setReplyingTo(null);
      toast.success("Comment posted!");
    } else {
      toast.error(error || "Failed to post reply");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => setIsModalOpen(true)}>Post Reply</Button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            onReply={() => {
              setReplyingTo(comment.id);
              setIsModalOpen(true);
            }}
            isReplying={replyingTo === comment.id}
            isHighlighted={highlightedId === comment.id}
            onHighlight={handleHighlight}
            isDev={comment.address.toLowerCase() === devAddress.toLowerCase()}
          />
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {replyingTo ? `Reply to comment #${replyingTo}` : "New Comment"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setContent("");
                  setReplyingTo(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await submitComment();
                  setIsModalOpen(false);
                }}
                disabled={isSubmitting || !content.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
