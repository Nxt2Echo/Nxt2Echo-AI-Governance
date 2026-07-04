import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — static on desktop, slide-in drawer on mobile */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* pb-20 on mobile to avoid content hidden behind bottom nav bar */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pb-20 lg:pb-8">
          {children}
        </main>

      </div>

      {/* Mobile bottom navigation bar */}
      <MobileBottomNav />

    </div>
  );
}