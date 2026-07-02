import { useState, useEffect } from "react";
import { fetchHeatmapZones } from "@/services/api";
import { fallbackHeatmapZones } from "@/services/fallbackData";

/**
 * Fetches heatmap zone data for the Heatmap page.
 * Gracefully falls back to placeholder data if the backend API is unavailable.
 */
export function useHeatmap() {
  const [heatmapZones, setHeatmapZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchHeatmapZones().catch((err) => {
          console.warn("fetchHeatmapZones failed, using fallback.", err);
          return fallbackHeatmapZones;
        });
        if (!cancelled) setHeatmapZones(res);
      } catch (err) {
        if (!cancelled) {
          console.error("[useHeatmap]", err);
          setError(err.message || "Failed to load heatmap data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { heatmapZones, loading, error };
}
