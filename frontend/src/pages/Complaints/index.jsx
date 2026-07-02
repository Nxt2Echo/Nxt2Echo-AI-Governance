import DashboardLayout from "@/layouts/DashboardLayout";
import { useComplaints } from "@/hooks/useComplaints";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
} from "lucide-react";

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

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Complaint Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              All citizen complaints · Bengaluru, KA
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText size={13} />
            {loading ? "Loading…" : `${total.toLocaleString()} total`}
          </div>
        </div>

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
