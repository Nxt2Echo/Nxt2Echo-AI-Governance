import DashboardLayout from "@/layouts/DashboardLayout";
import { useComplaints } from "@/hooks/useComplaints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Search, Filter, FileText, ChevronLeft, ChevronRight,
  ArrowUpDown, MapPin, Building2, Calendar, Brain,
  Sparkles, Clock, RefreshCw, Droplets, Flame, Zap,
  Trash2, Wind, ShieldAlert, CheckCircle2
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, safeParseDate, getSyncedNow } from "@/services/api";

const statusVariant = {
  Critical: "critical", "In Progress": "info", Pending: "warning", Resolved: "success",
};
const priorityVariant = {
  Critical: "critical", High: "high", Medium: "medium", Low: "low",
};

const CATEGORY_META = {
  "Water Supply":   { icon: "💧", dept: "BWSSB", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  "Garbage":        { icon: "🗑️", dept: "BBMP",  color: "text-green-400 bg-green-500/10 border-green-500/20" },
  "Road Damage":    { icon: "🛣️", dept: "PWD",   color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  "Street Lights":  { icon: "💡", dept: "BESCOM",color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  "Drainage":       { icon: "🌊", dept: "BBMP",  color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  "Air Pollution":  { icon: "🌫️", dept: "KSPCB", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  "Flood":          { icon: "🌧️", dept: "BBMP",  color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  "Others":         { icon: "📋", dept: "BBMP",  color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
};

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-3 w-16" /></TableCell>
          <TableCell><Skeleton className="h-3 w-36 mb-1" /><Skeleton className="h-2 w-24" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-14" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-3 w-20" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

const ONE_HOUR = 60 * 60 * 1000;

function isWithinHour(dateStr) {
  if (!dateStr) return false;
  try {
    const d = safeParseDate(dateStr);
    const diff = getSyncedNow() - d.getTime();
    // Allow up to 1 minute of lag buffer (negative diff)
    return diff >= -60000 && diff < ONE_HOUR;
  } catch { return false; }
}

function relativeTime(dateStr) {
  if (!dateStr) return "";
  try {
    const d = safeParseDate(dateStr);
    const diff = getSyncedNow() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.max(0, Math.floor(diff / 60000))}m ago`;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch { return dateStr; }
}

export default function Complaints() {
  const {
    complaints, total, totalPages, categories,
    loading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    categoryFilter, setCategoryFilter,
    page, setPage,
    sortField, sortDir, toggleSort,
    resetPage, PAGE_SIZE,
    refreshComplaints,
  } = useComplaints();

  const [allFetched, setAllFetched] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await apiFetch("/complaints?limit=200");
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setAllFetched(list);
      setLastSync(new Date());
      // Silently refresh the main table data to keep it in sync in real time
      refreshComplaints(true);
    } catch (err) {
      console.warn("Failed to fetch all complaints:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [refreshComplaints]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Split into last-hour and older
  const lastHourComplaints = allFetched.filter(c => isWithinHour(c.createdAt));
  const olderComplaints = allFetched.filter(c => !isWithinHour(c.createdAt));

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Complaint Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">All citizen complaints · Bengaluru, KA</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button onClick={fetchAll} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : lastSync ? `Updated ${relativeTime(lastSync)}` : "Live"}
            </button>
            <span className="text-border">·</span>
            <FileText size={13} />
            <span>{total.toLocaleString()} total</span>
          </div>
        </div>

        {/* ─── NEW COMPLAINTS (LAST 1 HOUR) ─── */}
        <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 via-background to-background shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <CardTitle className="text-sm font-bold">
                  🕐 New Complaints — Last 1 Hour
                </CardTitle>
                {lastHourComplaints.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground animate-pulse">
                    {lastHourComplaints.length} NEW
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                <Clock size={10} /> Auto-refreshes every 15s
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {isSyncing && lastHourComplaints.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {[0,1].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
              </div>
            ) : lastHourComplaints.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5">
                <Clock size={14} className="opacity-40" />
                No new complaints in the last hour. New submissions appear here instantly.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-1">
                {lastHourComplaints.map((c) => {
                  const meta = CATEGORY_META[c.category] || CATEGORY_META["Others"];
                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl bg-card border border-primary/20 hover:border-primary/50 hover:shadow-md transition-all duration-200 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-sm px-1.5 py-0.5 rounded-md border ${meta.color} shrink-0`}>
                            {meta.icon}
                          </span>
                          <p className="text-xs font-semibold text-foreground truncate">{c.title}</p>
                        </div>
                        <span className="text-[10px] text-primary/80 shrink-0 font-medium bg-primary/10 px-1.5 py-0.5 rounded">
                          {relativeTime(c.createdAt)}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-2">{c.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted-foreground gap-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={9} />
                          {c.ward || c.area || "—"}
                        </span>
                        <span className="font-mono text-[9px] opacity-60">#{(c.id || "").slice(-6).toUpperCase()}</span>
                        <Badge
                          variant={priorityVariant[c.priority || c.severity] ?? "outline"}
                          className="text-[8px] px-1 py-0"
                        >
                          {c.priority || c.severity || "—"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ─── ERROR BANNER ─── */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive flex items-center gap-2">
            <Brain size={13} /> Could not load complaints — {error}
          </div>
        )}

        {/* ─── FILTERS ─── */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Filter size={12} /> Filters — All Complaints
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
              <Search size={13} className="text-muted-foreground shrink-0" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search complaints…"
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="w-28">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetPage(); }}>
                <SelectTrigger className="h-8 text-xs">{statusFilter}</SelectTrigger>
                <SelectContent>
                  {["All", "Critical", "In Progress", "Pending", "Resolved"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-28">
              <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); resetPage(); }}>
                <SelectTrigger className="h-8 text-xs">{priorityFilter}</SelectTrigger>
                <SelectContent>
                  {["All", "Critical", "High", "Medium", "Low"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); resetPage(); }}>
                <SelectTrigger className="h-8 text-xs">{categoryFilter}</SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ─── ALL COMPLAINTS TABLE ─── */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-3 px-4 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <FileText size={12} /> All Complaints History
              {!loading && (
                <span className="ml-auto text-[10px] text-muted-foreground/60">
                  Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </span>
              )}
            </div>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24">
                  <button onClick={() => toggleSort("id")} className="flex items-center gap-1 hover:text-foreground text-xs">ID <ArrowUpDown size={10} /></button>
                </TableHead>
                <TableHead>
                  <button onClick={() => toggleSort("title")} className="flex items-center gap-1 hover:text-foreground text-xs">Complaint <ArrowUpDown size={10} /></button>
                </TableHead>
                <TableHead className="hidden md:table-cell text-xs">Area</TableHead>
                <TableHead className="hidden lg:table-cell text-xs">Dept</TableHead>
                <TableHead className="hidden lg:table-cell text-xs">Category</TableHead>
                <TableHead>
                  <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-foreground text-xs">Status <ArrowUpDown size={10} /></button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <button onClick={() => toggleSort("priority")} className="flex items-center gap-1 hover:text-foreground text-xs">Priority <ArrowUpDown size={10} /></button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground text-xs">Date <ArrowUpDown size={10} /></button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                    No complaints match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                complaints.map((c) => {
                  const meta = CATEGORY_META[c.category] || CATEGORY_META["Others"];
                  const isNew = isWithinHour(c.createdAt);
                  return (
                    <TableRow key={c.id} className={`cursor-pointer ${isNew ? "bg-primary/5" : ""}`}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />}
                          {c.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs font-medium text-foreground truncate max-w-[180px]">{c.title}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{c.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={10} />{c.area || c.ward}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-xs">
                          <Building2 size={10} className="text-muted-foreground" />
                          <Badge variant="outline" className="text-[10px]">{c.department || meta.dept}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          {meta.icon} {c.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[c.status] ?? "outline"} className="text-[10px]">{c.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={priorityVariant[c.priority || c.severity] ?? "outline"} className="text-[10px]">
                          {c.priority || c.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar size={10} />{c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—")}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {loading ? "Loading…" : `Page ${page} of ${totalPages}`}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pg) => (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-7 h-7 text-xs rounded transition-colors ${page === pg ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"}`}>
                  {pg}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
