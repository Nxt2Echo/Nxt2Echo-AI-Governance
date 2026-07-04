import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  FileText, Download, CheckCircle2, Clock, AlertCircle,
  XCircle, ChevronDown, ChevronUp, Plus, Hash, MapPin,
  Calendar, Tag, Building2, ShieldAlert,
} from "lucide-react";
import { safeParseDate } from "@/services/api";

const STORAGE_KEY = "nxt2echo_my_complaints";

const STATUS_CONFIG = {
  Pending:     { color: "text-amber-400",  bg: "bg-amber-400/10  border-amber-400/30",  Icon: Clock },
  "In Progress":{ color: "text-blue-400",  bg: "bg-blue-400/10   border-blue-400/30",   Icon: Clock },
  Resolved:    { color: "text-emerald-400",bg: "bg-emerald-400/10 border-emerald-400/30",Icon: CheckCircle2 },
  Escalated:   { color: "text-red-400",    bg: "bg-red-400/10    border-red-400/30",    Icon: ShieldAlert },
  Rejected:    { color: "text-zinc-400",   bg: "bg-zinc-400/10   border-zinc-400/30",   Icon: XCircle },
};

const SEV_COLOR = {
  Low:      "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Medium:   "text-amber-400  border-amber-400/30  bg-amber-400/10",
  High:     "text-orange-400 border-orange-400/30 bg-orange-400/10",
  Critical: "text-red-400    border-red-400/30    bg-red-400/10",
};

function generateReceiptText(c) {
  const lines = [
    "========================================",
    "     NXT2ECHO AI GOVERNANCE PLATFORM",
    "         COMPLAINT RECEIPT",
    "========================================",
    `Complaint ID  : ${c.id}`,
    `Filed On      : ${safeParseDate(c.createdAt).toLocaleString("en-IN")}`,
    `Title         : ${c.title}`,
    `Category      : ${c.category}`,
    `Severity      : ${c.severity}`,
    `Ward / Area   : ${c.ward || "—"}`,
    `Address       : ${c.address || "—"}`,
    `Department    : ${c.department || "BBMP"}`,
    `Status        : ${c.status}`,
    "----------------------------------------",
    "Description:",
    c.description || "—",
    "========================================",
    "This is an auto-generated acknowledgement.",
    "Track your complaint at: /citizen/tracking",
    "========================================",
  ];
  return lines.join("\n");
}

function downloadReceipt(c) {
  const text = generateReceiptText(c);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Receipt_${c.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function ComplaintReceiptCard({ complaint, index }) {
  const [expanded, setExpanded] = useState(index === 0); // auto-open the latest
  const status = complaint.status || "Pending";
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const StatusIcon = cfg.Icon;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/30 transition-all">
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left gap-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <FileText size={15} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{complaint.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Hash size={10} />
              {complaint.id}
              <span className="mx-1">·</span>
              <Calendar size={10} />
              {safeParseDate(complaint.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${cfg.bg} ${cfg.color}`}>
            <StatusIcon size={10} />
            {status}
          </span>
          {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded receipt body */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          {/* Receipt slip look */}
          <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                📄 Complaint Receipt
              </p>
              <p className="text-[10px] text-muted-foreground">
                {safeParseDate(complaint.createdAt).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-border/50">
              {[
                { icon: Hash,      label: "Complaint ID",  value: complaint.id },
                { icon: Tag,       label: "Category",      value: complaint.category },
                { icon: ShieldAlert,label:"Severity",      value: complaint.severity,
                  extra: <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] border ${SEV_COLOR[complaint.severity] || SEV_COLOR.Medium}`}>{complaint.severity}</span> },
                { icon: Building2, label: "Department",    value: complaint.department || "BBMP" },
                { icon: MapPin,    label: "Ward / Area",   value: complaint.ward || "—" },
                { icon: MapPin,    label: "Address",       value: complaint.address || "—" },
              ].map(({ icon: Icon, label, value, extra }) => (
                <div key={label}>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-0.5">
                    <Icon size={9} /> {label}
                  </p>
                  <p className="text-xs font-medium text-foreground truncate">
                    {extra || value}
                  </p>
                </div>
              ))}
            </div>

            {complaint.description && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground mb-1">Description</p>
                <p className="text-xs text-foreground leading-relaxed">{complaint.description}</p>
              </div>
            )}

            {/* Status timeline */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground mb-2">Status Timeline</p>
              <div className="flex items-center gap-2">
                {["Pending", "In Progress", "Resolved"].map((s, i) => {
                  const steps = ["Pending", "In Progress", "Resolved", "Escalated"];
                  const currentIdx = steps.indexOf(status);
                  const stepIdx = steps.indexOf(s);
                  const done = currentIdx >= stepIdx;
                  return (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${done ? "bg-primary" : "bg-border"}`} />
                      <span className={`text-[10px] ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                      {i < 2 && <div className={`h-px w-4 ${done && currentIdx > stepIdx ? "bg-primary" : "bg-border"}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => downloadReceipt(complaint)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Download size={12} />
              Download Receipt
            </button>
            <Link
              to="/citizen/tracking"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-xs hover:text-foreground hover:border-foreground/30 transition-all"
            >
              <Clock size={12} />
              Track Status
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CitizenMyReports() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setComplaints(stored);
    } catch {
      setComplaints([]);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">My Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Receipts and status for all your submitted complaints
            </p>
          </div>
          <Link
            to="/citizen"
            className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={14} />
            New Complaint
          </Link>
        </div>

        {/* Stats bar */}
        {complaints.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Filed",   value: complaints.length,                                             color: "text-blue-400" },
              { label: "Pending",       value: complaints.filter(c => c.status === "Pending" || !c.status).length,     color: "text-amber-400" },
              { label: "Resolved",      value: complaints.filter(c => c.status === "Resolved").length,        color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Complaint list */}
        {complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl text-center">
            <FileText size={36} className="text-muted-foreground mb-3 opacity-40" />
            <p className="text-sm font-medium text-foreground">No complaints filed yet</p>
            <p className="text-xs text-muted-foreground mt-1">Submit your first complaint to see a receipt here</p>
            <Link
              to="/citizen"
              className="mt-4 inline-flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} />
              Register a Complaint
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((complaint, i) => (
              <ComplaintReceiptCard key={complaint.id} complaint={complaint} index={i} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
