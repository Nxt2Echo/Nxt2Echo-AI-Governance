import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { categoryDistribution } from "@/data/aiMockData";
import CategoryRadarChart from "./charts/CategoryRadarChart";
import { BarChart2, CheckCircle2, LayoutGrid, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function CategoryIntelligence() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-primary" />
              <CardTitle className="text-base">AI Classification Confidence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <CategoryRadarChart />
          </CardContent>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <BarChart2 size={18} className="text-primary" />
              <CardTitle className="text-base">Real-time Category Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotspots / Critical Categories */}
      <Card className="border-border">
        <CardHeader className="pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-primary" />
            <CardTitle className="text-base">Category Action Items</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <div className="mt-0.5 text-red-500"><CheckCircle2 size={16} /></div>
              <div>
                <h4 className="font-semibold text-red-500 text-sm mb-1">Roads & Infrastructure</h4>
                <p className="text-xs text-muted-foreground">Highest volume of complaints today. Recommend assigning priority to PWD teams in East Zone.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
              <div className="mt-0.5 text-blue-500"><CheckCircle2 size={16} /></div>
              <div>
                <h4 className="font-semibold text-blue-500 text-sm mb-1">Water Supply</h4>
                <p className="text-xs text-muted-foreground">3 clusters of water shortages detected. Escalate to BWSSB rapid response.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <div className="mt-0.5 text-amber-500"><CheckCircle2 size={16} /></div>
              <div>
                <h4 className="font-semibold text-amber-500 text-sm mb-1">Electricity</h4>
                <p className="text-xs text-muted-foreground">Power outage complaints stabilizing. Routine monitoring recommended.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
