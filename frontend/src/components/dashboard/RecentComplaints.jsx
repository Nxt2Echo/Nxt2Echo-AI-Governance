import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const statusVariant = {
  Critical: "critical",
  "In Progress": "info",
  Pending: "warning",
  Resolved: "success",
};

const priorityVariant = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "low",
};

export default function RecentComplaints() {
  const { recentComplaints, loading, error } = useDashboard();

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-primary" />
            <CardTitle className="text-sm">Recent Complaints</CardTitle>
          </div>
          <Link
            to="/complaints"
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-16 shrink-0" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-xs text-muted-foreground">⚠ Could not load recent complaints</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden lg:table-cell">Area</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentComplaints.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-medium text-foreground truncate max-w-[160px]">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground">{c.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{c.area}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-[10px]">{c.department}</Badge>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
