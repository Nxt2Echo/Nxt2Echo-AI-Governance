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
  Sparkles, Clock, AlertTriangle, RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/services/api";

const statusVariant = {
  Critical: "critical", "In Progress": "info", Pending: "warning", Resolved: "success",
};
const priorityVariant = {
  Critical: "critical", High: "high", Medium: "medium", Low: "low",
};

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-3 w-16" /></TableCell>
          <TableCell>
            <Skeleton className="h-3 w-36 mb-1" />
            <Skeleton className="h-2 w-24" />
          </TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-14" /></TableCell>
          <TableCell className="hidden xl:table-cell"><Skeleton className="h-2 w-16" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-3 w-20" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function Complaints() {
  const {
    complaints,
    total,
    totalPages,
    categories,
    loading,
    error,
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    categoryFilter, setCategoryFilter,
    page, setPage,
    sortField,
    sortDir,
    toggleSort,
    resetPage,
    PAGE_SIZE,
  } = useComplaints();

  // State to hold and poll complaints from the last hour
  const [newHourComplaints, setNewHourComplaints] = useState([]);
  const [isPolling, setIsPolling] = useState(false);

  // Poll new complaints (under 1 hour) in real-time
  const fetchNewHourComplaints = async () => {
    try {
      setIsPolling(true);
      // Fetch all complaints from backend (limit 50 to search for recent ones)
      const res = await apiFetch("/complaints?limit=50");
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      
      const ONE_HOUR = 60 * 60 * 1000;
      const now = Date.now();
      
      // Filter list to get complaints submitted in the last 1 hour
      const filtered = list.filter(c => {
        const time = c.createdAt ? new Date(c.createdAt).getTime() : 0;
        return now - time < ONE_HOUR;
      });
      
      setNewHourComplaints(filtered);
    } catch (err) {
      console.warn("Failed to fetch real-time hour complaints:", err);
    } finally {
      setIsPolling(false);
    }
  };

  useEffect(() => {
    fetchNewHourComplaints();
    // Poll every 15 seconds to keep it truly real-time for government users
    const interval = setInterval(fetchNewHourComplaints, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      if (diff < 60000) return "Just now";
      return `${Math.floor(diff / 60000)}m ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Complaint Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              All citizen complaints · Bengaluru, KA
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <RefreshCw size={12} className={isPolling ? "animate-spin" : ""} />
              {isPolling ? "Syncing..." : "Live"}
            </span>
            <span>·</span>
            <span>{total.toLocaleString()} total</span>
          </div>
        </div>

        {/* 🚨 NEW COMPLAINTS SECTION (LAST 1 HOUR ONLY) */}
        <Card className={`border-l-4 border-l-primary border-border bg-gradient-to-r from-primary/5 to-transparent shadow-sm transition-all duration-300 ${newHourComplaints.length > 0 ? "opacity-100 scale-100" : "opacity-70"}`}>
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <CardTitle className="text-sm font-bold text-foreground">
                  New Complaints (Last Hour)
                </CardTitle>
                {newHourComplaints.length > 0 && (
                  <Badge className="bg-primary text-primary-foreground animate-bounce px-1.5 py-0.5 text-[10px]">
                    {newHourComplaints.length} new
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                <Clock size={10} /> Auto-polls every 15s
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            {newHourComplaints.length === 0 ? (
              <div className="text-center py-4 text-xs text-muted-foreground/80 flex items-center justify-center gap-1.5">
                <Clock size={12} className="opacity-50" /> No complaints registered in the last hour.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {newHourComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-lg bg-card/45 border border-primary/20 hover:border-primary/50 transition-all duration-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h4 className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                          {c.title}
                        </h4>
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0 text-[9px] px-1.5 py-0">
                          {formatRelativeTime(c.createdAt)}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">
                        {c.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono text-[9px]">
                        #{(c.id || "").slice(-6).toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={9} /> {c.ward || c.area}
                      </span>
                      <Badge variant={priorityVariant[c.priority] ?? "outline"} className="text-[8px] px-1 py-0 border-0">
                        {c.priority || c.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive flex items-center gap-2">
            <Brain size={13} /> Could not load complaints — {error}
          </div>
        )}

        {/* Filters */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Filter size={12} /> Filters
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
            <div className="w-36">
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

        {/* Table */}
        <Card className="border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24">
                  <button onClick={() => toggleSort("id")} className="flex items-center gap-1 hover:text-foreground">
                    ID <ArrowUpDown size={10} />
                  </button>
                </TableHead>
                <TableHead>
                  <button onClick={() => toggleSort("title")} className="flex items-center gap-1 hover:text-foreground">
                    Complaint <ArrowUpDown size={10} />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Area</TableHead>
                <TableHead className="hidden lg:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Category</TableHead>
                <TableHead>
                  <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-foreground">
                    Status <ArrowUpDown size={10} />
                  </button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <button onClick={() => toggleSort("priority")} className="flex items-center gap-1 hover:text-foreground">
                    Priority <ArrowUpDown size={10} />
                  </button>
                </TableHead>
                <TableHead className="hidden xl:table-cell">AI Score</TableHead>
                <TableHead className="hidden md:table-cell">
                  <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground">
                    Date <ArrowUpDown size={10} />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground text-sm">
                    No complaints match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                complaints.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs font-medium text-foreground truncate max-w-[180px]">{c.title}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{c.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={10} />
                        {c.area}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-xs">
                        <Building2 size={10} className="text-muted-foreground" />
                        <Badge variant="outline" className="text-[10px]">{c.department}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-[10px] text-muted-foreground">{c.category}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[c.status] ?? "outline"} className="text-[10px]">
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={priorityVariant[c.priority] ?? "outline"} className="text-[10px]">
                        {c.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-12 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${c.aiScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{c.aiScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar size={10} />
                        {c.date}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {loading
                ? "Loading…"
                : `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, total)}–${Math.min(page * PAGE_SIZE, total)} of ${total}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-7 h-7 text-xs rounded transition-colors ${
                      page === pg ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
