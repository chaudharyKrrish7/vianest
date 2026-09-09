import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNavLinks from "./AdminNavLinks";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  
  // 1. Server Action for Admin Logout
  async function handleLogout() {
    "use server";
    (await cookies()).delete("vianest_session");
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          
          <div className="flex items-center gap-10">
            {/* Logo with Admin Badge */}
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tighter text-zinc-900">
                Via<span className="text-zinc-400">nest</span>
              </span>
              <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                Admin
              </span>
            </Link>

            <AdminNavLinks />
          </div>

          {/* Logout */}
          <div className="flex items-center gap-4">
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

      {/* PAGE CONTENT SLOTS IN HERE */}
      <main className="print:p-0 print:m-0">
        {children}
      </main>
      
    </div>
  );
}