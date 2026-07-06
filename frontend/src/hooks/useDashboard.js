import { useState, useEffect } from "react";
import {
  fetchDashboardStats,
  fetchComplaintTrend,
  fetchCategoryData,
  fetchDepartmentData,
  fetchRecentComplaints,
  fetchAIInsights,
  fetchActivityFeed,
} from "@/services/api";
import {
  fallbackStats,
  fallbackTrendData,
  fallbackCategoryData,
  fallbackDepartmentData,
  fallbackComplaints,
  fallbackAIInsights,
  fallbackActivityFeed,
} from "@/services/fallbackData";

/**
 * Aggregates all data needed by the main Dashboard page.
 * Fires all requests in parallel; exposes a single `loading` and `error` state.
 * Gracefully falls back to placeholder data if the backend API is unavailable.
 */
export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [
          statsRes,
          trendRes,
          categoryRes,
          departmentRes,
          recentRes,
          insightsRes,
          activityRes,
        ] = await Promise.all([
          fetchDashboardStats().catch((err) => {
            console.warn("fetchDashboardStats failed, using fallback.", err);
            return fallbackStats;
          }),
          fetchComplaintTrend().catch((err) => {
            console.warn("fetchComplaintTrend failed, using fallback.", err);
            return fallbackTrendData;
          }),
          fetchCategoryData().catch((err) => {
            console.warn("fetchCategoryData failed, using fallback.", err);
            return fallbackCategoryData;
          }),
          fetchDepartmentData().catch((err) => {
            console.warn("fetchDepartmentData failed, using fallback.", err);
            return fallbackDepartmentData;
          }),
          fetchRecentComplaints().catch((err) => {
            console.warn("fetchRecentComplaints failed, using fallback.", err);
            return fallbackComplaints.slice(0, 8);
          }),
          fetchAIInsights().catch((err) => {
            console.warn("fetchAIInsights failed, using fallback.", err);
            return fallbackAIInsights;
          }),
          fetchActivityFeed().catch((err) => {
            console.warn("fetchActivityFeed failed, using fallback.", err);
            return fallbackActivityFeed;
          }),
        ]);

        if (!cancelled) {
          setStats(statsRes?.data || statsRes);
          setTrendData(trendRes?.data || trendRes);
          setCategoryData(categoryRes?.data || categoryRes);
          setDepartmentData(departmentRes?.data || departmentRes);
          setRecentComplaints(recentRes?.data || recentRes);
          setAiInsights(insightsRes?.data || insightsRes);
          setActivityFeed(activityRes?.data || activityRes);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useDashboard]", err);
          setError(err.message || "Failed to load dashboard data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return {
    stats,
    trendData,
    categoryData,
    departmentData,
    recentComplaints,
    aiInsights,
    activityFeed,
    loading,
    error,
  };
}
