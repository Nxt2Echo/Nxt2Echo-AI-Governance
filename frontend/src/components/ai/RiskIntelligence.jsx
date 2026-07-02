import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { riskZones } from "@/data/aiMockData";
import { AlertTriangle, MapPin, ShieldAlert, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export default function RiskIntelligence() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border bg-gradient-to-br from-card to-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-500/20 text-red-500 rounded-lg">
                <ShieldAlert size={20} />
              </div>
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">City-Wide Risk Score</h3>
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-5xl font-bold text-foreground">7.4<span className="text-2xl text-muted-foreground">/10</span></h2>
              <Badge variant="destructive" className="mb-2 bg-red-500 flex items-center gap-1 border-0">
                <TrendingUp size={12} /> +1.2
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-medium">Elevated risk due to sanitation issues in South Zone.</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2 border-none">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> Active Risk Zones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-2 p-5 pt-0">
              {riskZones.filter(z => z.severity === "Critical").map(zone => (
                <div key={zone.id} className="px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {zone.area}
                </div>
              ))}
              {riskZones.filter(z => z.severity === "High").map(zone => (
                <div key={zone.id} className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {zone.area}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Risk Table */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <CardTitle className="text-base">Risk Escalation Protocol</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {riskZones.map((zone) => (
              <div key={zone.id} className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-muted/10 transition-colors">
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                      <MapPin size={14} className="text-muted-foreground" /> {zone.area}
                    </h4>
                    <Badge variant={zone.severity === "Critical" ? "destructive" : zone.severity === "High" ? "warning" : "secondary"} className="text-[10px] h-4 py-0">
                      {zone.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5 font-medium">Issue: <span className="text-foreground">{zone.issue}</span></p>
                </div>

                <div className="w-full md:w-64">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      Risk Score
                      {zone.trend === "up" ? <TrendingUp size={12} className="text-red-500" /> : <TrendingDown size={12} className="text-emerald-500" />}
                    </span>
                    <span className="text-xs font-bold text-foreground">{zone.riskScore}</span>
                  </div>
                  <Progress 
                    value={zone.riskScore * 10} 
                    className="h-1.5 bg-muted" 
                    indicatorClassName={zone.riskScore > 9 ? "bg-red-500" : zone.riskScore > 7 ? "bg-amber-500" : "bg-emerald-500"} 
                  />
                </div>

                <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold rounded-md shadow flex items-center gap-1.5 transition-colors shrink-0">
                  View Protocol <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
