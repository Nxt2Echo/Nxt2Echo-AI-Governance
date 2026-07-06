import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { aiStats, sentimentByDept, recentNegativeFeedback } from "@/data/aiMockData";
import SentimentTrendChart from "./charts/SentimentTrendChart";
import { MessageSquare, Flame, AlertOctagon, TrendingDown, Building2 } from "lucide-react";

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl text-sm min-w-[150px]">
      <p className="font-medium text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between items-center gap-4 py-1">
          <span className="flex items-center gap-1.5 capitalize" style={{ color: p.color }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
          <span className="font-bold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function SentimentAnalysis() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Cards for Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-gradient-to-br from-card to-red-500/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                <Flame size={24} />
              </div>
              <Badge variant="destructive" className="bg-red-500 text-white hover:bg-red-600 border-0">High Priority</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Negative Sentiment</p>
            <div className="flex items-end gap-2">
              <h3 className="text-4xl font-bold text-foreground tracking-tight">{aiStats.negativePercent}%</h3>
              <span className="text-sm font-medium text-red-500 mb-1 flex items-center gap-1">
                <TrendingDown size={14} /> +5.2%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Positive Score</span>
              <span className="text-sm font-bold text-emerald-500">{aiStats.positivePercent}%</span>
            </div>
            <Progress value={aiStats.positivePercent} className="h-2 bg-secondary" indicatorClassName="bg-emerald-500" />
            
            <div className="flex justify-between items-center mb-2 mt-5">
              <span className="text-sm font-medium text-muted-foreground">Neutral Score</span>
              <span className="text-sm font-bold text-amber-500">{aiStats.neutralPercent}%</span>
            </div>
            <Progress value={aiStats.neutralPercent} className="h-2 bg-secondary" indicatorClassName="bg-amber-500" />
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="p-5 pb-0 border-none">
            <div className="flex items-center gap-2">
              <AlertOctagon size={18} className="text-destructive" />
              <CardTitle className="text-base">Critical Feedback</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              {recentNegativeFeedback.slice(0, 2).map((feedback) => (
                <div key={feedback.id} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-foreground">{feedback.dept}</span>
                    <span className="text-[10px] font-medium text-destructive">{feedback.sentiment}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{feedback.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              <CardTitle className="text-base">Sentiment Trend (Today)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <SentimentTrendChart />
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card className="border-border">
          <CardHeader className="pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              <CardTitle className="text-base">Sentiment by Department</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sentimentByDept}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  barSize={16}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis dataKey="dept" type="category" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }} />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} />
                  <Bar dataKey="negative" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="neutral" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="positive" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
