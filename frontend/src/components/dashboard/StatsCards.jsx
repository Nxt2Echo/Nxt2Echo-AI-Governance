import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Timer,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const statConfigs = [
  {
    key: "totalComplaints",
    label: "Total Complaints",
    suffix: "",
    format: (v) => (v != null ? Number(v).toLocaleString() : "—"),
    change: null,
    trend: "up",
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    sub: "All time",
  },
  {
    key: "pendingComplaints",
    label: "Pending",
    format: (v) => (v != null ? Number(v).toLocaleString() : "—"),
    trend: "up",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    sub: "Awaiting action",
  },
  {
    key: "resolvedComplaints",
    label: "Resolved",
    format: (v) => (v != null ? Number(v).toLocaleString() : "—"),
    trend: "up",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    sub: "This month",
  },
  {
    key: "criticalIssues",
    label: "Critical Issues",
    format: (v) => (v != null ? String(v) : "—"),
    trend: "down",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    sub: "Needs immediate action",
  },
  {
    key: "aiConfidenceScore",
    label: "AI Confidence",
    format: (v) => (v != null ? `${v}%` : "—"),
    trend: "up",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    sub: "Model accuracy",
  },
  {
    key: "avgResolutionDays",
    label: "Avg. Resolution",
    format: (v) => (v != null ? `${v}d` : "—"),
    trend: "down",
    icon: Timer,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    sub: "Faster than last month",
  },
];

function StatCardSkeleton() {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <Skeleton className="w-8 h-8 rounded-lg mb-3" />
        <Skeleton className="h-6 w-16 mb-1" />
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-3 w-12" />
      </CardContent>
    </Card>
  );
}

export default function StatsCards() {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statConfigs.map((s) => <StatCardSkeleton key={s.key} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
        ⚠ Could not load stats — {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {statConfigs.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        const value = stats ? stat.format(stats[stat.key]) : "—";
        const trendColor =
          stat.label === "Critical Issues"
            ? stat.trend === "down" ? "text-emerald-400" : "text-red-400"
            : stat.label === "Avg. Resolution"
            ? stat.trend === "down" ? "text-emerald-400" : "text-red-400"
            : stat.trend === "up" ? "text-emerald-400" : "text-red-400";

        return (
          <Card
            key={stat.key}
            className={`border ${stat.border} bg-card hover:bg-accent/20 transition-all duration-200 cursor-default group`}
          >
            <CardContent className="p-4">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.border} border mb-3`}>
                <Icon size={14} className={stat.color} />
              </div>
              <p className="text-xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-2">{stat.label}</p>
              <div className="flex items-center gap-1">
                <TrendIcon size={10} className={trendColor} />
                <span className={`text-[10px] font-medium ${trendColor}`}>{stat.sub}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
