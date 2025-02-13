import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, MessageCircle, Twitter, ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { agents } from "@/store/agents"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"

// Add this type near the top of the file
type VolumeData = {
  total: string;
  buyVolume: number;
  sellVolume: number;
  buyPercent: number;
  sellPercent: number;
}

// Add this helper function
const formatVolumeData = (total: string): VolumeData => {
  const numericTotal = parseInt(total.replace(/[$,]/g, ''))
  const buyVolume = Math.round(numericTotal * 0.6) // Example: 60% buys
  const sellVolume = numericTotal - buyVolume
  return {
    total,
    buyVolume,
    sellVolume,
    buyPercent: (buyVolume / numericTotal) * 100,
    sellPercent: (sellVolume / numericTotal) * 100,
  }
}

function AgentView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [volumeTimeframe, setVolumeTimeframe] = useState("24h")

  const agent = agents.find(a => a.id === id)

  if (!agent) {
    // You might want to add a proper 404 page
    navigate('/')
    return null
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You might want to add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

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
  ]

  const chartConfig = {
    price: {
      label: "Price",
      color: "#00ff9d",
    },
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl pt-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-8 -ml-4 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-8">
        {/* Top Section - Two Columns */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div className="space-y-4">
            <div className="flex gap-6">
              {/* Agent Image */}
              <div className="w-32 h-32 rounded-lg overflow-hidden">
                <img 
                  src={agent.photo} 
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Basic Info */}
              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl font-bold">{agent.name}</h1>
                  <div className="text-lg text-muted-foreground font-mono">{agent.ticker}</div>
                </div>

                {/* Mint Address */}
                <Button
                  variant="outline"
                  className="flex items-center gap-2 font-mono text-sm"
                  onClick={() => copyToClipboard(agent.mintAddress)}
                >
                  <span className="truncate max-w-[200px]">{agent.mintAddress}</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="space-y-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-muted-foreground">
                {agent.description}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {agent.telegram && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  asChild
                >
                  <a 
                    href={agent.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Telegram
                  </a>
                </Button>
              )}
              {agent.twitter && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  asChild
                >
                  <a 
                    href={agent.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Chart Section - Full Width */}
        <Card className="p-4 -mx-4 sm:-mx-6 md:-mx-8">
          {/* Stats Row */}
          <div className="flex items-center gap-8 mb-6 px-4 sm:px-6 md:px-8">
            {/* Market Cap */}
            <div>
              <div className="text-xs text-muted-foreground">Market Cap</div>
              <div className="text-sm font-bold">${agent.marketCapValue.toLocaleString()}</div>
            </div>

            {/* Volume Pills */}
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="flex gap-2">
                {Object.entries(agent.volume).map(([timeframe, total]) => {
                  const volumeData = formatVolumeData(total)
                  return (
                    <div 
                      key={timeframe}
                      className={cn(
                        "px-2 py-1 rounded-full text-xs border",
                        volumeTimeframe === timeframe ? "border-primary" : "border-muted"
                      )}
                      onClick={() => setVolumeTimeframe(timeframe)}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="font-medium">{timeframe}</span>
                      <span className="ml-2 text-muted-foreground">{volumeData.total}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Chart - Full Width */}
          <div className="w-full">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <AreaChart data={chartData} width={window.innerWidth - 32} height={400}>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff9d" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#00ff9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#00ff9d"
                  fill="url(#gradient)"
                  strokeWidth={2}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload) {
                      return (
                        <ChartTooltipContent
                          active={active}
                          payload={payload}
                          formatter={(value) => `$${value}`}
                        />
                      )
                    }
                    return null
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AgentView 