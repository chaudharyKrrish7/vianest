import Link from "next/link";
import { getSession } from "../lib/session";
import { db } from "../lib/db";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { walletBalance: true }
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* 1. TOP NAVIGATION ONLY */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tighter text-zinc-900">
                Via<span className="text-zinc-400">nest</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                Search Flights
              </Link>
              <Link href="/dashboard/bookings" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                My Bookings
              </Link>
            </nav>
          </div>
          
          <Link href="/dashboard/wallet" className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-1.5 hover:border-zinc-300 transition-all shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Wallet</span>
            <span className="text-sm font-bold text-zinc-800">₹{user?.walletBalance?.toString() || "0.00"}</span>
          </Link>
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            

            {/* Sign Out Action */}
            
            <form action="/api/auth/logout" method="GET">
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-600 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
        
      </header>

      {/* 2. PAGE CONTENT SLOTS IN HERE */}
      <main className="print:p-0 print:m-0">
        {children}
      </main>
      
    </div>
  );
}