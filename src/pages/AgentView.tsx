import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { sendRequest } from "@/lib/utils";
import { ArrowLeft, MessageCircle, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Agent {
  id: number;
  name: string;
  mint: string;
  owner: string;
  imageUrl: string;
  bio: string;
  twitter: string | null;
  telegram: string | null;
  price: string;
  marketCapValue: number;
  ticker: string;
}

function AgentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAgent = async () => {
      setLoading(true);
      const { data, error } = await sendRequest<Agent>(`/api/agent/${id}`);
      if (data) {
        setAgent(data);
      }
      if (error) {
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
        {/* Top Section - Two Columns */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div className="space-y-4">
            <img
              src={agent.imageUrl}
              alt={agent.name}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
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

          {/* Right Column - Name, Ticker, and Links */}
          <div className="space-y-8">
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
              <div className="flex gap-2">
                {agent.twitter && (
                  <Button asChild variant="outline">
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
                  <Button asChild variant="outline">
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
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {agent.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentView;
