import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Copy, AlertTriangle, CheckCircle2, Network, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const typeConfig = {
  Pattern: { icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  Duplicate: { icon: Copy, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  Risk: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  Efficiency: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Cluster: { icon: Network, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
};

const priorityVariant = { Critical: "critical", High: "high", Medium: "medium", Low: "low" };

export default function AIInsights() {
  const { aiInsights, loading, error } = useDashboard();

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={15} className="text-primary" />
            <CardTitle className="text-sm">AI Insights</CardTitle>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              Live
            </span>
          </div>
          <Link
            to="/analysis"
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Full analysis <ArrowRight size={12} />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2.5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-3 flex gap-2.5">
              <Skeleton className="w-7 h-7 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-5/6" />
              </div>
            </div>
          ))
        ) : error ? (
          <p className="text-xs text-muted-foreground">⚠ Could not load AI insights</p>
        ) : (
          aiInsights.map((insight) => {
            const config = typeConfig[insight.type] ?? typeConfig.Pattern;
            const Icon = config.icon;
            return (
              <div
                key={insight.id}
                className={`rounded-lg border ${config.border} bg-card p-3 hover:bg-accent/20 transition-colors cursor-pointer`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1.5 rounded-md ${config.bg} ${config.border} border shrink-0`}>
                    <Icon size={12} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-semibold text-foreground leading-tight truncate">{insight.title}</p>
                      <Badge variant={priorityVariant[insight.priority] ?? "outline"} className="text-[9px] shrink-0">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{insight.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-12 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{insight.confidence}% confidence</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{insight.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
