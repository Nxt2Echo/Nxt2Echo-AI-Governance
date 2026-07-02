import DashboardLayout from "@/layouts/DashboardLayout";
import { useReports } from "@/hooks/useReports";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Download, FileText, FileBarChart, BarChart2,
  Calendar, Building2, TrendingUp, CheckCircle2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const categoryIconMap = {
  executive: FileText,
  department: Building2,
  ai: BarChart2,
  critical: FileBarChart,
  heatmap: Calendar,
  satisfaction: CheckCircle2,
};

const typeColor = { PDF: "destructive", XLSX: "success" };

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

export default function Reports() {
  const { reportTemplates, weeklyStats, complaintTrendData, departmentData, loading, error } = useReports();

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generated reports, trend analysis and department performance
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
            ⚠ Could not load reports data — {error}
          </div>
        )}

        {/* Weekly Summary */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" />
              Weekly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading || !weeklyStats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-16 mx-auto mb-1" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="px-3 py-2 rounded-lg bg-card border border-border">
                      <Skeleton className="h-2 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                  {[
                    { label: "New Complaints", value: weeklyStats.newComplaints, color: "text-blue-400" },
                    { label: "Resolved", value: weeklyStats.resolved, color: "text-emerald-400" },
                    { label: "Escalated", value: weeklyStats.escalated, color: "text-red-400" },
                    { label: "Avg Resolution", value: weeklyStats.avgResolutionTime, color: "text-amber-400" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: "Top Category", value: weeklyStats.topCategory },
                    { label: "Top Area", value: weeklyStats.topArea },
                    { label: "AI Accuracy", value: weeklyStats.aiAccuracy },
                    { label: "Duplicates Merged", value: weeklyStats.duplicatesMerged },
                  ].map((s) => (
                    <div key={s.label} className="px-3 py-2 rounded-lg bg-card border border-border">
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="reports">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="reports">Report Library</TabsTrigger>
            <TabsTrigger value="trends">Trend Charts</TabsTrigger>
            <TabsTrigger value="departments">Department Reports</TabsTrigger>
          </TabsList>

          {/* Report Library */}
          <TabsContent value="reports">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                reportTemplates.map((report) => {
                  const Icon = categoryIconMap[report.category] ?? FileText;
                  return (
                    <Card key={report.id} className="border-border hover:border-primary/30 transition-colors group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                            <Icon size={16} className="text-primary" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant={typeColor[report.type] ?? "outline"} className="text-[10px]">
                              {report.type}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">{report.frequency}</Badge>
                          </div>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">{report.title}</h3>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{report.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="text-[10px] text-muted-foreground">
                            <span>Last: {report.lastGenerated}</span>
                            <span className="ml-2">· {report.size}</span>
                          </div>
                          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium hover:bg-primary/20 transition-colors">
                            <Download size={11} />
                            Download
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Trend Charts */}
          <TabsContent value="trends">
            <div className="mt-4 grid grid-cols-1 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart2 size={14} className="text-primary" />
                    Monthly Complaint Volume — 2024
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  {loading ? (
                    <Skeleton className="w-full h-[280px] rounded-lg" />
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={complaintTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="complaints" radius={[4, 4, 0, 0]} fill="oklch(0.6 0.22 264)" opacity={0.85} />
                        <Bar dataKey="resolved" radius={[4, 4, 0, 0]} fill="oklch(0.55 0.19 160)" opacity={0.85} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-3 h-3 rounded-sm" style={{ background: "oklch(0.6 0.22 264)" }} />
                      Filed
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-3 h-3 rounded-sm" style={{ background: "oklch(0.55 0.19 160)" }} />
                      Resolved
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Department Reports */}
          <TabsContent value="departments">
            <div className="mt-4 space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-lg" />
                          <div>
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                departmentData.map((dept) => (
                  <Card key={dept.name} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{dept.name.slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                            <p className="text-[11px] text-muted-foreground">{dept.total?.toLocaleString()} total · {dept.resolved?.toLocaleString()} resolved</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${dept.rate >= 90 ? "text-emerald-400" : dept.rate >= 80 ? "text-amber-400" : "text-red-400"}`}>
                            {dept.rate}%
                          </p>
                          <p className="text-[10px] text-muted-foreground">Resolution rate</p>
                        </div>
                      </div>
                      <Progress
                        value={dept.rate}
                        indicatorClassName={dept.rate >= 90 ? "bg-emerald-500" : dept.rate >= 80 ? "bg-amber-500" : "bg-red-500"}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground">Avg resolution: {dept.avgDays} days</span>
                        <button className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors">
                          <Download size={10} /> Export
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
