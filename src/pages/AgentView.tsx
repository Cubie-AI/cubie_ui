import { CopyButton } from "@/components/CopyButton";
import { TokenChart } from "@/components/launch/TokenChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { sendRequest } from "@/lib/utils";
import { ArrowLeft, MessageCircle, Pill, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Agent {
  id: number;
  name: string;
  mint: string;
  owner: string;
  photo: string;
  bio: string;
  twitter: string | null;
  telegram: string | null;
  history: {
    price: number;
    time: number;
  }[];
  marketCapValue: number;
  price: number;
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
                <Button asChild variant="outline">
                  <a
                    href={`https://pump.fun/token/${agent.mint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Pill className="h-4 w-4" />
                    Pump.fun
                  </a>
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
        <Card className="p-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Price History</div>
            <TokenChart data={agent.history} />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AgentView;
