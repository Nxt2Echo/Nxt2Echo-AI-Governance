import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Tag } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl">
      <p className="text-xs font-semibold text-foreground">{d.name}</p>
      <p className="text-sm font-bold text-foreground">{d.value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{d.payload.percent?.toFixed(1)}% of total</p>
    </div>
  );
};

export default function CategoryChart() {
  const { categoryData, loading, error } = useDashboard();
  const total = categoryData.reduce((a, b) => a + b.value, 0);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Tag size={15} className="text-primary" />
          <CardTitle className="text-sm">By Category</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <>
            <Skeleton className="w-full h-[160px] rounded-lg mb-3" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-3 w-full mb-2 rounded" />
            ))}
          </>
        ) : error ? (
          <div className="h-[160px] flex items-center justify-center text-xs text-muted-foreground">
            ⚠ Could not load category data
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {categoryData.map((item) => {
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-[11px] text-muted-foreground flex-1 truncate">{item.name}</span>
                    <span className="text-[11px] font-medium text-foreground">{pct}%</span>
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
