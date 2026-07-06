import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

export default function ModelStatusPanel({ models = [] }) {
  return (
    <Card className="border-border col-span-full xl:col-span-1">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          <CardTitle className="text-base">Active AI Models</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {models.map((model) => (
            <div key={model.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-muted/10 transition-colors">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`mt-0.5 p-2 rounded-md shrink-0 ${model.bgClass} ${model.colorClass}`}>
                  <Brain size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-sm truncate">{model.name}</h4>
                    <Badge variant="outline" className="text-[10px] py-0 h-4 px-1.5 font-medium border-border/50 text-muted-foreground">
                      {model.version}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {model.status === "online" ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <AlertTriangle size={12} className="text-amber-500" />
                      )}
                      <span className="capitalize">{model.status}</span>
                    </span>
                    <span>•</span>
                    <span>{model.latency} latency</span>
                    <span>•</span>
                    <span>Updated {model.lastUpdate}</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full sm:w-48 shrink-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Accuracy</span>
                  <span className="text-xs font-bold text-foreground">{model.accuracy}%</span>
                </div>
                <Progress 
                  value={model.accuracy} 
                  className="h-1.5 bg-muted" 
                  indicatorClassName={model.accuracy > 95 ? "bg-emerald-500" : model.accuracy > 90 ? "bg-primary" : "bg-amber-500"} 
                />
                <p className="text-[10px] text-muted-foreground mt-1.5 text-right">
                  {model.processedToday.toLocaleString()} queries today
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
