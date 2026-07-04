import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Clock, CheckCircle2, AlertCircle, FileText, Plus,
  MapPin, Flame, Droplets, Zap, Trash2, ShieldAlert,
  RefreshCw, Sparkles
} from "lucide-react";
import { apiFetch } from "@/services/api";

const STORAGE_KEY = "nxt2echo_my_complaints";
const POLL_INTERVAL = 30000; // 30 seconds

const CATEGORY_ICONS = {
  "Road Damage": <Flame size={13} />,
  "Water Supply": <Droplets size={13} />,
  "Street Lights": <Zap size={13} />,
  "Garbage": <Trash2 size={13} />,
  "Flood": <ShieldAlert size={13} />,
  "Drainage": <Trash2 size={13} />,
  "Air Pollution": <ShieldAlert size={13} />,
};

const SEVERITY_COLORS = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

function StatusBadge({ status }) {
  const s = status?.toLowerCase();
  if (s === "resolved")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
        <CheckCircle2 size={11} /> Resolved
      </span>
    );
  if (s === "in progress")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
        <Clock size={11} /> In Progress
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">
      <AlertCircle size={11} /> Pending
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1 mr-4">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
        <div className="h-6 bg-muted rounded-full w-24" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <div className="h-5 bg-muted rounded-full w-20" />
        <div className="h-5 bg-muted rounded-full w-16" />
      </div>
    </div>
  );
}

function ComplaintCard({ complaint }) {
  const severityClass = SEVERITY_COLORS[complaint.severity] || SEVERITY_COLORS.Medium;
  const icon = CATEGORY_ICONS[complaint.category] || <FileText size={13} />;
  const isNew = complaint._local || (complaint.createdAt && (Date.now() - new Date(complaint.createdAt).getTime()) < 60 * 60 * 1000);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      const diff = Date.now() - new Date(d).getTime();
      if (diff < 60000) return "Just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return d; }
  };

  return (
    <div className={`group bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${isNew ? "border-primary/40 ring-1 ring-primary/10" : "border-border hover:border-primary/30"}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm md:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {complaint.title || "Citizen Complaint"}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={11} /> {formatDate(complaint.createdAt)}
            </span>
            {complaint.ward && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={11} /> {complaint.ward}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
        {complaint.description}
      </p>

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
        {complaint.category && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {icon} {complaint.category}
          </span>
        )}
        {complaint.severity && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${severityClass}`}>
            {complaint.severity}
          </span>
        )}
        {complaint.department && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {complaint.department}
          </span>
        )}
        <span className="ml-auto text-xs text-muted-foreground/60 font-mono">
          #{(complaint.id || "").slice(-6).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

/** Merge API complaints with localStorage complaints — deduplicate by ID */
function mergeComplaints(apiList, userId) {
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const userLocal = local.filter(c => !userId || c.userId === userId || c._local);
    const apiIds = new Set(apiList.map(c => c.id));
    const extraLocal = userLocal.filter(c => !apiIds.has(c.id));
    return [...extraLocal, ...apiList].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return apiList;
  }
}

export default function CitizenTracking() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollerRef = useRef(null);

  const loadComplaints = useCallback(async (silent = false) => {
    if (!user) { setLoading(false); return; }
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const res = await apiFetch(`/complaints?userId=${user.id || user.uid}`);
      const apiList = Array.isArray(res) ? res : (res?.data ?? []);
      const merged = mergeComplaints(apiList, user.id || user.uid);
      setComplaints(merged);
      setLastRefresh(new Date());
    } catch {
      // On failure, still show localStorage data
      const merged = mergeComplaints([], user.id || user.uid);
      setComplaints(merged);
      if (merged.length === 0) setError("Unable to reach the server. Showing locally cached complaints.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadComplaints();
    // Auto-refresh every 30s
    pollerRef.current = setInterval(() => loadComplaints(true), POLL_INTERVAL);
    return () => clearInterval(pollerRef.current);
  }, [loadComplaints]);

  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const recentComplaints = complaints.filter(c => now - new Date(c.createdAt).getTime() < ONE_HOUR);
  const olderComplaints = complaints.filter(c => now - new Date(c.createdAt).getTime() >= ONE_HOUR);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-4 md:py-8 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">My Complaints</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? "Loading…" : `${complaints.length} complaint${complaints.length !== 1 ? "s" : ""} · `}
              {!loading && lastRefresh && (
                <span className="text-xs text-muted-foreground/60">
                  Updated {new Date(lastRefresh).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => loadComplaints(true)}
              disabled={isRefreshing}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
              title="Refresh complaints"
            >
              <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            <Link
              to="/citizen"
              className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus size={16} /> New Complaint
            </Link>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 text-sm text-amber-400 flex items-start gap-3 mb-4">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="text-center py-16 border border-border border-dashed rounded-2xl bg-card/50">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-primary/60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Complaints Yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
              Submit your first complaint and it will appear here instantly.
            </p>
            <Link
              to="/citizen"
              className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} /> Submit First Complaint
            </Link>
          </div>
        )}

        {!loading && complaints.length > 0 && (
          <div className="space-y-6">
            {/* 🆕 Last Hour Section */}
            {recentComplaints.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={15} className="text-primary" />
                  <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Submitted in the Last Hour
                  </h2>
                  <span className="ml-auto text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                    {recentComplaints.length} new
                  </span>
                </div>
                <div className="space-y-3">
                  {recentComplaints.map(c => <ComplaintCard key={c.id} complaint={c} />)}
                </div>
              </section>
            )}

            {/* Older Section */}
            {olderComplaints.length > 0 && (
              <section>
                {recentComplaints.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={14} className="text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Earlier Complaints
                    </h2>
                  </div>
                )}
                <div className="space-y-3">
                  {olderComplaints.map(c => <ComplaintCard key={c.id} complaint={c} />)}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Live polling indicator */}
        {!loading && complaints.length > 0 && (
          <p className="text-center text-xs text-muted-foreground/40 mt-6">
            🔄 Auto-refreshes every 30 seconds
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
