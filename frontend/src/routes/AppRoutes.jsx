import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Dashboard from "../pages/Dashboard";
import Complaints from "../pages/Complaints";
import Analytics from "../pages/Analytics";
import Heatmap from "../pages/Heatmap";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import CitizenPortal from "../pages/CitizenPortal/index";
import CitizenTracking from "../pages/CitizenPortal/Tracking";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
};

export default function AppRoutes(){
  return(
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login/></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword/></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/complaints" element={<ProtectedRoute><Complaints/></ProtectedRoute>}/>
        <Route path="/analysis" element={<ProtectedRoute><Analytics /></ProtectedRoute>} /> 
        <Route path="/heatmap" element={<ProtectedRoute><Heatmap/></ProtectedRoute>}/>
        <Route path="/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>}/>
        <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
        
        {/* Citizen Routes */}
        <Route path="/citizen" element={<ProtectedRoute><CitizenPortal/></ProtectedRoute>} />
        <Route path="/citizen/tracking" element={<ProtectedRoute><CitizenTracking/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}