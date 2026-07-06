import DashboardLayout from "@/layouts/DashboardLayout";
import { useHeatmap } from "@/hooks/useHeatmap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  MapPin, AlertTriangle, AlertCircle, CheckCircle2,
  Thermometer, TrendingUp, TrendingDown, Map, Info, ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const riskConfig = {
  Critical: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", badge: "critical" },
  High: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", badge: "high" },
  Medium: { icon: Thermometer, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", badge: "medium" },
  Low: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", badge: "low" },
};

const stateCoordinates = {
  "Karnataka": [15.3173, 75.7139],
  "Maharashtra": [19.7515, 75.7139],
  "Delhi": [28.7041, 77.1025],
  "Tamil Nadu": [11.1271, 78.6569],
  "Gujarat": [22.2587, 71.1924],
  "Kerala": [10.8505, 76.2711]
};

// Component to dynamically update map center when state changes
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 6, { animate: true });
  }, [center, map]);
  return null;
}

export default function Heatmap() {
  const [selectedState, setSelectedState] = useState("Karnataka");
  const { heatmapZones, loading, error } = useHeatmap(selectedState);
  
  const center = stateCoordinates[selectedState] || [20.5937, 78.9629];

  const riskSummary = {
    Critical: heatmapZones.filter((z) => z.risk === "Critical"),
    High: heatmapZones.filter((z) => z.risk === "High"),
    Medium: heatmapZones.filter((z) => z.risk === "Medium"),
    Low: heatmapZones.filter((z) => z.risk === "Low"),
  };
  const totalComplaints = heatmapZones.reduce((a, b) => a + b.complaints, 0) || 1;

  const states = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Gujarat", "Kerala"];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Complaint Heatmap</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Geographic complaint distribution · {selectedState}, IN
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="appearance-none bg-card border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
            ⚠ Could not load heatmap data — {error}
          </div>
        )}

        {/* Risk Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-4 mb-2" />
                  <Skeleton className="h-8 w-8 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            Object.entries(riskSummary).map(([risk, zones]) => {
              const config = riskConfig[risk];
              const Icon = config.icon;
              const total = zones.reduce((a, b) => a + b.complaints, 0);
              return (
                <Card key={risk} className={`border ${config.border} ${config.bg}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={16} className={config.color} />
                      <Badge variant={config.badge} className="text-[10px]">{risk}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{zones.length}</p>
                    <p className="text-xs text-muted-foreground">zones · {total} complaints</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Interactive Map */}
        <Card className="border-border overflow-hidden">
          <div className="relative h-96 w-full z-0 bg-slate-900">
            <MapContainer 
              center={center} 
              zoom={6} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <MapUpdater center={center} />
              
              {!loading && heatmapZones.map((zone) => {
                const config = riskConfig[zone.risk] ?? riskConfig.Low;
                // Since the mock data in useHeatmap currently hardcodes Bengaluru coordinates,
                // we'll randomly scatter them around the state center just for visual effect.
                const offsetLat = center[0] + (Math.random() - 0.5) * 4;
                const offsetLng = center[1] + (Math.random() - 0.5) * 4;
                const zonePos = [offsetLat, offsetLng];
                
                const colors = {
                  Critical: "#ef4444",
                  High: "#f97316",
                  Medium: "#f59e0b",
                  Low: "#10b981"
                };

                return (
                  <CircleMarker 
                    key={zone.id} 
                    center={zonePos} 
                    radius={Math.max(10, zone.complaints / 20)}
                    pathOptions={{ 
                      fillColor: colors[zone.risk], 
                      color: colors[zone.risk], 
                      weight: 1, 
                      fillOpacity: 0.4 
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="text-xs">
                        <strong className="block text-sm mb-1">{zone.name}</strong>
                        <span className="text-muted-foreground block">Category: {zone.category}</span>
                        <span className="text-muted-foreground block">Complaints: {zone.complaints}</span>
                        <span className={`block font-semibold ${config.color} mt-1`}>Risk: {zone.risk}</span>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-[1000] bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Loading {selectedState} Data...</p>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-3 right-3 z-[1000] flex items-center gap-2 bg-card/90 border border-border rounded-lg px-3 py-1.5 shadow-lg backdrop-blur-md">
              {Object.entries(riskConfig).map(([risk, cfg]) => (
                <div key={risk} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.bg} border ${cfg.border}`} />
                  <span className="text-[9px] text-muted-foreground font-medium">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Zone Cards Grid */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Zone Analysis</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {heatmapZones.map((zone) => {
                const config = riskConfig[zone.risk] ?? riskConfig.Low;
                const Icon = config.icon;
                const isPositive = zone.trend.startsWith("-");
                const TrendIcon = isPositive ? TrendingDown : TrendingUp;
                const trendColor = isPositive ? "text-emerald-400" : "text-red-400";
                const pct = Math.round((zone.complaints / totalComplaints) * 100);

                return (
                  <Card
                    key={zone.id}
                    className={`border ${config.border} hover:${config.bg} transition-all duration-200 cursor-pointer`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                            <Icon size={14} className={config.color} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{zone.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin size={9} />
                              {zone.lat?.toFixed(3)}, {zone.lng?.toFixed(3)}
                            </div>
                          </div>
                        </div>
                        <Badge variant={config.badge} className="text-[10px]">{zone.risk}</Badge>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-foreground">{zone.complaints}</span>
                        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
                          <TrendIcon size={12} />
                          {zone.trend}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{zone.category}</span> · {pct}% of total
                      </p>
                      <Progress
                        value={pct}
                        max={25}
                        indicatorClassName={
                          zone.risk === "Critical" ? "bg-red-500" :
                          zone.risk === "High" ? "bg-orange-500" :
                          zone.risk === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                        }
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
