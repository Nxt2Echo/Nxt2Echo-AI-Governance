import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { aiCategoryConfidence } from "@/data/aiMockData";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 shadow-lg rounded-lg text-sm">
        <p className="font-semibold text-foreground mb-1">{payload[0].payload.subject}</p>
        <p className="text-primary flex items-center gap-2">
          <span>AI Confidence:</span>
          <span className="font-bold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryRadarChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="45%" data={aiCategoryConfidence}>
          <PolarGrid gridType="polygon" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={2} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="AI Confidence"
            dataKey="A"
            stroke="#0ea5e9"
            strokeWidth={3}
            fill="#0ea5e9"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
