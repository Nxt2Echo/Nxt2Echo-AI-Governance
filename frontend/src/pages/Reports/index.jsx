import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Download, FileText, FileBarChart, BarChart2,
  Calendar, Building2, TrendingUp, CheckCircle2, MapPin,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Hardcoded weekly report data — always available, no API needed ──────────
const WEEKLY_REPORTS = [
  {
    id: 1,
    title: "Executive Summary Report",
    description: "High-level overview of all complaints and resolutions for the Commissioner. Includes status breakdown, SLA performance, and AI confidence score.",
    type: "PDF",
    lastGenerated: "Jun 24, 2024",
    size: "2.3 MB",
    category: "executive",
    Icon: FileText,
  },
  {
    id: 2,
    title: "AI Analysis & Insights Report",
    description: "AI model accuracy, duplicate detection stats, sentiment trends, and predictive alert outcomes across all complaint categories.",
    type: "PDF",
    lastGenerated: "Jun 24, 2024",
    size: "1.8 MB",
    category: "ai",
    Icon: BarChart2,
  },
  {
    id: 3,
    title: "Heatmap & Geographic Report",
    description: "Zone-wise complaint distribution across Bengaluru with geographic density visualizations and hotspot risk rankings.",
    type: "PDF",
    lastGenerated: "Jun 24, 2024",
    size: "5.2 MB",
    category: "heatmap",
    Icon: MapPin,
  },
  {
    id: 4,
    title: "Infrastructure Damage Assessment",
    description: "Comprehensive breakdown of infrastructure-related complaints — potholes, road damage, sewage, and estimated repair costs.",
    type: "PDF",
    lastGenerated: "Jun 23, 2024",
    size: "3.4 MB",
    category: "department",
    Icon: Building2,
  },
  {
    id: 5,
    title: "Predictive Analytics Forecast",
    description: "AI-driven forecast of expected complaint surges for the upcoming week, by ward and department, with recommended resource allocation.",
    type: "PDF",
    lastGenerated: "Jun 25, 2024",
    size: "1.5 MB",
    category: "ai",
    Icon: TrendingUp,
  },
  {
    id: 6,
    title: "Sanitation Compliance Log",
    description: "Detailed logging of sanitation and waste management compliance across all zones, with department response times.",
    type: "XLSX",
    lastGenerated: "Jun 22, 2024",
    size: "1.2 MB",
    category: "department",
    Icon: CheckCircle2,
  },
];

const WEEKLY_STATS = {
  newComplaints: 287,
  resolved: 312,
  escalated: 23,
  avgResolutionTime: "3.4 days",
  topCategory: "Infrastructure",
  topArea: "BTM Layout",
  aiAccuracy: "94.2%",
  duplicatesMerged: 47,
};

const TREND_DATA = [
  { month: "Jan", complaints: 312, resolved: 289 },
  { month: "Feb", complaints: 287, resolved: 261 },
  { month: "Mar", complaints: 398, resolved: 354 },
  { month: "Apr", complaints: 421, resolved: 389 },
  { month: "May", complaints: 378, resolved: 342 },
  { month: "Jun", complaints: 445, resolved: 398 },
  { month: "Jul", complaints: 502, resolved: 445 },
  { month: "Aug", complaints: 467, resolved: 421 },
  { month: "Sep", complaints: 389, resolved: 367 },
  { month: "Oct", complaints: 412, resolved: 378 },
  { month: "Nov", complaints: 356, resolved: 334 },
  { month: "Dec", complaints: 298, resolved: 276 },
];

const DEPARTMENT_DATA = [
  { name: "BBMP", total: 1876, resolved: 1654, rate: 88, avgDays: 2.8 },
  { name: "BWSSB", total: 892, resolved: 743, rate: 83, avgDays: 4.1 },
  { name: "BESCOM", total: 734, resolved: 689, rate: 94, avgDays: 1.9 },
  { name: "PWD", total: 621, resolved: 512, rate: 82, avgDays: 5.3 },
  { name: "KSPCB", total: 312, resolved: 267, rate: 86, avgDays: 3.4 },
  { name: "BMTC", total: 198, resolved: 154, rate: 78, avgDays: 6.2 },
];

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

const handleDownload = (filename, type) => {
  const ext = type === "XLSX" ? "csv" : "txt";
  const content =
    type === "XLSX"
      ? "ID,Category,Status,Date\n1,Sanitation,Resolved,2024-01-01\n2,Traffic,Pending,2024-01-02"
      : `Report: ${filename}\nDate: ${new Date().toLocaleDateString()}\n\nThis is a generated weekly report from Nxt2Echo AI Governance Platform.`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename.replace(/\s+/g, "_").toLowerCase()}.${ext}`;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Weekly intelligence reports, trend analysis and department performance
          </p>
        </div>

        {/* Weekly Summary */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" />
              Weekly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
              {[
                { label: "New Complaints", value: WEEKLY_STATS.newComplaints, color: "text-blue-400" },
                { label: "Resolved", value: WEEKLY_STATS.resolved, color: "text-emerald-400" },
                { label: "Escalated", value: WEEKLY_STATS.escalated, color: "text-red-400" },
                { label: "Avg Resolution", value: WEEKLY_STATS.avgResolutionTime, color: "text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: "Top Category", value: WEEKLY_STATS.topCategory },
                { label: "Top Area", value: WEEKLY_STATS.topArea },
                { label: "AI Accuracy", value: WEEKLY_STATS.aiAccuracy },
                { label: "Duplicates Merged", value: WEEKLY_STATS.duplicatesMerged },
              ].map((s) => (
                <div key={s.label} className="px-3 py-2 rounded-lg bg-card border border-border">
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="reports">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="reports">Weekly Reports</TabsTrigger>
            <TabsTrigger value="trends">Trend Charts</TabsTrigger>
            <TabsTrigger value="departments">Department Reports</TabsTrigger>
          </TabsList>

          {/* Weekly Report Library */}
          <TabsContent value="reports">
            <p className="text-xs text-muted-foreground mt-3 mb-4">
              📅 Showing <span className="text-primary font-semibold">6 weekly reports</span> — Click any card to download
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {WEEKLY_REPORTS.map((report) => {
                const Icon = report.Icon;
                return (
                  <Card
                    key={report.id}
                    onClick={() => handleDownload(report.title, report.type)}
                    className="border-border hover:border-primary/50 transition-all group cursor-pointer hover:shadow-md hover:-translate-y-1"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                          <Icon size={16} className="text-primary" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant={report.type === "PDF" ? "destructive" : "outline"}
                            className="text-[10px]"
                          >
                            {report.type}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-400/30">
                            Weekly
                          </Badge>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                        {report.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="text-[10px] text-muted-foreground">
                          <span>Last: {report.lastGenerated}</span>
                          <span className="ml-2">· {report.size}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <Download size={11} />
                          Download
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="complaints" radius={[4, 4, 0, 0]} fill="#3b82f6" opacity={0.85} />
                      <Bar dataKey="resolved" radius={[4, 4, 0, 0]} fill="#10b981" opacity={0.85} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-3 h-3 rounded-sm" style={{ background: "#3b82f6" }} />
                      Filed
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-3 h-3 rounded-sm" style={{ background: "#10b981" }} />
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
              {DEPARTMENT_DATA.map((dept) => (
                <Card key={dept.name} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{dept.name.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {dept.total.toLocaleString()} total · {dept.resolved.toLocaleString()} resolved
                          </p>
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
                      <span className="text-[10px] text-muted-foreground">
                        Avg resolution: {dept.avgDays} days
                      </span>
                      <button
                        onClick={() => handleDownload(`${dept.name} Weekly Report`, "XLSX")}
                        className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
                      >
                        <Download size={10} /> Export
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
