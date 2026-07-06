import { useState, useEffect } from "react";
import { fetchAIInsights, fetchSentimentComplaints, fetchCategoryData } from "@/services/api";
import { fallbackAIInsights, fallbackComplaints, fallbackCategoryData } from "@/services/fallbackData";

/**
 * Aggregates all data needed by the Analytics / AI Analysis page.
 * Fires all requests in parallel.
 * Gracefully falls back to placeholder data if the backend API is unavailable.
 */
export function useAnalytics() {
  const [aiInsights, setAiInsights] = useState([]);
  const [sentimentComplaints, setSentimentComplaints] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [insightsRes, sentimentRes, categoryRes] = await Promise.all([
          fetchAIInsights().catch((err) => {
            console.warn("fetchAIInsights failed, using fallback.", err);
            return fallbackAIInsights;
          }),
          fetchSentimentComplaints(8).catch((err) => {
            console.warn("fetchSentimentComplaints failed, using fallback.", err);
            return fallbackComplaints.slice(0, 8).map((c) => ({
              id: c.id,
              title: c.title.slice(0, 30) + "…",
              sentiment: c.sentiment,
              score: c.aiScore,
              risk: c.risk,
            }));
          }),
          fetchCategoryData().catch((err) => {
            console.warn("fetchCategoryData failed, using fallback.", err);
            return fallbackCategoryData;
          }),
        ]);

        if (!cancelled) {
          setAiInsights(insightsRes);
          setSentimentComplaints(sentimentRes);
          setCategoryData(categoryRes);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useAnalytics]", err);
          setError(err.message || "Failed to load analytics data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { aiInsights, sentimentComplaints, categoryData, loading, error };
}
