import DashboardLayout from "@/layouts/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Sparkles, BarChart2, AlertTriangle, MessageSquare, Target, Lightbulb } from "lucide-react";

import AIOverview from "@/components/ai/AIOverview";
import SentimentAnalysis from "@/components/ai/SentimentAnalysis";
import CategoryIntelligence from "@/components/ai/CategoryIntelligence";
import DuplicateDetection from "@/components/ai/DuplicateDetection";
import RiskIntelligence from "@/components/ai/RiskIntelligence";
import AIInsightsPanel from "@/components/ai/AIInsightsPanel";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header section matching existing theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Brain className="text-primary" size={24} />
              AI Intelligence
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Machine learning insights, classification, and predictive governance.
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <div>
              <p className="text-[10px] text-primary uppercase font-bold tracking-wider opacity-80">Engine Status</p>
              <p className="text-sm font-semibold text-primary leading-none mt-0.5">NxtAI Active</p>
            </div>
          </div>
        </div>

        {/* Complete Phase-based Tab Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-card border border-border w-full flex overflow-x-auto justify-start h-auto p-1 sticky top-0 z-10 scrollbar-hide">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2">
              <Brain size={14} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-2 px-4 py-2">
              <MessageSquare size={14} />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 px-4 py-2">
              <BarChart2 size={14} />
              Categories
            </TabsTrigger>
            <TabsTrigger value="duplicates" className="flex items-center gap-2 px-4 py-2">
              <Target size={14} />
              Duplicates
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2 px-4 py-2">
              <AlertTriangle size={14} />
              Risk
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2 px-4 py-2">
              <Lightbulb size={14} />
              Insights & Predictions
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="m-0 focus-visible:outline-none">
              <AIOverview />
            </TabsContent>
            
            <TabsContent value="sentiment" className="m-0 focus-visible:outline-none">
              <SentimentAnalysis />
            </TabsContent>
            
            <TabsContent value="categories" className="m-0 focus-visible:outline-none">
              <CategoryIntelligence />
            </TabsContent>
            
            <TabsContent value="duplicates" className="m-0 focus-visible:outline-none">
              <DuplicateDetection />
            </TabsContent>
            
            <TabsContent value="risk" className="m-0 focus-visible:outline-none">
              <RiskIntelligence />
            </TabsContent>
            
            <TabsContent value="insights" className="m-0 focus-visible:outline-none">
              <AIInsightsPanel />
            </TabsContent>
          </div>
        </Tabs>
        
      </div>
    </DashboardLayout>
  );
}
