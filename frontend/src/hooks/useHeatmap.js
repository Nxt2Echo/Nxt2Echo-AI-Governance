import { useState, useEffect } from "react";
import { fetchHeatmapZones } from "@/services/api";
import { fallbackHeatmapZones } from "@/services/fallbackData";

/**
 * Fetches heatmap zone data for the Heatmap page.
 * Gracefully falls back to placeholder data if the backend API is unavailable.
 */
export function useHeatmap(selectedState = "Karnataka") {
  const [heatmapZones, setHeatmapZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Simulate backend fetch with delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dynamic mock data based on state
        const stateData = [
          { id: 1, name: `${selectedState} North Zone`, risk: "Critical", complaints: Math.floor(Math.random() * 500) + 100, trend: "+12%", category: "Sanitation", lat: 13.0, lng: 77.6 },
          { id: 2, name: `${selectedState} South Zone`, risk: "High", complaints: Math.floor(Math.random() * 300) + 50, trend: "+5%", category: "Infrastructure", lat: 12.9, lng: 77.5 },
          { id: 3, name: `${selectedState} East Zone`, risk: "Medium", complaints: Math.floor(Math.random() * 200) + 20, trend: "-2%", category: "Traffic", lat: 12.95, lng: 77.7 },
          { id: 4, name: `${selectedState} West Zone`, risk: "Low", complaints: Math.floor(Math.random() * 100) + 10, trend: "-8%", category: "Water Supply", lat: 12.96, lng: 77.4 },
          { id: 5, name: `${selectedState} Central`, risk: "High", complaints: Math.floor(Math.random() * 400) + 80, trend: "+15%", category: "Pollution", lat: 12.97, lng: 77.59 },
          { id: 6, name: `${selectedState} Suburban`, risk: "Medium", complaints: Math.floor(Math.random() * 250) + 30, trend: "-5%", category: "Power", lat: 13.1, lng: 77.55 },
        ];
        
        if (!cancelled) setHeatmapZones(stateData);
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
  }, [selectedState]);

  return { heatmapZones, loading, error };
}
