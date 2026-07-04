import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Map, BarChart3, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";

const officerTabs = [
  { name: "Home", path: "/", icon: LayoutDashboard },
  { name: "Complaints", path: "/complaints", icon: FileText },
  { name: "Heatmap", path: "/heatmap", icon: Map },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

const citizenTabs = [
  { name: "Submit", path: "/citizen", icon: FileText },
  { name: "Track", path: "/citizen/tracking", icon: Map },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const tabs = user?.role === "CITIZEN" ? citizenTabs : officerTabs;

  return (
    // Only visible on mobile (lg:hidden)
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname === tab.path;
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150 min-w-[56px]",
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all",
                active && "bg-primary/15"
              )}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              </div>
              <span className={cn("text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
