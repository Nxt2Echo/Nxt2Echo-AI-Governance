import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../lib/firebase";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Clock, CheckCircle2, AlertCircle, FileText, Plus,
  ChevronRight, MapPin, Flame, Droplets, Zap, Trash2, ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/services/api";

const CATEGORY_ICONS = {
  Infrastructure: <Flame size={14} />,
  WaterSupply: <Droplets size={14} />,
  Electricity: <Zap size={14} />,
  Sanitation: <Trash2 size={14} />,
  PublicSafety: <ShieldAlert size={14} />,
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
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
        <CheckCircle2 size={11} /> Resolved
      </span>
    );
  if (s === "in progress")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
        <Clock size={11} /> In Progress
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">
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

export default function CitizenTracking() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiFetch(`/complaints?userId=${user.id || user.uid}`);
        // Handle both array and {data: [...]} shapes
        const list = Array.isArray(response) ? response : (response?.data ?? []);
        setComplaints(list);
      } catch (err) {
        setError(err.message || "Unable to load your complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-4 md:py-8 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              My Complaints
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? "Loading your reports…" : `${complaints.length} complaint${complaints.length !== 1 ? "s" : ""} submitted`}
            </p>
          </div>
          <Link
            to="/citizen"
            className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={16} /> New Complaint
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-5 text-sm text-red-400 flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Failed to load complaints</p>
              <p className="text-red-400/70">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && complaints.length === 0 && (
          <div className="text-center py-16 border border-border border-dashed rounded-2xl bg-card/50">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-primary/60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Complaints Yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
              You haven't submitted any complaints. Report an issue and track its resolution right here.
            </p>
            <Link
              to="/citizen"
              className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} /> Submit First Complaint
            </Link>
          </div>
        )}

        {/* Complaints list */}
        {!loading && !error && complaints.length > 0 && (
          <div className="space-y-4">
            {complaints.map((complaint) => {
              const severityClass = SEVERITY_COLORS[complaint.severity] || SEVERITY_COLORS.Medium;
              const icon = CATEGORY_ICONS[complaint.category] || <FileText size={14} />;

              return (
                <div
                  key={complaint.id}
                  className="group bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {complaint.title || "Citizen Complaint"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={11} />
                          {formatDate(complaint.createdAt)}
                        </span>
                        {complaint.ward && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={11} />
                            {complaint.ward}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
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
                    <span className="ml-auto text-xs text-muted-foreground font-mono">
                      #{(complaint.id || "").slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
