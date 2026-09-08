"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-xl text-white border-b border-slate-800">
          Vianest Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded-md bg-slate-800 text-white font-medium">
            Overview
          </a>
          <a href="/admin/agents" className="block px-4 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            Manage Agents
          </a>
          <a href="/admin/ledger" className="block px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
          Global Ledger
          </a>
          <a href="/admin/settings" className="block px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
          Platform Settings
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-800">Super Admin Portal</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Active Session</span>
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