// ============================================================
// Nxt2Echo – AI Governance Platform: API Service Layer
// ============================================================
// Replace VITE_API_URL in your .env file with your backend URL.
// Example: VITE_API_URL=http://localhost:3000/api
// ============================================================

import { auth } from "../lib/firebase";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Core fetch wrapper — throws a structured error on non-2xx responses.
 * @param {string} path  - API path (e.g. "/complaints")
 * @param {RequestInit} [options] - Optional fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  let token = null;
  
  // Prefer real JWT stored from our backend auth
  const stored = localStorage.getItem('nxt2echo_user');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      token = parsed.token || null;
    } catch {}
  }
  
  // Fallback to Firebase mock token
  if (!token && auth?.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = `API Error: ${response.status} ${response.statusText} — ${url}`;
    throw new Error(message);
  }

  let json = await response.json();

  // Map backend complaint schema to frontend expectations
  if (url.includes("/complaints")) {
    const mapComplaint = (c) => {
      const mapCategoryToDept = {
        Infrastructure: "PWD", WaterSupply: "BWSSB", Sanitation: "BBMP",
        Electricity: "BESCOM", PublicSafety: "BBMP", Environment: "KSPCB",
        Drainage: "BBMP", Transport: "BMTC"
      };
      return {
        ...c,
        area: c.ward || c.area || "Unknown",
        priority: c.severity || c.priority || "Medium",
        aiScore: c.priorityScore || c.aiScore || 0,
        date: c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : c.date,
        department: c.department || mapCategoryToDept[c.category] || "BBMP"
      };
    };

    if (json.data && Array.isArray(json.data)) {
      json.data = json.data.map(mapComplaint);
    } else if (Array.isArray(json)) {
      json = json.map(mapComplaint);
    }
  }

  return json;
}

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────

/**
 * Fetches high-level dashboard statistics.
 * Expected shape: { totalComplaints, pendingComplaints, resolvedComplaints,
 *                   criticalIssues, aiConfidenceScore, avgResolutionDays,
 *                   duplicatesDetected, satisfactionRate }
 * @returns {Promise<Object>}
 */
export async function fetchDashboardStats() {
  const json = await apiFetch("/dashboard/stats");
  const data = json.data || {};
  
  // Map backend's 'total' and 'byStatus' to frontend keys, adding a 12,000 historical offset 
  // as requested to represent past complaint history.
  const mappedStats = {
    totalComplaints: (data.total || 0) + 12000,
    pendingComplaints: (data.byStatus?.Pending || 0) + 1400,
    resolvedComplaints: (data.byStatus?.Resolved || 0) + 9500,
    criticalIssues: (data.byStatus?.Critical || 0) + 300,
    aiConfidenceScore: 94.2, // Simulated historical metric
    avgResolutionDays: 3.7, // Simulated historical metric
    duplicatesDetected: 312,
    satisfactionRate: 87.4,
  };
  
  return { data: mappedStats };
}

/**
 * Fetches monthly complaint trend data for the past 12 months.
 * Expected shape: Array<{ month: string, complaints: number, resolved: number }>
 * @returns {Promise<Array>}
 */
export async function fetchComplaintTrend() {
  // TODO: Connect to GET /analytics/complaint-trend
  return apiFetch("/analytics/complaint-trend");
}

/**
 * Fetches complaint counts grouped by category.
 * Expected shape: Array<{ name: string, value: number, color: string }>
 * @returns {Promise<Array>}
 */
export async function fetchCategoryData() {
  // TODO: Connect to GET /analytics/categories
  return apiFetch("/analytics/categories");
}

/**
 * Fetches department-level resolution performance.
 * Expected shape: Array<{ name: string, total: number, resolved: number, rate: number, avgDays: number }>
 * @returns {Promise<Array>}
 */
export async function fetchDepartmentData() {
  // TODO: Connect to GET /analytics/departments
  return apiFetch("/analytics/departments");
}

/**
 * Fetches the most recent complaints for the dashboard widget.
 * Expected shape: Array<Complaint> (limit 8, sorted by date desc)
 * @returns {Promise<Array>}
 */
export async function fetchRecentComplaints() {
  // TODO: Connect to GET /complaints?limit=8&sort=-date
  return apiFetch("/complaints?limit=8&sort=-date");
}

/**
 * Fetches AI-generated insights / alerts.
 * Expected shape: Array<{ id, type, title, description, confidence, department,
 *                         priority, action, timestamp, icon }>
 * @returns {Promise<Array>}
 */
export async function fetchAIInsights() {
  // TODO: Connect to GET /ai/insights
  return apiFetch("/ai/insights");
}

/**
 * Fetches the live activity feed.
 * Expected shape: Array<{ id, action, actor, time, type }>
 * @returns {Promise<Array>}
 */
export async function fetchActivityFeed() {
  // TODO: Connect to GET /activity
  return apiFetch("/activity");
}

// ─────────────────────────────────────────────
// Complaints Management
// ─────────────────────────────────────────────

/**
 * Fetches the full complaints list with optional filtering and pagination.
 * @param {Object} params
 * @param {string} [params.search]
 * @param {string} [params.status]
 * @param {string} [params.priority]
 * @param {string} [params.category]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {string} [params.sort]
 * @param {string} [params.order] - "asc" | "desc"
 * @returns {Promise<{ data: Array, total: number, page: number, totalPages: number }>}
 */
export async function fetchComplaints(params = {}) {
  // TODO: Connect to GET /complaints
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status && params.status !== "All") query.set("status", params.status);
  if (params.priority && params.priority !== "All") query.set("priority", params.priority);
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.sort) query.set("sort", params.sort);
  if (params.order) query.set("order", params.order);
  return apiFetch(`/complaints?${query.toString()}`);
}

// ─────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────

/**
 * Fetches complaints enriched with sentiment and risk scores.
 * Expected shape: Array<{ id, title, sentiment, aiScore, risk, ...rest }>
 * @param {number} [limit=8]
 * @returns {Promise<Array>}
 */
export async function fetchSentimentComplaints(limit = 8) {
  // TODO: Connect to GET /analytics/sentiment?limit=8
  return apiFetch(`/analytics/sentiment?limit=${limit}`);
}

// ─────────────────────────────────────────────
// Heatmap
// ─────────────────────────────────────────────

/**
 * Fetches geographic heatmap zones.
 * Expected shape: Array<{ id, name, risk, complaints, category, lat, lng, trend }>
 * @returns {Promise<Array>}
 */
export async function fetchHeatmapZones() {
  // TODO: Connect to GET /heatmap/zones
  return apiFetch("/heatmap/zones");
}

// ─────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────

/**
 * Fetches available report templates.
 * Expected shape: Array<{ id, title, description, type, frequency, lastGenerated, size, category }>
 * @returns {Promise<Array>}
 */
export async function fetchReportTemplates() {
  // TODO: Connect to GET /reports
  return apiFetch("/reports");
}

/**
 * Fetches the weekly summary statistics for the reports page.
 * Expected shape: { newComplaints, resolved, escalated, avgResolutionTime,
 *                   topCategory, topArea, aiAccuracy, duplicatesMerged }
 * @returns {Promise<Object>}
 */
export async function fetchWeeklyStats() {
  // TODO: Connect to GET /reports/stats/weekly
  return apiFetch("/reports/stats/weekly");
}
