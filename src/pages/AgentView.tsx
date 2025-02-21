import { CharacterDisplay } from "@/components/CharacterDisplay";
import { CommentCard } from "@/components/comment/CommentCard";
import { CopyButton } from "@/components/CopyButton";
import { TokenChart } from "@/components/launch/TokenChart";
import { Swap } from "@/components/swap/Swap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { sendRequest } from "@/lib/utils";
import {
  ArrowLeft,
  MessageCircle,
  Pill,
  TextSearch,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface Agent {
  id: number;
  name: string;
  mint: string;
  owner: string;
  photo: string;
  bio: string;
  character: string | null;
  twitter: string | null;
  telegram: string | null;
  history: {
    price: number;
    time: number;
  }[];
  marketCapValue: number;
  price: number;
  ticker: string;
  comments: {
    id: number;
    replyTo?: number;
    content: string;
    address: string;
    createdAt: string;
  }[];
}

function AgentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCharacter, setShowCharacter] = useState(false);

  useEffect(() => {
    const getAgent = async () => {
      setLoading(true);
      const { data, error } = await sendRequest<Agent>(`/api/agent/${id}`);
      if (data) {
        setAgent(data);
      }
      if (error) {
        toast.error(error || "Failed to load agent");
        console.error("Failed to load agent:", error);
        navigate("/");
      }
      setLoading(false);
    };
    getAgent();
  }, [id, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!agent) {
    return null;
  }
  return (
    <div className="container mx-auto p-4 max-w-7xl pt-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-8 -ml-4 text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-8">
        {/* Top Section - Flex layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Container */}
          <div className="flex-shrink-0 w-full md:w-[300px]">
            <div className="aspect-square">
              <img
                src={agent.photo}
                alt={agent.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Info Container */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-bold">{agent.name}</h1>
                <span className="text-lg text-muted-foreground">
                  $
                  {agent.ticker.startsWith("$")
                    ? agent.ticker.slice(1)
                    : agent.ticker}
                </span>
              </div>
              <div className="text-lg text-muted-foreground">
                ${agent.marketCapValue.toLocaleString()}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {agent.twitter && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <a
                      href={`https://x.com/${agent.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Twitter className="h-4 w-4" />@{agent.twitter}
                    </a>
                  </Button>
                )}
                {agent.telegram && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <a
                      href={`https://t.me/${agent.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {agent.telegram}
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a
                    href={`https://pump.fun/coin/${agent.mint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Pill className="h-4 w-4" />
                    pump.fun
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setShowCharacter(true)}
                >
                  <TextSearch className="h-4 w-4 mr-2" />
                  character
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {agent.bio}
              </p>
            </div>

            {/* Mint and Owner section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mint</Label>
                <CopyButton text={agent.mint} />
              </div>
              <div className="space-y-2">
                <Label>Owner</Label>
                <CopyButton text={agent.owner} />
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Swap Component - Shows above chart on mobile */}
          <div className="lg:order-last">
            <Swap mint={agent.mint} ticker={agent.ticker} />
          </div>

          {/* Price Chart - Full width on mobile */}
          <Card className="p-6 lg:col-span-2">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">Price History</div>
              <TokenChart data={agent.history} />
            </div>
          </Card>
        </div>

        {/* Comments Section */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Comments</div>
            <CommentCard
              initialComments={agent.comments}
              agentId={agent.id}
              devAddress={agent.owner}
            />
          </div>
        </Card>

        <Dialog open={showCharacter} onOpenChange={setShowCharacter}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Character Description</DialogTitle>
            </DialogHeader>
            <CharacterDisplay character={agent.character} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default AgentView;
