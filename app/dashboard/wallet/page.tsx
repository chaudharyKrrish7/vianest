import { getSession } from "../../lib/session";
import { db } from "../../lib/db";
import { redirect } from "next/navigation";

export default async function WalletPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { walletBalance: true, agencyName: true } 
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#FAFAFA] bg-dot-grid py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl animate-[fadeIn_0.5s_ease-out_forwards]">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">My Wallet</h1>
          <p className="mt-2 text-zinc-500 font-medium">Manage your B2B funds and submit recharge requests.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Premium Balance Card */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-3xl p-8 shadow-lg relative overflow-hidden h-full flex flex-col justify-between min-h-[250px]">
              {/* Abstract decorative glowing blobs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-zinc-800 rounded-full blur-2xl -ml-8 -mb-8"></div>
              
              <div className="relative z-10">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Available Balance</p>
                <h2 className="text-4xl font-black text-white tracking-tighter">
                  ₹{user?.walletBalance?.toString() || "0.00"}
                </h2>
              </div>

              <div className="relative z-10 mt-12">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Agent Profile</p>
                <p className="text-white font-semibold tracking-wide">
                  {user?.agencyName?.toUpperCase() || "VIANEST AGENT"}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Recharge Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 mb-6">Recharge Wallet</h3>
              
              <div className="mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
                <p className="text-sm text-zinc-600 font-medium">
                  Transfer funds via NEFT/RTGS or UPI to the Vianest bank account, then submit your <span className="font-bold text-zinc-900">UTR / Reference Number</span> below for admin approval.
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Amount Input */}
                  <div className="p-3 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all group">
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1 group-focus-within:text-zinc-600">Amount Sent (₹)</label>
                    <input 
                      type="number" 
                      placeholder="10000"
                      className="w-full bg-transparent text-xl font-bold text-zinc-900 outline-none placeholder:text-zinc-300"
                      required
                    />
                  </div>

                  {/* UTR Input */}
                  <div className="p-3 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all group">
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1 group-focus-within:text-zinc-600">UTR / Ref Number</label>
                    <input 
                      type="text" 
                      placeholder="SBIN000..."
                      className="w-full bg-transparent text-xl font-bold text-zinc-900 outline-none placeholder:text-zinc-300 uppercase"
                      required
                    />
                  </div>
                  
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button type="button" className="px-8 py-3.5 bg-zinc-900 text-white rounded-full text-sm font-bold tracking-wide hover:bg-zinc-800 transition-all shadow-md active:scale-95">
                    Submit Request →
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Ledger / Activity */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
           <h3 className="text-lg font-bold tracking-tight text-zinc-900 mb-6">Recent Activity</h3>
           
           <div className="text-center py-16 border-2 border-dashed border-zinc-200/80 rounded-2xl bg-zinc-50/50">
             <div className="text-4xl mb-3">🧾</div>
             <p className="text-zinc-900 font-bold tracking-tight">No recent transactions</p>
             <p className="text-sm text-zinc-500 mt-1">Your wallet activity and recharges will appear here.</p>
           </div>
        </div>

      </div>
    </div>
  );
}