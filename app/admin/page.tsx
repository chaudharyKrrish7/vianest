import Link from "next/link";
import { db } from "../lib/db";

export default async function AdminDashboard() {
  // DYNAMIC DATA
  const agentsCount = await db.user.count({ where: { role: "AGENT" } });

  // Sum up all completed bookings (grossAmount)
  const revenueAgg = await db.booking.aggregate({
    _sum: { grossAmount: true },
    where: { status: "CONFIRMED" } // Update this if your status string is different
  });
  const totalRevenue = revenueAgg._sum.grossAmount || 0;

  // Get recent ledger activity
  const recentActivity = await db.walletTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { agent: { select: { agencyName: true } } }
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#FAFAFA] bg-dot-grid py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-[fadeIn_0.5s_ease-out_forwards]">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">Control Center</h1>
          <p className="mt-2 text-zinc-500 font-medium">System overview and real-time ledger activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Gross Revenue</p>
            <p className="text-3xl font-black text-zinc-900 tracking-tighter">₹{Number(totalRevenue).toLocaleString()}</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total B2B Agents</p>
            <p className="text-3xl font-black text-zinc-900 tracking-tighter">{agentsCount}</p>
          </div>
          
          <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest mb-1">Ledger Actions</p>
                <p className="text-lg font-bold text-white tracking-tight mt-1">Manage Agent Funds</p>
              </div>
              <Link href="/admin/ledger" className="inline-block mt-4 text-xs font-bold text-white hover:text-zinc-300 transition-colors">
                Open Ledger →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold tracking-tight text-zinc-900">Recent Platform Activity</h3>
            <Link href="/admin/ledger" className="text-sm font-bold text-zinc-500 hover:text-zinc-900">View Ledger</Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-zinc-500 font-medium text-center py-6">No recent activity.</p>
            ) : (
              recentActivity.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-zinc-200 transition-all gap-4">
                  <div>
                    <p className="font-bold text-zinc-900 text-sm">{tx.agent.agencyName || "Agent"}</p>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">{tx.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black tracking-tight ${tx.type === "CREDIT" ? "text-green-600" : "text-zinc-900"}`}>
                      {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount.toString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}