import DashboardLayout from "@/layouts/DashboardLayout";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Brain, Copy, AlertTriangle, TrendingUp, Network, CheckCircle2,
  Smile, Meh, Frown, ShieldAlert, Zap, Activity, BarChart2,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";

// ── Static data (not from mockData — these are model config / UI constants) ──
const radarData = [
  { subject: "Accuracy", A: 94 },
  { subject: "Speed", A: 88 },
  { subject: "Coverage", A: 91 },
  { subject: "Deduplication", A: 96 },
  { subject: "Routing", A: 87 },
  { subject: "Prediction", A: 82 },
];

const duplicateClusters = [
  { group: "Cluster A — Pothole issues MG Road", count: 23, merged: 19, similarity: 97 },
  { group: "Cluster B — Water shortage Whitefield", count: 17, merged: 14, similarity: 94 },
  { group: "Cluster C — Garbage BTM Layout", count: 12, merged: 10, similarity: 91 },
  { group: "Cluster D — Street lights Jayanagar", count: 9, merged: 8, similarity: 89 },
  { group: "Cluster E — Sewage HSR Layout", count: 8, merged: 7, similarity: 93 },
];
// ────────────────────────────────────────────────────────────────────────────

const typeConfig = {
  Pattern: { icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  Duplicate: { icon: Copy, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  Risk: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  Efficiency: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Cluster: { icon: Network, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
};

const priorityVariant = { Critical: "critical", High: "high", Medium: "medium", Low: "low" };

const sentimentIcon = {
  Angry: Frown, Frustrated: Frown, Outraged: Frown, Alarmed: AlertTriangle,
  Concerned: Meh, Annoyed: Meh, Disappointed: Meh, Fearful: AlertTriangle,
};
const sentimentColor = {
  Angry: "text-red-400", Frustrated: "text-orange-400", Outraged: "text-red-500",
  Alarmed: "text-red-400", Concerned: "text-amber-400", Annoyed: "text-amber-400",
  Disappointed: "text-yellow-400", Fearful: "text-red-300",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover p-2 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-muted-foreground">
          {p.dataKey}: <span className="font-medium text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const { aiInsights, sentimentComplaints, loading, error } = useAnalytics();

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">AI Analysis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-powered insights, sentiment analysis and model performance
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive flex items-center gap-2">
            <Brain size={13} /> Could not load analytics data — {error}
          </div>
        )}

        <Tabs defaultValue="insights">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="duplicates">Duplicate Detection</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="model">Model Performance</TabsTrigger>
          </TabsList>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="mt-4 space-y-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-border p-4 flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-2 w-5/6" />
                    </div>
                  </div>
                ))
              ) : (
                aiInsights.map((insight) => {
                  const config = typeConfig[insight.type] ?? typeConfig.Pattern;
                  const Icon = config.icon;
                  return (
                    <div
                      key={insight.id}
                      className={`rounded-lg border ${config.border} bg-card p-4 hover:bg-accent/20 transition-colors cursor-pointer`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-2 rounded-lg ${config.bg} ${config.border} border shrink-0`}>
                          <Icon size={14} className={config.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground leading-tight">{insight.title}</p>
                            <Badge variant={priorityVariant[insight.priority] ?? "outline"} className="text-[10px] shrink-0">
                              {insight.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${insight.confidence}%` }} />
                              </div>
                              <span className="text-[11px] text-muted-foreground">{insight.confidence}% confidence</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span>{insight.department}</span>
                              <span>{insight.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Duplicates Tab */}
          <TabsContent value="duplicates">
            <div className="mt-4">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Copy size={14} className="text-primary" />
                    <CardTitle className="text-sm">Duplicate Complaint Clusters</CardTitle>
                    <Badge variant="purple" className="text-[10px] ml-auto">312 total duplicates</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {duplicateClusters.map((cluster, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-foreground">{cluster.group}</p>
                        <Badge variant="purple" className="text-[10px]">{cluster.count} complaints</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                        <span>Merged: <span className="text-foreground font-medium">{cluster.merged}</span></span>
                        <span>Similarity: <span className="text-primary font-medium">{cluster.similarity}%</span></span>
                      </div>
                      <div className="mt-2">
                        <Progress value={cluster.similarity} indicatorClassName="bg-purple-500" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sentiment Tab */}
          <TabsContent value="sentiment">
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Smile size={14} className="text-primary" /> Sentiment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    {[
                      { label: "Negative (Angry/Frustrated)", pct: 58, color: "bg-red-500" },
                      { label: "Neutral (Concerned/Disappointed)", pct: 31, color: "bg-amber-500" },
                      { label: "Positive (Satisfied)", pct: 11, color: "bg-emerald-500" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{s.label}</span>
                          <span className="font-medium text-foreground">{s.pct}%</span>
                        </div>
                        <Progress value={s.pct} indicatorClassName={s.color} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart2 size={14} className="text-primary" /> Risk Score by Complaint
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  {loading ? (
                    <Skeleton className="w-full h-[200px] rounded-lg" />
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={sentimentComplaints} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                        <XAxis dataKey="id" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} domain={[0, 10]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="risk" radius={[3, 3, 0, 0]}>
                          {sentimentComplaints.map((entry) => (
                            <Cell
                              key={entry.id}
                              fill={entry.risk >= 9 ? "#ef4444" : entry.risk >= 7 ? "#f97316" : "#22c55e"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card className="border-border lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Complaint-Level Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-3 flex-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))
                  ) : (
                    sentimentComplaints.map((c) => {
                      const Icon = sentimentIcon[c.sentiment] ?? Meh;
                      const color = sentimentColor[c.sentiment] ?? "text-muted-foreground";
                      return (
                        <div key={c.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                          <Icon size={14} className={`shrink-0 ${color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{c.title}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[11px] font-medium ${color}`}>{c.sentiment}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-muted-foreground">Risk:</span>
                              <span className={`text-[11px] font-bold ${c.risk >= 9 ? "text-red-400" : c.risk >= 7 ? "text-orange-400" : "text-emerald-400"}`}>
                                {c.risk}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Model Tab */}
          <TabsContent value="model">
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain size={14} className="text-primary" /> Model Capability Radar
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="oklch(1 0 0 / 8%)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "oklch(0.62 0.03 264)" }} />
                      <Radar name="Model" dataKey="A" stroke="oklch(0.6 0.22 264)" fill="oklch(0.6 0.22 264)" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Department Routing Accuracy</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {[
                    { dept: "BBMP", accuracy: 94, count: 1876 },
                    { dept: "BWSSB", accuracy: 89, count: 892 },
                    { dept: "BESCOM", accuracy: 97, count: 734 },
                    { dept: "PWD", accuracy: 87, count: 621 },
                    { dept: "KSPCB", accuracy: 91, count: 312 },
                  ].map((d) => (
                    <div key={d.dept}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">{d.dept}</span>
                        <span className="text-primary font-bold">{d.accuracy}%</span>
                      </div>
                      <Progress value={d.accuracy} indicatorClassName="bg-primary" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
