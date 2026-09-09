import Link from "next/link";
import { getSession } from "../lib/session";
import { db } from "../lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // <-- Add this
import NavLinks from "./NavLinks";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { walletBalance: true }
  });

  // 1. Define the Server Action
  async function handleLogout() {
    "use server";
    // Add "await" and wrap cookies() in parentheses
    (await cookies()).delete("vianest_session");
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tighter text-zinc-900">
                Via<span className="text-zinc-400">nest</span>
              </span>
            </Link>

            {/* Replaced standard nav with our dynamic Client Component */}
            <NavLinks />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/wallet" className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-1.5 hover:border-zinc-300 transition-all shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Wallet</span>
              <span className="text-sm font-bold text-zinc-800">₹{user?.walletBalance?.toString() || "0.00"}</span>
            </Link>
            
            {/* 2. Attach the Server Action to the form */}
            <form action={handleLogout}>
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

      <main className="print:p-0 print:m-0">
        {children}
      </main>
      
    </div>
  );
}