import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { MessageCircle, Twitter } from "lucide-react"
import { cn } from '@/lib/utils'

interface AgentCardProps {
  name: string
  telegram?: string
  twitter?: string
  marketCap: string
  photo: string
  description: string
  isBumped?: boolean
}

export function AgentCard({
  name,
  telegram,
  twitter,
  marketCap,
  photo,
  description,
  isBumped
}: AgentCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isBumped) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 1000) // Match this with the total animation duration
      return () => clearTimeout(timer)
    }
  }, [isBumped])

  return (
    <Card
      className={cn(
        "agent-card",
        isAnimating && "bump-animation",
        "border transition-all"
      )}
    >
      {/* Agent Photo */}
      <div className="h-40">
        <img 
          src={photo} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Agent Info */}
      <div className="p-4 space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{name}</h2>
          <div className="flex gap-2">
            {telegram && (
              <a 
                href={telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            {twitter && (
              <a 
                href={twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <div className="text-sm font-medium">
          Market Cap: {marketCap}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </Card>
  )
} 