import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AIStatCard({ title, value, subValue, icon: Icon, colorClass, bgClass, borderClass }) {
  return (
    <Card className={cn("overflow-hidden border transition-all duration-200 hover:shadow-md", borderClass)}>
      <CardContent className="p-4 sm:p-5 flex items-start gap-4">
        <div className={cn("mt-1 p-2.5 rounded-lg shrink-0", bgClass, colorClass)}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {value}
            </h3>
            {subValue && (
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {subValue}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
