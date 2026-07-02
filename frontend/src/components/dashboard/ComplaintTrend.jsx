import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ComplaintTrend() {
  const { trendData, loading, error } = useDashboard();

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-primary" />
          <CardTitle className="text-sm">Complaint Trend</CardTitle>
          <span className="text-[10px] text-muted-foreground ml-auto">Last 12 months</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <Skeleton className="w-full h-[200px] rounded-lg" />
        ) : error ? (
          <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground">
            ⚠ Could not load trend data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="complaints-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.6 0.22 264)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.6 0.22 264)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolved-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.19 160)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.55 0.19 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "oklch(0.62 0.03 264)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.62 0.03 264)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="complaints"
                stroke="oklch(0.6 0.22 264)"
                strokeWidth={2}
                fill="url(#complaints-gradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="oklch(0.55 0.19 160)"
                strokeWidth={2}
                fill="url(#resolved-gradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="flex items-center gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "oklch(0.6 0.22 264)" }} />
            <span className="text-xs text-muted-foreground">Filed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "oklch(0.55 0.19 160)" }} />
            <span className="text-xs text-muted-foreground">Resolved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
