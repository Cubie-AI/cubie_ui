import { AgentCard } from "@/components/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSocket } from "@/hooks/use-socket";
import { sendRequest } from "@/lib/utils";
import { ArrowUpDown, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Agent {
  id: number;
  name: string;
  ticker: string;
  mintAddress: string;
  marketCapValue: number;
  photo: string;
  telegram?: string;
  twitter?: string;
  bio: string;
  createdAt: string;
  volume: {
    "5m": string;
    "1h": string;
    "6h": string;
    "24h": string;
  };
  bumped: boolean;
}

type SortOption = "bump" | "marketCap" | "created";

function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("bump");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const resetBump = useCallback(
    (id: number) => {
      setAgents(agents.map((a) => (a.id === id ? { ...a, bumped: false } : a)));
    },
    [agents]
  );

  useEffect(() => {
    socket.on("agent_created", (agent: any) => {
      console.log("agent_created", agent);
      if (agent) {
        const others = agents.filter((a) => a.id !== agent.id);
        agent.bumped = true;
        const bumped = [agent, ...others];
        console.log(bumped);
        setAgents(bumped);
      }
    });

    return () => {
      socket.off("agent_created");
    };
  }, [agents]);

  useEffect(() => {
    const getAgents = async () => {
      setLoading(true);
      const { data, error } = await sendRequest<Agent[]>("/api/agent");
      if (data) {
        setAgents(data.map((a) => ({ ...a, bumped: false })));
      }
      if (error) {
        console.error("Failed to load agents:", error);
      }
      setLoading(false);
    };
    getAgents();
  }, []);

  let filteredAndSortedAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (sortBy !== "bump") {
    filteredAndSortedAgents.sort((a, b) => {
      switch (sortBy) {
        case "marketCap":
          return b.marketCapValue - a.marketCapValue;
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Half */}
      <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">$MAIAR x $CUBIE</h1>
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-mono mb-2">
            ca: 2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump
          </p>
        </div>
        <Button
          className="text-sm"
          variant="outline"
          onClick={() => navigate("/launch")}
        >
          Launch an agent
        </Button>
      </div>

      {/* Bottom Half */}
      <div className="min-h-[50vh] bg-background/50 backdrop-blur-sm p-4 md:p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Filter Section */}
          <div className="mb-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="relative w-full sm:w-[500px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bump">Bump Order</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                  <SelectItem value="created">Recently Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredAndSortedAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                ticker={agent.ticker}
                name={agent.name}
                telegram={agent.telegram}
                twitter={agent.twitter}
                marketCapValue={agent.marketCapValue}
                photo={agent.photo}
                description={agent.bio}
                isBumped={agent.bumped}
                resetBump={resetBump}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
