import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "purple" | "pink" | "green";
  trend?: number;
}

const colorConfig = {
  blue: {
    glow: "neon-glow-blue",
    text: "text-primary",
    gradient: "from-primary/20 to-transparent",
  },
  purple: {
    glow: "neon-glow-purple",
    text: "text-neon-purple",
    gradient: "from-neon-purple/20 to-transparent",
  },
  pink: {
    glow: "neon-glow-pink",
    text: "text-neon-pink",
    gradient: "from-neon-pink/20 to-transparent",
  },
  green: {
    glow: "neon-glow-green",
    text: "text-neon-green",
    gradient: "from-neon-green/20 to-transparent",
  },
};

const StatsCard = ({ title, value, icon: Icon, color, trend }: StatsCardProps) => {
  const config = colorConfig[color];

  return (
    <div className={cn("glass-card rounded-2xl p-6 hover-scale transition-all", config.glow)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br rounded-2xl opacity-10", config.gradient)} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-xl bg-card/50", config.glow)}>
            <Icon className={cn("w-6 h-6", config.text)} />
          </div>
          {trend !== undefined && (
            <span className={cn("text-sm font-medium", trend >= 0 ? "text-neon-green" : "text-neon-pink")}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>

        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
