import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard   from "../pages/Dashboard";
import Complaints  from "../pages/Complaints";
import Analytics   from "../pages/Analytics";
import Heatmap     from "../pages/Heatmap";
import Reports     from "../pages/Reports";
import Settings    from "../pages/Settings";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Dashboard />}  />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/analysis"   element={<Analytics />}  />
        <Route path="/heatmap"    element={<Heatmap />}    />
        <Route path="/reports"    element={<Reports />}    />
        <Route path="/settings"   element={<Settings />}   />
      </Routes>
    </BrowserRouter>
  );
}
