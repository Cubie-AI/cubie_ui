export interface CommentData {
  id: number;
  replyTo?: number;
  content: string;
  address: string;
}

export interface CommentProps extends CommentData {
  onReply: () => void;
  isReplying: boolean;
  isHighlighted?: boolean;
  onHighlight: (id: number) => void;
  isDev?: boolean;
}

export interface CommentCardProps {
  initialComments: CommentData[];
  agentId: number;
  devAddress: string;
}

export type NewComment = {
  agentId: number;
  content: string;
  replyTo?: number;
};
