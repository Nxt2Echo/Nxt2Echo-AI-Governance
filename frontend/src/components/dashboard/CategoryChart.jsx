import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Tag } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl">
      <p className="text-xs font-semibold text-foreground">{d.payload.name}</p>
      <p className="text-sm font-bold text-foreground">{d.value.toLocaleString()}</p>
    </div>
  );
};

export default function CategoryChart() {
  const { categoryData, loading, error } = useDashboard();
  const total = categoryData.reduce((a, b) => a + b.value, 0);

  // Radar chart works best with a max value domain
  const maxValue = Math.max(...categoryData.map(d => d.value), 10);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Tag size={15} className="text-primary" />
          <CardTitle className="text-sm">AI Classification Confidence</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <>
            <Skeleton className="w-full h-[200px] rounded-lg mb-3" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-3 w-full mb-2 rounded" />
            ))}
          </>
        ) : error ? (
          <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground">
            ⚠ Could not load category data
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart cx="50%" cy="50%" outerRadius="45%" data={categoryData}>
                <PolarGrid gridType="polygon" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={2} />
                <PolarAngleAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, maxValue]} tick={false} axisLine={false} />
                <Radar
                  name="Complaints"
                  dataKey="value"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="#0ea5e9"
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1 grid grid-cols-2 gap-x-2">
              {categoryData.map((item) => {
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-[10px] text-muted-foreground truncate" title={item.name}>{item.name}</span>
                    <span className="text-[10px] font-medium text-foreground ml-auto">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
