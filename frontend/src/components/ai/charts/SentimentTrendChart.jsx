import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { sentimentTimeline } from "@/data/aiMockData";

const CustomTooltip = ({ active, payload, label }) => {
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

export default function SentimentTrendChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={sentimentTimeline}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="positive" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPositive)" 
          />
          <Area 
            type="monotone" 
            dataKey="neutral" 
            stroke="#f59e0b" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorNeutral)" 
          />
          <Area 
            type="monotone" 
            dataKey="negative" 
            stroke="#ef4444" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorNegative)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
