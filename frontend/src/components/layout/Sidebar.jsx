import {
  LayoutDashboard,
  FileText,
  Brain,
  Map,
  BarChart3,
  Settings,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";

const officerMenuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Complaints", path: "/complaints", icon: FileText, badge: "1.2k" },
  { name: "AI Analysis", path: "/analysis", icon: Brain, badge: "New" },
  { name: "Heatmap", path: "/heatmap", icon: Map },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

const citizenMenuItems = [
  { name: "Create Complaint", path: "/citizen", icon: FileText },
  { name: "Track Complaints", path: "/citizen/tracking", icon: Map },
  { name: "Settings", path: "/settings", icon: Settings },
];

const quickStats = [
  { label: "Critical", value: "89", icon: AlertTriangle, color: "text-red-400" },
  { label: "Pending", value: "1.2k", icon: Clock, color: "text-amber-400" },
  { label: "Resolved", value: "3.2k", icon: CheckCircle2, color: "text-emerald-400" },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = user?.role === "CITIZEN" ? citizenMenuItems : officerMenuItems;

  const handleNav = () => {
    // Close drawer on mobile when a link is tapped
    if (onClose) onClose();
  };

  return (
    <>
      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <aside
        className={cn(
          // Base styles
          "fixed lg:static top-0 left-0 h-full z-40",
          "w-64 bg-card border-r border-border flex flex-col shrink-0",
          // Mobile: slide in/out
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible, no transform
          "lg:translate-x-0"
        )}
      >
        {/* Brand + Close button on mobile */}
        <div className="px-5 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/logo.jpg" alt="Nxt2Echo Logo" className="w-full h-full object-cover rounded-md" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">Nxt2Echo</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">AI Governance</p>
            </div>
          </div>
          {/* Close button — only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Navigation
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleNav}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 text-sm font-medium",
                  active
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon size={16} className={cn("shrink-0", active ? "text-primary" : "")} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    active
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight size={12} className="text-primary opacity-60" />}
              </Link>
            );
          })}

          {/* Quick Stats */}
          <div className="mt-6">
            <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Live Stats
            </p>
            <div className="rounded-lg border border-border bg-background/50 p-3 space-y-2">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon size={12} className={stat.color} />
                      {stat.label}
                    </div>
                    <span className={cn("text-xs font-bold", stat.color)}>{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-border">
          <div
            onClick={() => { navigate("/settings"); handleNav(); }}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {user?.name?.substring(0, 2).toUpperCase() || "GO"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user?.name || "Gov. Officer"}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.role === "CITIZEN" ? "Citizen Portal" : `${user?.department || "BBMP"} — ${user?.city || "Bengaluru"}`}
              </p>
            </div>
            <ChevronRight size={12} className="text-muted-foreground" />
          </div>
        </div>
      </aside>
    </>
  );
}