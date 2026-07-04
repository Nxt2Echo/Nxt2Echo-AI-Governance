import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../lib/firebase";
import { Mic, Camera, Send, StopCircle, CheckCircle2, User, FileText, AlertCircle } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STORAGE_KEY = "nxt2echo_my_complaints";

function saveComplaintLocally(complaint) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // Prepend newest first, keep last 50
    const updated = [complaint, ...existing].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export default function CitizenPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Others");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [image, setImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMsg, setErrorMsg] = useState("");
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMsg("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("title", title || (description ? description.substring(0, 20) + "..." : "Voice Complaint"));
      formData.append("description", description);
      formData.append("category", category);
      formData.append("severity", severity);
      formData.append("ward", ward);
      formData.append("address", address);
      formData.append("latitude", "12.9716"); // default dummy coords
      formData.append("longitude", "77.5946");
      
      if (image) {
        formData.append("image", image);
      }
      if (audioBlob) {
        formData.append("voice", audioBlob, "voice-recording.webm");
      }

      // Get auth token (JWT from backend login, or mock Firebase token)
      let token = null;
      try {
        const stored = localStorage.getItem('nxt2echo_user');
        if (stored) token = JSON.parse(stored).token;
      } catch {}
      if (!token && auth.currentUser) token = await auth.currentUser.getIdToken();

      const response = await fetch(`${BASE_URL}/complaints`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData
      });

      if (!response.ok) {
        let errStr = "Failed to submit complaint";
        try {
          const errData = await response.json();
          if (errData.error) errStr = typeof errData.error === 'string' ? errData.error : (errData.error.message || JSON.stringify(errData.error));
          else if (errData.errors?.length) errStr = errData.errors.map(e => e.msg || JSON.stringify(e)).join(", ");
          else errStr = JSON.stringify(errData);
        } catch {}
        throw new Error(errStr);
      }

      const result = await response.json();
      const submittedComplaint = result.data || {};

      // ✅ Save to localStorage immediately for real-time tracking
      const localComplaint = {
        id: submittedComplaint.id || `local-${Date.now()}`,
        title: title || description.substring(0, 60) + (description.length > 60 ? "..." : ""),
        description,
        category,
        severity,
        ward,
        address,
        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user?.id || user?.uid || "local",
        department: { "Road Damage": "PWD", "Water Supply": "BWSSB", "Garbage": "BBMP", "Street Lights": "BESCOM", "Drainage": "BBMP" }[category] || "BBMP",
        ...submittedComplaint,
        _local: true,
      };
      saveComplaintLocally(localComplaint);

      setStatus("success");
      // Reset form
      setDescription("");
      setTitle("");
      setAddress("");
      setWard("");
      setImage(null);
      setAudioBlob(null);
      // Navigate to My Reports so user sees their receipt immediately
      setTimeout(() => navigate("/citizen/my-reports"), 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during submission.");
      setStatus("error");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-4 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Register a Complaint</h1>
            <p className="text-muted-foreground mt-1 text-xs md:text-sm">Submit your issue via text, photo, or voice recording.</p>
          </div>
          <Link to="/citizen/tracking" className="self-start sm:self-auto text-sm bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors shrink-0">
            Track Complaints
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {status === "success" && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-500">Complaint Submitted Successfully!</h4>
                <p className="text-xs text-muted-foreground mt-1">Your complaint has been forwarded to the concerned department. You can track its status in the tracking section.</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-500">Submission Failed</h4>
                <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                  Complaint Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="E.g., Pothole on Main Street"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Category
                </label>
                <select
                  className="w-full bg-background text-foreground border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ colorScheme: "dark" }}
                >
                  <option value="Water Supply" className="bg-slate-900 text-white">💧 Water Supply</option>
                  <option value="Garbage" className="bg-slate-900 text-white">🗑️ Sanitation &amp; Garbage</option>
                  <option value="Road Damage" className="bg-slate-900 text-white">🛣️ Roads &amp; Infrastructure</option>
                  <option value="Street Lights" className="bg-slate-900 text-white">💡 Street Lights &amp; Electricity</option>
                  <option value="Drainage" className="bg-slate-900 text-white">🌊 Drainage &amp; Sewage</option>
                  <option value="Air Pollution" className="bg-slate-900 text-white">🌫️ Air &amp; Environment</option>
                  <option value="Flood" className="bg-slate-900 text-white">🌧️ Flood &amp; Public Safety</option>
                  <option value="Others" className="bg-slate-900 text-white">📋 Others</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                  Locality / Address
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Street name, landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                  Ward Number/Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="E.g., Ward 152"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Describe the Issue
              </label>
              <textarea
                required={!audioBlob}
                className="w-full h-32 bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="What is the problem? E.g., Broken streetlight at MG Road..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">Text description is required unless you provide a voice recording.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Upload */}
              <div className="border border-border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Camera size={24} className="text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">Attach a Photo</h3>
                <p className="text-xs text-muted-foreground mb-4">Take a picture of the issue</p>
                <label className="bg-background border border-border text-foreground px-4 py-2 rounded-lg text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
                  {image ? "Change Photo" : "Upload Photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {image && <p className="text-xs text-emerald-500 mt-3 flex items-center gap-1"><CheckCircle2 size={12} /> {image.name}</p>}
              </div>

              {/* Voice Record */}
              <div className="border border-border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isRecording ? 'bg-red-500/20 animate-pulse' : 'bg-primary/10'}`}>
                  {isRecording ? <Mic size={24} className="text-red-500" /> : <Mic size={24} className="text-primary" />}
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">Record a Voice Message</h3>
                <p className="text-xs text-muted-foreground mb-4">Speak about the problem</p>
                
                {!isRecording ? (
                  <button type="button" onClick={startRecording} className="bg-background border border-border text-foreground px-4 py-2 rounded-lg text-xs font-medium hover:bg-muted transition-colors">
                    {audioBlob ? "Record Again" : "Start Recording"}
                  </button>
                ) : (
                  <button type="button" onClick={stopRecording} className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-medium hover:bg-red-500/20 flex items-center gap-2">
                    <StopCircle size={16} /> Stop Recording
                  </button>
                )}
                {audioBlob && !isRecording && <p className="text-xs text-emerald-500 mt-3 flex items-center gap-1"><CheckCircle2 size={12} /> Audio recorded</p>}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {status === "submitting" ? "Submitting..." : "Submit Complaint"}
                {status !== "submitting" && <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
