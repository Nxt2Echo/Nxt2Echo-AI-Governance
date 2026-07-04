import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../lib/firebase";
import DashboardLayout from "@/layouts/DashboardLayout";
import { MapPin, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CitizenTracking() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (!user || !auth.currentUser) return;
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`http://localhost:5000/api/complaints?userId=${user.id || user.uid}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch complaints");
        
        const data = await response.json();
        setComplaints(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'resolved': return <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"><CheckCircle2 size={12} className="mr-1"/> Resolved</Badge>;
      case 'in progress': return <Badge variant="warning" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"><Clock size={12} className="mr-1"/> In Progress</Badge>;
      default: return <Badge variant="outline" className="text-slate-400 border-slate-700"><AlertCircle size={12} className="mr-1"/> Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Track Complaints</h1>
            <p className="text-muted-foreground mt-1 text-sm">View the status of the issues you've reported.</p>
          </div>
          <Link to="/citizen" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            New Complaint
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm">{error}</div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 border border-border border-dashed rounded-xl bg-card">
            <FileText size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No Complaints Found</h3>
            <p className="text-sm text-muted-foreground mt-2">You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map(complaint => (
              <div key={complaint.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{complaint.title || "Citizen Complaint"}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock size={12} /> {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(complaint.status)}
                </div>
                
                <p className="text-sm text-slate-300 mt-3 line-clamp-2">{complaint.description}</p>
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  {complaint.category && (
                    <Badge variant="outline" className="text-xs bg-slate-900/50">{complaint.category}</Badge>
                  )}
                  {complaint.urgency && (
                    <Badge variant="outline" className="text-xs bg-slate-900/50">Urgency: {complaint.urgency}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
