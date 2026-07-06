// ============================================================
// Nxt2Echo – AI Governance Platform: Fallback / Placeholder Data
// ============================================================

export const fallbackStats = {
  totalComplaints: 4827,
  pendingComplaints: 1243,
  resolvedComplaints: 3284,
  criticalIssues: 89,
  aiConfidenceScore: 94.2,
  avgResolutionDays: 3.7,
  duplicatesDetected: 312,
  satisfactionRate: 87.4,
};

export const fallbackComplaints = [
  { id: "CMP-001", title: "Pothole on MG Road causing accidents", status: "Critical", priority: "High", category: "Infrastructure", department: "PWD", area: "Koramangala", date: "2024-06-15", description: "Large pothole on MG Road near signal causing vehicle damage.", aiScore: 96, sentiment: "Angry", risk: 9.2 },
  { id: "CMP-002", title: "Water supply disruption for 3 days", status: "In Progress", priority: "High", category: "Water Supply", department: "BWSSB", area: "Indiranagar", date: "2024-06-14", description: "No water supply in the area for 3 consecutive days.", aiScore: 91, sentiment: "Frustrated", risk: 8.1 },
  { id: "CMP-003", title: "Garbage not collected for 2 weeks", status: "Pending", priority: "Medium", category: "Sanitation", department: "BBMP", area: "HSR Layout", date: "2024-06-14", description: "Garbage collection skipped for over 2 weeks.", aiScore: 88, sentiment: "Disappointed", risk: 6.5 },
  { id: "CMP-004", title: "Broken street light near school", status: "Resolved", priority: "Medium", category: "Electricity", department: "BESCOM", area: "Jayanagar", date: "2024-06-13", description: "Street light has been broken for over a month near government school.", aiScore: 85, sentiment: "Concerned", risk: 5.8 },
  { id: "CMP-005", title: "Stray dog menace in residential area", status: "Pending", priority: "High", category: "Public Safety", department: "BBMP", area: "Whitefield", date: "2024-06-13", description: "Large pack of stray dogs attacking residents.", aiScore: 92, sentiment: "Fearful", risk: 8.7 },
  { id: "CMP-006", title: "Sewage overflow on main street", status: "Critical", priority: "Critical", category: "Sanitation", department: "BWSSB", area: "BTM Layout", date: "2024-06-12", description: "Sewage water overflowing onto the main road causing health hazard.", aiScore: 97, sentiment: "Outraged", risk: 9.8 },
  { id: "CMP-007", title: "Illegal construction blocking road", status: "In Progress", priority: "Medium", category: "Infrastructure", department: "BBMP", area: "Rajajinagar", date: "2024-06-12", description: "Unauthorized construction material dumped on public road.", aiScore: 79, sentiment: "Annoyed", risk: 5.2 },
  { id: "CMP-008", title: "Power outage lasting 8 hours daily", status: "In Progress", priority: "High", category: "Electricity", department: "BESCOM", area: "Electronic City", date: "2024-06-11", description: "Scheduled power cuts exceeding 8 hours affecting IT companies.", aiScore: 89, sentiment: "Frustrated", risk: 7.4 },
  { id: "CMP-009", title: "Park encroached by commercial vendors", status: "Pending", priority: "Low", category: "Public Spaces", department: "BBMP", area: "Malleswaram", date: "2024-06-11", description: "Vendors have set up permanent stalls inside the public park.", aiScore: 72, sentiment: "Disappointed", risk: 3.9 },
  { id: "CMP-010", title: "Noise pollution from construction site", status: "Resolved", priority: "Medium", category: "Environment", department: "KSPCB", area: "Marathahalli", date: "2024-06-10", description: "Construction work running 24x7 violating noise pollution norms.", aiScore: 81, sentiment: "Annoyed", risk: 4.7 },
  { id: "CMP-011", title: "Missing manhole cover on busy road", status: "Critical", priority: "Critical", category: "Infrastructure", department: "BBMP", area: "Shivajinagar", date: "2024-06-10", description: "Open manhole on busy junction causing accidents.", aiScore: 98, sentiment: "Alarmed", risk: 9.9 },
  { id: "CMP-012", title: "Waterlogging during rain at underpass", status: "Pending", priority: "High", category: "Drainage", department: "BBMP", area: "Hebbal", date: "2024-06-09", description: "Underpass floods during every rain causing traffic blockage.", aiScore: 87, sentiment: "Frustrated", risk: 7.6 },
  { id: "CMP-013", title: "Illegal dumping of construction waste", status: "In Progress", priority: "Medium", category: "Environment", department: "KSPCB", area: "Sarjapur", date: "2024-06-09", description: "Builder illegally dumping debris near lake area.", aiScore: 84, sentiment: "Concerned", risk: 6.1 },
  { id: "CMP-014", title: "No proper bus shelter at major stop", status: "Pending", priority: "Low", category: "Transport", department: "BMTC", area: "Yeshwanthpur", date: "2024-06-08", description: "Bus stop on major route has no shelter causing inconvenience.", aiScore: 68, sentiment: "Disappointed", risk: 2.8 },
  { id: "CMP-015", title: "Tree fallen on power line after storm", status: "Resolved", priority: "Critical", category: "Electricity", department: "BESCOM", area: "Basavanagudi", date: "2024-06-08", description: "Tree fallen on high tension power line after last night's storm.", aiScore: 95, sentiment: "Alarmed", risk: 9.1 },
  { id: "CMP-016", title: "Broken pipeline causing water wastage", status: "In Progress", priority: "High", category: "Water Supply", department: "BWSSB", area: "Yelahanka", date: "2024-06-07", description: "Main pipeline broken wasting thousands of litres daily.", aiScore: 90, sentiment: "Frustrated", risk: 7.9 },
  { id: "CMP-017", title: "School road in terrible condition", status: "Pending", priority: "High", category: "Infrastructure", department: "PWD", area: "JP Nagar", date: "2024-06-07", description: "Road leading to government school full of potholes.", aiScore: 86, sentiment: "Angry", risk: 7.2 },
  { id: "CMP-018", title: "Overflowing garbage bin at market", status: "Resolved", priority: "Medium", category: "Sanitation", department: "BBMP", area: "Chickpet", date: "2024-06-06", description: "Central market garbage bin overflowing creating health hazard.", aiScore: 83, sentiment: "Disgusted", risk: 6.3 },
  { id: "CMP-019", title: "Encroachment on footpath by shops", status: "Pending", priority: "Low", category: "Infrastructure", department: "BBMP", area: "Commercial Street", date: "2024-06-06", description: "Shops have permanently occupied the footpath.", aiScore: 71, sentiment: "Annoyed", risk: 3.4 },
  { id: "CMP-020", title: "Contaminated water supply reported", status: "Critical", priority: "Critical", category: "Water Supply", department: "BWSSB", area: "Ramamurthy Nagar", date: "2024-06-05", description: "Residents reporting brown contaminated water from taps.", aiScore: 97, sentiment: "Outraged", risk: 9.7 },
];

export const fallbackTrendData = [
  { month: "Jan", complaints: 312, resolved: 289 },
  { month: "Feb", complaints: 287, resolved: 261 },
  { month: "Mar", complaints: 398, resolved: 354 },
  { month: "Apr", complaints: 421, resolved: 389 },
  { month: "May", complaints: 378, resolved: 342 },
  { month: "Jun", complaints: 445, resolved: 398 },
  { month: "Jul", complaints: 502, resolved: 445 },
  { month: "Aug", complaints: 467, resolved: 421 },
  { month: "Sep", complaints: 389, resolved: 367 },
  { month: "Oct", complaints: 412, resolved: 378 },
  { month: "Nov", complaints: 356, resolved: 334 },
  { month: "Dec", complaints: 298, resolved: 276 },
];

export const fallbackCategoryData = [
  { name: "Infrastructure", value: 1243, color: "#6366f1" },
  { name: "Sanitation", value: 987, color: "#22d3ee" },
  { name: "Water Supply", value: 756, color: "#3b82f6" },
  { name: "Electricity", value: 634, color: "#f59e0b" },
  { name: "Public Safety", value: 521, color: "#ef4444" },
  { name: "Environment", value: 389, color: "#10b981" },
  { name: "Transport", value: 297, color: "#8b5cf6" },
];

export const fallbackDepartmentData = [
  { name: "BBMP", total: 1876, resolved: 1654, rate: 88.2, avgDays: 2.8 },
  { name: "BWSSB", total: 892, resolved: 743, rate: 83.3, avgDays: 4.1 },
  { name: "BESCOM", total: 734, resolved: 689, rate: 93.9, avgDays: 1.9 },
  { name: "PWD", total: 621, resolved: 512, rate: 82.4, avgDays: 5.3 },
  { name: "KSPCB", total: 312, resolved: 267, rate: 85.6, avgDays: 3.4 },
  { name: "BMTC", total: 198, resolved: 154, rate: 77.8, avgDays: 6.2 },
  { name: "BDA", total: 194, resolved: 165, rate: 85.1, avgDays: 4.7 },
];

export const fallbackAIInsights = [
  {
    id: 1,
    type: "Pattern",
    title: "Pothole complaints spike 340% after monsoon",
    description: "AI detected a recurring seasonal pattern. Pothole-related complaints increase by 340% in the first 2 weeks post-monsoon. Pre-emptive repair in high-traffic zones recommended.",
    confidence: 97,
    department: "PWD",
    priority: "High",
    action: "Schedule pre-monsoon road survey",
    timestamp: "2 hours ago",
    icon: "trend",
  },
  {
    id: 2,
    type: "Duplicate",
    title: "312 duplicate complaints detected this week",
    description: "AI identified 312 semantically duplicate complaints from different citizens about the same 47 underlying issues. Merging reduces workload by 28%.",
    confidence: 94,
    department: "Multiple",
    priority: "Medium",
    action: "Merge duplicate complaints",
    timestamp: "4 hours ago",
    icon: "duplicate",
  },
  {
    id: 3,
    type: "Risk",
    title: "BTM Layout sewage overflow — health emergency risk",
    description: "Sentiment analysis + complaint frequency model predicts 89% probability of a public health emergency in BTM Layout within 72 hours if action is not taken.",
    confidence: 89,
    department: "BWSSB",
    priority: "Critical",
    action: "Deploy emergency repair team",
    timestamp: "1 hour ago",
    icon: "alert",
  },
  {
    id: 4,
    type: "Efficiency",
    title: "BESCOM resolution time improved 41%",
    description: "BESCOM reduced average resolution time from 3.2 days to 1.9 days over 90 days. AI routing optimization contributed 67% to this improvement.",
    confidence: 91,
    department: "BESCOM",
    priority: "Low",
    action: "Share best practices",
    timestamp: "6 hours ago",
    icon: "success",
  },
  {
    id: 5,
    type: "Cluster",
    title: "9 complaints cluster detected in Whitefield",
    description: "AI clustering identified 9 water-supply complaints within a 1.2km radius in Whitefield pointing to a single pipeline issue. Unified resolution recommended.",
    confidence: 93,
    department: "BWSSB",
    priority: "High",
    action: "Dispatch pipeline inspection team",
    timestamp: "3 hours ago",
    icon: "cluster",
  },
];

export const fallbackActivityFeed = [
  { id: 1, action: "Complaint CMP-011 escalated to Critical", actor: "AI System", time: "2 min ago", type: "escalation" },
  { id: 2, action: "CMP-015 marked as Resolved by BESCOM team", actor: "Team BESCOM", time: "14 min ago", type: "resolved" },
  { id: 3, action: "312 duplicate complaints auto-merged", actor: "AI System", time: "28 min ago", type: "ai" },
  { id: 4, action: "New complaint CMP-020 flagged as Critical", actor: "AI System", time: "45 min ago", type: "critical" },
  { id: 5, action: "Weekly report generated and sent to Commissioner", actor: "System", time: "1 hr ago", type: "report" },
  { id: 6, action: "CMP-018 resolved — BBMP garbage pickup completed", actor: "Team BBMP", time: "2 hr ago", type: "resolved" },
  { id: 7, action: "AI model retrained with 1,200 new complaint samples", actor: "AI System", time: "3 hr ago", type: "ai" },
  { id: 8, action: "Emergency alert sent to BWSSB for CMP-006", actor: "AI System", time: "4 hr ago", type: "critical" },
];

export const fallbackHeatmapZones = [
  { id: 1, name: "BTM Layout", risk: "Critical", complaints: 147, category: "Sanitation", lat: 12.9166, lng: 77.6101, trend: "+23%" },
  { id: 2, name: "Whitefield", risk: "High", complaints: 98, category: "Water Supply", lat: 12.9698, lng: 77.7499, trend: "+12%" },
  { id: 3, name: "Koramangala", risk: "High", complaints: 87, category: "Infrastructure", lat: 12.9352, lng: 77.6245, trend: "+8%" },
  { id: 4, name: "Indiranagar", risk: "Medium", complaints: 63, category: "Electricity", lat: 12.9784, lng: 77.6408, trend: "-5%" },
  { id: 5, name: "HSR Layout", risk: "Medium", complaints: 54, category: "Sanitation", lat: 12.9116, lng: 77.6474, trend: "+3%" },
  { id: 6, name: "Electronic City", risk: "Medium", complaints: 48, category: "Electricity", lat: 12.8399, lng: 77.6770, trend: "-12%" },
  { id: 7, name: "Jayanagar", risk: "Low", complaints: 32, category: "Infrastructure", lat: 12.9299, lng: 77.5933, trend: "-8%" },
  { id: 8, name: "Basavanagudi", risk: "Low", complaints: 28, category: "Public Safety", lat: 12.9422, lng: 77.5738, trend: "-15%" },
  { id: 9, name: "Malleswaram", risk: "Low", complaints: 21, category: "Public Spaces", lat: 13.0035, lng: 77.5689, trend: "-3%" },
];

export const fallbackReportTemplates = [
  { id: 1, title: "Executive Summary Report", description: "High-level overview of all complaints and resolutions for Commissioner", type: "PDF", frequency: "Weekly", lastGenerated: "Jun 24, 2024", size: "2.3 MB", category: "executive" },
  { id: 2, title: "Department Performance Report", description: "Detailed department-wise resolution rates, SLA compliance, and trends", type: "XLSX", frequency: "Monthly", lastGenerated: "Jun 01, 2024", size: "4.7 MB", category: "department" },
  { id: 3, title: "AI Analysis Report", description: "AI model accuracy, duplicate detection stats, and prediction outcomes", type: "PDF", frequency: "Weekly", lastGenerated: "Jun 24, 2024", size: "1.8 MB", category: "ai" },
  { id: 4, title: "Critical Issues Report", description: "All Critical and High priority complaints with resolution status", type: "PDF", frequency: "Daily", lastGenerated: "Jun 27, 2024", size: "0.9 MB", category: "critical" },
  { id: 5, title: "Heatmap & Geographic Report", description: "Zone-wise complaint distribution with geographic visualizations", type: "PDF", frequency: "Weekly", lastGenerated: "Jun 24, 2024", size: "5.2 MB", category: "heatmap" },
  { id: 6, title: "Citizen Satisfaction Report", description: "Feedback analysis and satisfaction scores by area and department", type: "XLSX", frequency: "Monthly", lastGenerated: "Jun 01, 2024", size: "2.1 MB", category: "satisfaction" },
  { id: 7, title: "Infrastructure Damage Assessment", description: "Comprehensive breakdown of infrastructure-related complaints and estimated costs", type: "PDF", frequency: "Weekly", lastGenerated: "Jun 23, 2024", size: "3.4 MB", category: "department" },
  { id: 8, title: "Predictive Analytics Forecast", description: "AI-driven forecast of complaint surges for the upcoming week", type: "PDF", frequency: "Weekly", lastGenerated: "Jun 25, 2024", size: "1.5 MB", category: "ai" },
  { id: 9, title: "Daily Operations Digest", description: "Snapshot of all new, resolved, and escalated complaints within the last 24 hours", type: "PDF", frequency: "Daily", lastGenerated: "Today", size: "0.5 MB", category: "executive" },
  { id: 10, title: "Sanitation Compliance Log", description: "Detailed logging of sanitation and waste management compliance across zones", type: "XLSX", frequency: "Weekly", lastGenerated: "Jun 22, 2024", size: "1.2 MB", category: "department" },
  { id: 11, title: "Emergency Incidents Overview", description: "Summary of complaints flagged as life-threatening or severe emergencies", type: "PDF", frequency: "Daily", lastGenerated: "Today", size: "0.7 MB", category: "critical" },
  { id: 12, title: "Zone Congestion Heatmap Data", description: "Raw dataset of geographical complaint coordinates and intensity weights", type: "CSV", frequency: "Monthly", lastGenerated: "Jun 01, 2024", size: "8.1 MB", category: "heatmap" },
];

export const fallbackWeeklyStats = {
  newComplaints: 287,
  resolved: 312,
  escalated: 23,
  avgResolutionTime: "3.4 days",
  topCategory: "Infrastructure",
  topArea: "BTM Layout",
  aiAccuracy: "94.2%",
  duplicatesMerged: 47,
};
