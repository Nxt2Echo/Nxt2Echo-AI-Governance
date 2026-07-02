import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { duplicateClusters } from "@/data/aiMockData";
import { Copy, Merge, CheckCircle, Clock } from "lucide-react";

export default function DuplicateDetection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <Copy size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duplicate Percentage</p>
              <h3 className="text-3xl font-bold text-foreground">18.4%</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Est. Time Saved</p>
              <h3 className="text-3xl font-bold text-foreground">29 hrs</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <Merge size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clusters Formed</p>
              <h3 className="text-3xl font-bold text-foreground">3</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clusters List */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Copy size={18} className="text-primary" />
              <CardTitle className="text-base">Active Duplicate Clusters</CardTitle>
            </div>
            <Badge variant="outline">AI Auto-Merge</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {duplicateClusters.map((cluster) => (
              <div key={cluster.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-muted/10 transition-colors">
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground text-sm">{cluster.title}</h4>
                    <Badge variant={cluster.status === "Merged" ? "success" : "warning"} className="text-[10px] h-5">
                      {cluster.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{cluster.count}</span> complaints grouped • System identified {cluster.timeSaved} of manual work saved.
                  </p>
                </div>

                <div className="w-full md:w-64 space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-muted-foreground font-medium">Similarity Score</span>
                      <span className="font-bold text-primary">{cluster.similarityScore}%</span>
                    </div>
                    <Progress value={cluster.similarityScore} className="h-1.5 bg-muted" indicatorClassName="bg-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-muted-foreground font-medium">Merge Confidence</span>
                      <span className="font-bold text-purple-500">{cluster.confidence}%</span>
                    </div>
                    <Progress value={cluster.confidence} className="h-1.5 bg-muted" indicatorClassName="bg-purple-500" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5">
                    <Merge size={12} /> View Cluster
                  </button>
                  {cluster.status !== "Merged" && (
                    <button className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5">
                      <CheckCircle size={12} /> Approve Merge
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
