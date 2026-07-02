import Sidebar from "@/components/layout/Sidebar";
import Navbar  from "@/components/layout/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
