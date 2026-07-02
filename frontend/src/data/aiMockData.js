// ============================================================
// Nxt2Echo – AI Intelligence Module: Mock Data
// ============================================================

export const aiStats = {
  totalAnalysed: 4827,
  positiveSentiment: 1207,
  neutralSentiment: 1448,
  negativeSentiment: 2172,
  positivePercent: 25.0,
  neutralPercent: 30.0,
  negativePercent: 45.0,
  highRiskComplaints: 89,
  duplicatesDetected: 312,
  aiAccuracy: 94.2,
  activeModels: 3,
  totalModels: 4,
  processingSpeed: 1240,
  avgConfidenceScore: 91.3,
  complaintsToday: 143,
  lastUpdated: "2 min ago",
};

export const aiModels = [
  {
    id: "nxtai-classification", name: "NxtAI Classification Engine", version: "v2.4.1", status: "online", accuracy: 94.2, processedToday: 4827, totalProcessed: 124780, lastUpdate: "2 min ago", category: "Classification", uptime: "99.8%", latency: "1.1s", colorClass: "text-primary", bgClass: "bg-primary/10", borderClass: "border-primary/20",
  },
  {
    id: "duplicate-detection", name: "Duplicate Detection Module", version: "v1.8.3", status: "online", accuracy: 96.1, processedToday: 312, totalProcessed: 8940, lastUpdate: "5 min ago", category: "Deduplication", uptime: "99.5%", latency: "2.3s", colorClass: "text-purple-400", bgClass: "bg-purple-500/10", borderClass: "border-purple-500/20",
  },
  {
    id: "risk-scoring", name: "Risk Scoring Engine", version: "v3.1.0", status: "training", accuracy: 88.7, processedToday: 89, totalProcessed: 3210, lastUpdate: "12 min ago", category: "Risk", uptime: "97.2%", latency: "0.6s", colorClass: "text-amber-400", bgClass: "bg-amber-500/10", borderClass: "border-amber-500/20",
  },
  {
    id: "sentiment-analyzer", name: "Sentiment Analyzer", version: "v2.0.5", status: "online", accuracy: 91.3, processedToday: 4791, totalProcessed: 98450, lastUpdate: "1 min ago", category: "NLP", uptime: "99.9%", latency: "0.8s", colorClass: "text-cyan-400", bgClass: "bg-cyan-500/10", borderClass: "border-cyan-500/20",
  },
];

export const sentimentTimeline = [
  { time: "08:00", positive: 45, neutral: 60, negative: 120 },
  { time: "10:00", positive: 52, neutral: 58, negative: 145 },
  { time: "12:00", positive: 61, neutral: 70, negative: 190 },
  { time: "14:00", positive: 48, neutral: 65, negative: 155 },
  { time: "16:00", positive: 70, neutral: 80, negative: 210 },
  { time: "18:00", positive: 85, neutral: 90, negative: 170 },
  { time: "20:00", positive: 55, neutral: 75, negative: 130 },
];

export const sentimentByDept = [
  { dept: "BBMP", positive: 25, neutral: 35, negative: 150 },
  { dept: "BWSSB", positive: 15, neutral: 25, negative: 90 },
  { dept: "BESCOM", positive: 45, neutral: 50, negative: 60 },
  { dept: "PWD", positive: 10, neutral: 20, negative: 110 },
  { dept: "BTP", positive: 30, neutral: 40, negative: 50 },
];

export const recentNegativeFeedback = [
  { id: "CMP-089", dept: "BWSSB", sentiment: "Angry", text: "Water pipe broken for 5 days, no response.", score: 98 },
  { id: "CMP-102", dept: "BBMP", sentiment: "Outraged", text: "Huge garbage pile causing severe health issues.", score: 95 },
  { id: "CMP-145", dept: "PWD", sentiment: "Frustrated", text: "Pothole completely ruined my car suspension.", score: 92 },
];

// --- Phase 3: Category Intelligence ---
export const aiCategoryConfidence = [
  { subject: "Roads", A: 96, fullMark: 100 },
  { subject: "Water", A: 92, fullMark: 100 },
  { subject: "Electricity", A: 98, fullMark: 100 },
  { subject: "Sanitation", A: 89, fullMark: 100 },
  { subject: "Healthcare", A: 94, fullMark: 100 },
  { subject: "Public Safety", A: 91, fullMark: 100 },
];

export const categoryDistribution = [
  { name: "Roads (PWD)", value: 400, color: "#ef4444" },
  { name: "Water (BWSSB)", value: 300, color: "#3b82f6" },
  { name: "Electricity (BESCOM)", value: 300, color: "#f59e0b" },
  { name: "Sanitation (BBMP)", value: 200, color: "#10b981" },
];

// --- Phase 4: Duplicate Detection ---
export const duplicateClusters = [
  {
    id: "CL-892",
    title: "MG Road Potholes",
    count: 23,
    confidence: 96,
    similarityScore: 92,
    timeSaved: "14 hours",
    status: "Merged",
  },
  {
    id: "CL-893",
    title: "Whitefield Water Shortage",
    count: 17,
    confidence: 94,
    similarityScore: 88,
    timeSaved: "9 hours",
    status: "Pending Review",
  },
  {
    id: "CL-894",
    title: "Jayanagar Street Lights",
    count: 12,
    confidence: 89,
    similarityScore: 85,
    timeSaved: "6 hours",
    status: "Merged",
  },
];

// --- Phase 5: Risk Intelligence ---
export const riskZones = [
  { id: 1, area: "BTM Layout", riskScore: 9.8, issue: "Sewage Overflow", trend: "up", severity: "Critical" },
  { id: 2, area: "Koramangala", riskScore: 8.5, issue: "Traffic Gridlock", trend: "up", severity: "High" },
  { id: 3, area: "Indiranagar", riskScore: 7.2, issue: "Water Shortage", trend: "down", severity: "Medium" },
  { id: 4, area: "Shivajinagar", riskScore: 9.1, issue: "Open Manholes", trend: "up", severity: "Critical" },
];

// --- Phase 6, 7, 8: Insights, Recommendations, Predictions ---
export const generatedInsights = [
  { type: "Insight", text: "Most complaints today originate from Ward 12 regarding water leakage.", priority: "High" },
  { type: "Recommendation", text: "Escalate Ward 12 water issues to BWSSB Commissioner immediately.", priority: "Critical" },
  { type: "Prediction", text: "Expected 40% surge in mosquito-related complaints in HSR Layout within 7 days due to stagnant water.", priority: "Medium" },
];

export const recommendationsList = [
  { id: "R-01", target: "CMP-006", dept: "BWSSB", resolutionTime: "4h", action: "Deploy emergency vacuum truck", confidence: 97 },
  { id: "R-02", target: "CMP-011", dept: "BBMP", resolutionTime: "2h", action: "Dispatch barricade and cover team", confidence: 99 },
  { id: "R-03", target: "CMP-002", dept: "BWSSB", resolutionTime: "24h", action: "Schedule water tanker delivery", confidence: 91 },
];
