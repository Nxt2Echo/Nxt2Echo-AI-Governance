import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Building2 } from "lucide-react";

export default function DepartmentPerformance() {
  const { departmentData, loading, error } = useDashboard();

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Building2 size={15} className="text-primary" />
          <CardTitle className="text-sm">Department Performance</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-2 w-28 mt-1" />
            </div>
          ))
        ) : error ? (
          <p className="text-xs text-muted-foreground">⚠ Could not load department data</p>
        ) : (
          departmentData.map((dept) => (
            <div key={dept.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground w-12">{dept.name}</span>
                  <span className="text-[10px] text-muted-foreground">{dept.total?.toLocaleString()} total</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[11px] font-bold ${
                      dept.rate >= 90 ? "text-emerald-400" : dept.rate >= 80 ? "text-amber-400" : "text-red-400"
                    }`}
                  >
                    {dept.rate}%
                  </span>
                </div>
              </div>
              <Progress
                value={dept.rate}
                max={100}
                indicatorClassName={
                  dept.rate >= 90
                    ? "bg-emerald-500"
                    : dept.rate >= 80
                    ? "bg-amber-500"
                    : "bg-red-500"
                }
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">Avg resolution: {dept.avgDays}d</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
