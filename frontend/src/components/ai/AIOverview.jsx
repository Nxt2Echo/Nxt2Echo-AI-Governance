import AIStatCard from "./AIStatCard";
import ModelStatusPanel from "./ModelStatusPanel";
import { aiStats, aiModels } from "@/data/aiMockData";
import { 
  Brain, FileText, Smile, Meh, Frown, AlertOctagon, 
  Copy, Activity, Target, Zap
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AIOverview() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <AIStatCard 
          title="Total AI Analysed" 
          value={aiStats.totalAnalysed.toLocaleString()} 
          subValue={`+${aiStats.complaintsToday} today`}
          icon={Brain} 
          colorClass="text-primary" 
          bgClass="bg-primary/15" 
          borderClass="border-primary/20"
        />
        <AIStatCard 
          title="High Risk Complaints" 
          value={aiStats.highRiskComplaints} 
          subValue="Flagged"
          icon={AlertOctagon} 
          colorClass="text-red-500" 
          bgClass="bg-red-500/15" 
          borderClass="border-red-500/20"
        />
        <AIStatCard 
          title="Duplicate Clusters" 
          value={aiStats.duplicatesDetected} 
          subValue="Merged"
          icon={Copy} 
          colorClass="text-purple-500" 
          bgClass="bg-purple-500/15" 
          borderClass="border-purple-500/20"
        />
        <AIStatCard 
          title="Overall AI Accuracy" 
          value={`${aiStats.aiAccuracy}%`} 
          subValue="Confidence"
          icon={Target} 
          colorClass="text-emerald-500" 
          bgClass="bg-emerald-500/15" 
          borderClass="border-emerald-500/20"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Sentiment Analysis Summary */}
        <Card className="border-border xl:col-span-2">
          <CardHeader className="pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              <CardTitle className="text-base">Sentiment Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Positive */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="p-3 bg-emerald-500/15 rounded-full mb-3 text-emerald-500">
                  <Smile size={24} />
                </div>
                <h4 className="text-3xl font-bold text-emerald-500 mb-1">{aiStats.positivePercent}%</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Positive</p>
                <p className="text-xs text-muted-foreground mt-1">{aiStats.positiveSentiment.toLocaleString()} complaints</p>
              </div>

              {/* Neutral */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="p-3 bg-amber-500/15 rounded-full mb-3 text-amber-500">
                  <Meh size={24} />
                </div>
                <h4 className="text-3xl font-bold text-amber-500 mb-1">{aiStats.neutralPercent}%</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Neutral</p>
                <p className="text-xs text-muted-foreground mt-1">{aiStats.neutralSentiment.toLocaleString()} complaints</p>
              </div>

              {/* Negative */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="p-3 bg-red-500/15 rounded-full mb-3 text-red-500">
                  <Frown size={24} />
                </div>
                <h4 className="text-3xl font-bold text-red-500 mb-1">{aiStats.negativePercent}%</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Negative</p>
                <p className="text-xs text-muted-foreground mt-1">{aiStats.negativeSentiment.toLocaleString()} complaints</p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Quick Processing Stats */}
        <Card className="border-border">
          <CardHeader className="pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-primary" />
              <CardTitle className="text-base">Processing Metrics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 flex flex-col justify-center gap-6 h-[calc(100%-53px)]">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Ingestion & Processing Rate</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">{aiStats.processingSpeed}</span>
                <span className="text-sm text-muted-foreground mb-1">complaints / hour</span>
              </div>
            </div>
            
            <div className="h-px bg-border/50 w-full" />
            
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Avg. AI Processing Time</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">1.8</span>
                <span className="text-sm text-muted-foreground mb-1">seconds / complaint</span>
              </div>
            </div>
            
            <div className="h-px bg-border/50 w-full" />
            
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Active AI Pipelines</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">{aiStats.activeModels}</span>
                <span className="text-sm text-muted-foreground mb-1">models running</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Models Panel */}
      <ModelStatusPanel models={aiModels} />

    </div>
  );
}
