import { db } from "../../lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { revalidatePath } from "next/cache";

export default async function ManageAgentsPage() {
  const agents = await db.user.findMany({
    where: { role: "AGENT" },
    orderBy: { createdAt: "desc" },
  });

  // Action 1: Approve Agent
  async function approveAgent(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    await db.user.update({ where: { id: userId }, data: { status: "ACTIVE" } });
    revalidatePath("/admin/agents");
  }

  // Action 2: Recharge Wallet
  async function rechargeWallet(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const amount = parseFloat(formData.get("amount") as string);

    if (!amount || amount <= 0) return;

    // 1. Fetch the user's current balance to calculate the running balance
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true }
    });

    if (!user) return;

    const currentBalance = Number(user.walletBalance);
    const newBalance = currentBalance + amount;

    // 2. Use a Prisma transaction with the correct WalletTransaction model
    await db.$transaction([
      db.walletTransaction.create({
        data: {
          agentId: userId,
          amount: amount,
          type: "CREDIT",
          description: "Manual recharge by Super Admin",
          runningBalance: newBalance,
        }
      }),
      db.user.update({
        where: { id: userId },
        data: { walletBalance: newBalance }
      })
    ]);

    revalidatePath("/admin/agents");
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Agents</h1>
        <p className="text-slate-500 mt-2">Approve agents and manage wallet balances.</p>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Agent Info */}
              <div>
                <p className="font-medium text-slate-900 text-lg">Phone: {agent.phone}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${agent.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {agent.status}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    WWallet: ₹{agent.walletBalance.toString()}
                  </span>
                </div>
              </div>

              {/* Functional Actions */}
              <div className="flex items-center space-x-3 w-full md:w-auto">
                {agent.status === "PENDING_VERIFICATION" ? (
                  <form action={approveAgent}>
                    <input type="hidden" name="userId" value={agent.id} />
                    <Button type="submit" className="bg-slate-900 text-white">Approve Agent</Button>
                  </form>
                ) : (
                  <form action={rechargeWallet} className="flex items-center space-x-2">
                    <input type="hidden" name="userId" value={agent.id} />
                    <Input 
                      type="number" 
                      name="amount" 
                      placeholder="Amount (₹)" 
                      className="w-32" 
                      required 
                      min="1"
                    />
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      Add Funds
                    </Button>
                  </form>
                )}
              </div>
              
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}