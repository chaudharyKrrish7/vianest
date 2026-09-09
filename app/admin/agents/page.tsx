import { db } from "../../lib/db";
import Link from "next/link";

export default async function AdminAgentsPage() {
  // DYNAMIC DATA: Fetching actual agents from your DB
  const agents = await db.user.findMany({
    where: { role: "AGENT" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#FAFAFA] bg-dot-grid py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-[fadeIn_0.5s_ease-out_forwards]">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">B2B Agents</h1>
            <p className="mt-2 text-zinc-500 font-medium">Manage your registered travel partners and view their live balances.</p>
          </div>
          <button className="px-6 py-3 bg-zinc-900 text-white rounded-full text-sm font-bold tracking-wide hover:bg-zinc-800 transition-all shadow-md">
            + Add New Agent
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white/50 backdrop-blur-sm border border-zinc-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <p className="text-zinc-500 font-medium">No agents found in the database.</p>
            </div>
          ) : (
            agents.map((agent) => (
              <div key={agent.id} className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-zinc-300/80 transition-all group">
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-black text-lg shadow-sm">
                    {agent.agencyName?.charAt(0) || "A"}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    agent.status === "ACTIVE" ? "bg-green-50 border-green-200 text-green-700" : 
                    agent.status === "SUSPENDED" ? "bg-red-50 border-red-200 text-red-700" : 
                    "bg-orange-50 border-orange-200 text-orange-700"
                  }`}>
                    {agent.status.replace("_", " ")}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 truncate">
                    {agent.agencyName || "Unnamed Agency"}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 truncate mt-0.5">
                    {agent.email || agent.phone}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Wallet Balance</p>
                    <p className="text-xl font-black text-zinc-900">₹{agent.walletBalance.toString()}</p>
                  </div>
                  <Link href={`/admin/agents/${agent.id}`} className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all">
                    →
                  </Link>
                </div>
                
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}