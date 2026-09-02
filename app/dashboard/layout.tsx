"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Agent Sidebar */}
      <aside className="w-64 bg-blue-950 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-xl text-white border-b border-blue-900">
          Vianest Agent
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/dashboard" className="block px-4 py-2 rounded-md bg-blue-900 text-white font-medium">
            Dashboard
          </a>
          <a href="/dashboard/search" className="block px-4 py-2 rounded-md hover:bg-blue-900 hover:text-white transition-colors">
            Search Flights
          </a>
          <a href="/dashboard/wallet" className="block px-4 py-2 rounded-md hover:bg-blue-900 hover:text-white transition-colors">
            My Wallet
          </a>
          <a href="/dashboard/bookings" className="block px-4 py-2 rounded-md hover:bg-blue-900 hover:text-white transition-colors">
            My Bookings
          </a>
        </nav>
        <div className="p-4 border-t border-blue-900">
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-blue-900" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-800">Agent Portal</h2>
          <div className="flex items-center space-x-4">
             {/* We will make this dynamic later */}
            <span className="text-sm font-bold text-green-600 bg-green-50 px-4 py-1 rounded-full border border-green-200">
              Wallet: ₹0
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}