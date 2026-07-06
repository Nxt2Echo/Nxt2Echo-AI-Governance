import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generatedInsights, recommendationsList } from "@/data/aiMockData";
import { Lightbulb, Wrench, Sparkles, TrendingUp, Target, ArrowRight, X, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function AIInsightsPanel() {
  const [modifyingRec, setModifyingRec] = useState(null);
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Phase 6 & 8: AI Insights & Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Insights */}
        <Card className="border-border">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" />
              <CardTitle className="text-base">Generated Insights (Phase 6)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {generatedInsights.filter(i => i.type !== "Prediction").map((insight, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex gap-3 hover:bg-muted/10 transition-colors">
                  <div className="shrink-0 mt-0.5">
                    {insight.type === "Insight" ? <Lightbulb size={16} className="text-amber-500" /> : <Target size={16} className="text-primary" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground">{insight.type}</h4>
                      <Badge variant={insight.priority === "Critical" ? "destructive" : "outline"} className="text-[10px] h-4 py-0 px-1.5">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <Card className="border-border">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-500" />
              <CardTitle className="text-base">Predictive Forecast (Phase 8)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {generatedInsights.filter(i => i.type === "Prediction").map((prediction, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex gap-3 hover:bg-muted/10 transition-colors">
                  <div className="shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-purple-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground">Forecast Warning</h4>
                      <Badge variant="warning" className="text-[10px] h-4 py-0 px-1.5 bg-amber-500/20 text-amber-500 border-0">
                        7 Day Window
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{prediction.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase 7: AI Recommendations */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-emerald-500" />
            <CardTitle className="text-base">Actionable Recommendations (Phase 7)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {recommendationsList.map((rec) => (
              <div key={rec.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                
                <div className="flex items-start gap-3 flex-1">
                  <div className="shrink-0 p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Suggested Action for {rec.target}</h4>
                    <p className="text-sm text-emerald-500 font-medium mb-1.5">{rec.action}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                      <span className="text-foreground">{rec.dept}</span>
                      <span>•</span>
                      <span>Est. Resolution: {rec.resolutionTime}</span>
                      <span>•</span>
                      <span>Confidence: {rec.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                  <button className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5">
                    Approve Action
                  </button>
                  <button 
                    onClick={() => setModifyingRec(rec)}
                    className="px-3 py-2 border border-border text-foreground hover:bg-muted text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
                  >
                    Modify <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modify Modal */}
      {modifyingRec && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setModifyingRec(null)}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/20 text-primary rounded-lg">
                <Wrench size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Modify Recommendation</h3>
                <p className="text-sm text-muted-foreground">Adjust parameters before approval</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Target Area</label>
                <input 
                  type="text" 
                  disabled
                  defaultValue={modifyingRec.target} 
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Suggested Action</label>
                <textarea 
                  defaultValue={modifyingRec.action} 
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none h-20" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Assigned Dept</label>
                  <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none">
                    <option>{modifyingRec.dept}</option>
                    <option>Sanitation Dept</option>
                    <option>Traffic Police</option>
                    <option>Water Board</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Est. Resolution Time</label>
                  <input 
                    type="text" 
                    defaultValue={modifyingRec.resolutionTime} 
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none" 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setModifyingRec(null)}
                className="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setModifyingRec(null)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Save & Approve
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
