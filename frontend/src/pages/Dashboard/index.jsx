import DashboardLayout from "@/layouts/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import ComplaintTrend from "@/components/dashboard/ComplaintTrend";
import CategoryChart from "@/components/dashboard/CategoryChart";
import DepartmentPerformance from "@/components/dashboard/DepartmentPerformance";
import RecentComplaints from "@/components/dashboard/RecentComplaints";
import AIInsights from "@/components/dashboard/AIInsights";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { Brain, RefreshCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 relative">
        {/* Toast */}
        {showToast && (
          <div className="absolute top-0 right-0 z-50 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={16} />
            <span className="text-sm font-medium">Dashboard data refreshed</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
              Governance Intelligence Dashboard
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Real-time overview · Bengaluru, KA
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
              <Brain size={12} />
              AI Engine Active
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg hover:bg-accent border border-border transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsCards />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ComplaintTrend />
          </div>
          <CategoryChart />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <RecentComplaints />
          </div>
          <DepartmentPerformance />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AIInsights />
          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}