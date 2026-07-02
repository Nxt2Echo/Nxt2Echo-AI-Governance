import DashboardLayout from "@/layouts/DashboardLayout";
import { useHeatmap } from "@/hooks/useHeatmap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  MapPin, AlertTriangle, AlertCircle, CheckCircle2,
  Thermometer, TrendingUp, TrendingDown, Map, Info,
} from "lucide-react";

const riskConfig = {
  Critical: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", badge: "critical" },
  High: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", badge: "high" },
  Medium: { icon: Thermometer, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", badge: "medium" },
  Low: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", badge: "low" },
};

export default function Heatmap() {
  const { heatmapZones, loading, error } = useHeatmap();

  const riskSummary = {
    Critical: heatmapZones.filter((z) => z.risk === "Critical"),
    High: heatmapZones.filter((z) => z.risk === "High"),
    Medium: heatmapZones.filter((z) => z.risk === "Medium"),
    Low: heatmapZones.filter((z) => z.risk === "Low"),
  };
  const totalComplaints = heatmapZones.reduce((a, b) => a + b.complaints, 0) || 1;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Complaint Heatmap</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Geographic complaint distribution · Bengaluru Metropolitan Area
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
            <Info size={12} />
            Backend map integration pending
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
            ⚠ Could not load heatmap data — {error}
          </div>
        )}

        {/* Risk Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-4 mb-2" />
                  <Skeleton className="h-8 w-8 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            Object.entries(riskSummary).map(([risk, zones]) => {
              const config = riskConfig[risk];
              const Icon = config.icon;
              const total = zones.reduce((a, b) => a + b.complaints, 0);
              return (
                <Card key={risk} className={`border ${config.border} ${config.bg}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={16} className={config.color} />
                      <Badge variant={config.badge} className="text-[10px]">{risk}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{zones.length}</p>
                    <p className="text-xs text-muted-foreground">zones · {total} complaints</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Map Placeholder */}
        <Card className="border-border overflow-hidden">
          <div className="relative h-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "linear-gradient(oklch(1 0 0 / 10%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 10%) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Simulated hotspot blobs */}
            <div className="absolute top-[30%] left-[45%] w-20 h-20 rounded-full bg-red-500/30 blur-2xl animate-pulse" />
            <div className="absolute top-[20%] left-[60%] w-16 h-16 rounded-full bg-orange-500/25 blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-[50%] left-[30%] w-14 h-14 rounded-full bg-orange-500/20 blur-xl" />
            <div className="absolute top-[60%] left-[55%] w-12 h-12 rounded-full bg-amber-500/20 blur-xl" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[40%] left-[20%] w-10 h-10 rounded-full bg-emerald-500/20 blur-xl" />

            {/* Zone pins (rendered from API data once loaded) */}
            {!loading && heatmapZones.slice(0, 6).map((zone, i) => {
              const positions = [
                { top: "32%", left: "47%" }, { top: "22%", left: "62%" },
                { top: "52%", left: "32%" }, { top: "62%", left: "57%" },
                { top: "42%", left: "22%" }, { top: "28%", left: "38%" },
              ];
              const config = riskConfig[zone.risk] ?? riskConfig.Low;
              const Icon = config.icon;
              return (
                <div
                  key={zone.id}
                  className="absolute cursor-pointer group"
                  style={positions[i]}
                >
                  <div className={`w-8 h-8 rounded-full ${config.bg} ${config.border} border flex items-center justify-center shadow-lg`}>
                    <Icon size={12} className={config.color} />
                  </div>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 bg-popover border border-border rounded-lg p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <p className="text-[10px] font-semibold text-foreground">{zone.name}</p>
                    <p className="text-[9px] text-muted-foreground">{zone.complaints} complaints</p>
                  </div>
                </div>
              );
            })}

            {/* Center overlay */}
            <div className="text-center z-10">
              <Map size={32} className="text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Bengaluru Heatmap</p>
              <p className="text-xs text-muted-foreground/60">Interactive map — backend integration pending</p>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-card/90 border border-border rounded-lg px-3 py-1.5">
              {Object.entries(riskConfig).map(([risk, cfg]) => (
                <div key={risk} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.bg} border ${cfg.border}`} />
                  <span className="text-[9px] text-muted-foreground">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Zone Cards Grid */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Zone Analysis</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {heatmapZones.map((zone) => {
                const config = riskConfig[zone.risk] ?? riskConfig.Low;
                const Icon = config.icon;
                const isPositive = zone.trend.startsWith("-");
                const TrendIcon = isPositive ? TrendingDown : TrendingUp;
                const trendColor = isPositive ? "text-emerald-400" : "text-red-400";
                const pct = Math.round((zone.complaints / totalComplaints) * 100);

                return (
                  <Card
                    key={zone.id}
                    className={`border ${config.border} hover:${config.bg} transition-all duration-200 cursor-pointer`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                            <Icon size={14} className={config.color} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{zone.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin size={9} />
                              {zone.lat?.toFixed(3)}, {zone.lng?.toFixed(3)}
                            </div>
                          </div>
                        </div>
                        <Badge variant={config.badge} className="text-[10px]">{zone.risk}</Badge>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-foreground">{zone.complaints}</span>
                        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
                          <TrendIcon size={12} />
                          {zone.trend}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{zone.category}</span> · {pct}% of total
                      </p>
                      <Progress
                        value={pct}
                        max={25}
                        indicatorClassName={
                          zone.risk === "Critical" ? "bg-red-500" :
                          zone.risk === "High" ? "bg-orange-500" :
                          zone.risk === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                        }
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
