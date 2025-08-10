import { Crown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface FeatureTooltipProps {
  children: React.ReactNode
  requiredPlan: "Basic" | "Pro" | "Team"
  feature: string
}

export function FeatureTooltip({ children, requiredPlan, feature }: FeatureTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative">
          {children}
          <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{requiredPlan}</Badge>
          <span>{feature}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}