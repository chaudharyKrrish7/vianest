import { revalidatePath } from "next/cache";
import { db } from "../../lib/db";

// REAL Server Action to fund an agent's wallet
async function fundWallet(formData: FormData) {
  "use server";
  const agentId = formData.get("agentId") as string;
  const amount = Number(formData.get("amount"));
  const referenceId = formData.get("referenceId") as string;
  
  if (!agentId || !amount) return;

  const agent = await db.user.findUnique({ where: { id: agentId } });
  if (!agent) return;

  const newBalance = Number(agent.walletBalance) + amount;

  // 1. Log the transaction
  await db.walletTransaction.create({
    data: {
      agentId,
      type: "CREDIT",
      amount,
      runningBalance: newBalance,
      referenceId,
      description: "Admin Wallet Recharge (UTR)"
    }
  });

  // 2. Update agent balance
  await db.user.update({
    where: { id: agentId },
    data: { walletBalance: newBalance }
  });

  revalidatePath("/admin/ledger");
  revalidatePath("/admin");
}

export default async function AdminLedgerPage() {
  // DYNAMIC DATA: Fetch Agents for the dropdown, and recent transactions for the ledger
  const agents = await db.user.findMany({ where: { role: "AGENT", status: "ACTIVE" } });
  const transactions = await db.walletTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { agent: { select: { agencyName: true } } }
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#FAFAFA] bg-dot-grid py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-[fadeIn_0.5s_ease-out_forwards]">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">Ledger & Funding</h1>
          <p className="mt-2 text-zinc-500 font-medium">Manually credit agent wallets and view transaction history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Fund Wallet Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 mb-6">Credit Wallet</h3>
              
              <form action={fundWallet} className="space-y-4">
                <div className="p-3 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Select Agent</label>
                  <select name="agentId" required className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-none">
                    <option value="">-- Choose Agent --</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.agencyName || a.phone}</option>
                    ))}
                  </select>
                </div>
                
                <div className="p-3 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Amount (₹)</label>
                  <input type="number" name="amount" required placeholder="50000" className="w-full bg-transparent text-lg font-bold text-zinc-900 outline-none" />
                </div>

                <div className="p-3 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Bank UTR / Ref</label>
                  <input type="text" name="referenceId" required placeholder="SBIN..." className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-none uppercase" />
                </div>

                <button type="submit" className="w-full py-3.5 mt-2 bg-zinc-900 text-white rounded-full text-sm font-bold tracking-wide hover:bg-zinc-800 transition-all shadow-md">
                  Confirm Credit
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 mb-6">Recent Transactions</h3>
              
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-zinc-500 font-medium text-center py-10">No transactions yet.</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-zinc-200 transition-all">
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{tx.agent.agencyName || "Agent"}</p>
                        <p className="text-xs text-zinc-500 font-medium mt-0.5">{tx.description} • Ref: {tx.referenceId}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg tracking-tight ${tx.type === "CREDIT" ? "text-green-600" : "text-zinc-900"}`}>
                          {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount.toString()}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">
                          Bal: ₹{tx.runningBalance.toString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}