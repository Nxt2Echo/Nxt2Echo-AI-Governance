import { useState, useEffect } from "react";
import {
  fetchReportTemplates,
  fetchWeeklyStats,
  fetchComplaintTrend,
  fetchDepartmentData,
} from "@/services/api";
import {
  fallbackReportTemplates,
  fallbackWeeklyStats,
  fallbackTrendData,
  fallbackDepartmentData,
} from "@/services/fallbackData";

/**
 * Aggregates all data needed by the Reports page.
 * Fires all requests in parallel.
 * Gracefully falls back to placeholder data if the backend API is unavailable.
 */
export function useReports() {
  const [reportTemplates, setReportTemplates] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [complaintTrendData, setComplaintTrendData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [templatesRes, statsRes, trendRes, deptRes] = await Promise.all([
          fetchReportTemplates().catch((err) => {
            console.warn("fetchReportTemplates failed, using fallback.", err);
            return fallbackReportTemplates;
          }),
          fetchWeeklyStats().catch((err) => {
            console.warn("fetchWeeklyStats failed, using fallback.", err);
            return fallbackWeeklyStats;
          }),
          fetchComplaintTrend().catch((err) => {
            console.warn("fetchComplaintTrend failed, using fallback.", err);
            return fallbackTrendData;
          }),
          fetchDepartmentData().catch((err) => {
            console.warn("fetchDepartmentData failed, using fallback.", err);
            return fallbackDepartmentData;
          }),
        ]);

        if (!cancelled) {
          setReportTemplates(templatesRes);
          setWeeklyStats(statsRes);
          setComplaintTrendData(trendRes);
          setDepartmentData(deptRes);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useReports]", err);
          setError(err.message || "Failed to load reports data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { reportTemplates, weeklyStats, complaintTrendData, departmentData, loading, error };
}
