import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { sendRequest } from "@/lib/utils";
import { ArrowLeft, Check, Copy, MessageCircle, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Add this type near the top of the file
type VolumeData = {
  total: string;
  buyVolume: number;
  sellVolume: number;
  buyPercent: number;
  sellPercent: number;
};

// Add this helper function
const formatVolumeData = (total: string): VolumeData => {
  const numericTotal = parseInt(total.replace(/[$,]/g, ""));
  const buyVolume = Math.round(numericTotal * 0.6); // Example: 60% buys
  const sellVolume = numericTotal - buyVolume;
  return {
    total,
    buyVolume,
    sellVolume,
    buyPercent: (buyVolume / numericTotal) * 100,
    sellPercent: (sellVolume / numericTotal) * 100,
  };
};

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
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const chartData = [
    { timestamp: "00:00", price: 1.23 },
    { timestamp: "01:00", price: 1.27 },
    { timestamp: "02:00", price: 1.35 },
    { timestamp: "03:00", price: 1.42 },
    { timestamp: "04:00", price: 1.45 },
    { timestamp: "05:00", price: 1.41 },
    { timestamp: "06:00", price: 1.38 },
    { timestamp: "07:00", price: 1.35 },
    { timestamp: "08:00", price: 1.32 },
    { timestamp: "09:00", price: 1.45 },
    { timestamp: "10:00", price: 1.52 },
    { timestamp: "11:00", price: 1.58 },
    { timestamp: "12:00", price: 1.67 },
    { timestamp: "13:00", price: 1.75 },
    { timestamp: "14:00", price: 1.82 },
    { timestamp: "15:00", price: 1.85 },
    { timestamp: "16:00", price: 1.89 },
    { timestamp: "17:00", price: 1.86 },
    { timestamp: "18:00", price: 1.82 },
    { timestamp: "19:00", price: 1.79 },
    { timestamp: "20:00", price: 1.76 },
    { timestamp: "21:00", price: 1.82 },
    { timestamp: "22:00", price: 1.88 },
    { timestamp: "23:00", price: 1.92 },
    { timestamp: "24:00", price: 1.95 },
  ];

  const chartConfig = {
    price: {
      label: "Price",
      color: "#00ff9d",
    },
  };

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
                <Button
                  variant="outline"
                  className={`w-full flex items-center gap-2 font-mono ${
                    copied ? "border-green-500 text-green-500" : ""
                  }`}
                  onClick={() => copyToClipboard(agent.mint)}
                >
                  <span className="truncate max-w-[200px]">{agent.mint}</span>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Owner</Label>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 font-mono"
                  onClick={() => copyToClipboard(agent.owner)}
                >
                  <span className="truncate max-w-[200px]">{agent.owner}</span>
                  <Copy className="h-4 w-4" />
                </Button>
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
