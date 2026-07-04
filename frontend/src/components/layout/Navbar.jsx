import { Bell, ChevronDown, AlertCircle, Info, LogOut, X, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const pageTitles = {
  "/": { title: "Dashboard", sub: "AI Governance Intelligence Overview" },
  "/complaints": { title: "Complaints", sub: "Manage and track citizen complaints" },
  "/analysis": { title: "AI Analysis", sub: "Machine learning insights and predictions" },
  "/heatmap": { title: "Heatmap", sub: "Geographic complaint distribution" },
  "/reports": { title: "Reports", sub: "Analytics, exports and summaries" },
  "/settings": { title: "Settings", sub: "Platform configuration and preferences" },
  "/citizen": { title: "Create Complaint", sub: "Submit your issue to local authorities" },
  "/citizen/tracking": { title: "Track Complaints", sub: "Monitor your submitted complaints" },
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const page = pageTitles[location.pathname] || pageTitles["/"];

  const closeAll = () => {
    setShowNotifications(false);
    setShowAlerts(false);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-3 md:px-6 shrink-0 gap-2">

      {/* Left: Hamburger (mobile only) + Page Title */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-semibold text-foreground leading-tight truncate">{page.title}</h2>
          <p className="text-xs text-muted-foreground leading-tight hidden sm:block truncate">{page.sub}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">

        {/* AI Status Pill — hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400 hidden md:inline">AI Online · 94.2%</span>
          <span className="text-xs font-medium text-emerald-400 md:hidden">AI</span>
        </div>

        {/* Alert Badge */}
        <div className="relative">
          <button
            onClick={() => { setShowAlerts(!showAlerts); setShowNotifications(false); setShowProfileMenu(false); }}
            className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <AlertCircle size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-2 w-64 md:w-72 bg-card border border-border rounded-lg shadow-lg z-50 p-2">
              <div className="flex items-center gap-2 px-2 py-1 border-b border-border mb-1 text-red-500">
                <AlertCircle size={14} />
                <span className="text-xs font-semibold">Critical Alerts</span>
              </div>
              <div className="px-2 py-2 text-xs text-muted-foreground hover:bg-accent rounded cursor-pointer border-l-2 border-red-500 mb-1">
                <span className="font-medium text-foreground block">System Anomaly Detected</span>
                Unusual spike in complaints from East Zone.
              </div>
              <div className="px-2 py-2 text-xs text-muted-foreground hover:bg-accent rounded cursor-pointer border-l-2 border-orange-500">
                <span className="font-medium text-foreground block">API Rate Limit Warning</span>
                Geocoding API usage at 92% of daily quota.
              </div>
            </div>
          )}
        </div>

        {/* Info Icon */}
        <button
          onClick={() => setShowInfoModal(true)}
          className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <Info size={16} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowAlerts(false); setShowProfileMenu(false); }}
            className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50 p-2">
              <div className="text-xs font-semibold text-foreground px-2 py-1 border-b border-border mb-1">Notifications</div>
              <div className="px-2 py-2 text-xs text-muted-foreground hover:bg-accent rounded cursor-pointer">
                New high risk complaint registered in Zone A.
              </div>
              <div className="px-2 py-2 text-xs text-muted-foreground hover:bg-accent rounded cursor-pointer">
                AI Engine completed weekly batch analysis.
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-0.5 hidden sm:block" />

        {/* User */}
        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowAlerts(false); }}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
              {user?.name?.substring(0, 2).toUpperCase() || "GO"}
            </div>
            <span className="hidden md:block text-xs font-medium text-foreground max-w-[80px] truncate">
              {user?.name || user?.role || "User"}
            </span>
            <ChevronDown size={12} className="text-muted-foreground" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 p-1">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-medium text-foreground truncate">{user?.name || "User"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email || user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 text-primary rounded-lg">
                <Info size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Platform Information</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Nxt2Echo AI Governance Intelligence platform provides real-time monitoring and automated analysis of citizen complaints.
            </p>
            <div className="space-y-2 text-xs text-slate-400 bg-accent/50 p-3 rounded-lg border border-border">
              <div className="flex justify-between"><span>Version:</span> <span className="text-foreground">2.4.0-stable</span></div>
              <div className="flex justify-between"><span>Environment:</span> <span className="text-foreground">Production</span></div>
              <div className="flex justify-between"><span>Region:</span> <span className="text-foreground">Bengaluru, KA</span></div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}