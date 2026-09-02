import { db } from "../../lib/db";
import { getSession } from "../../lib/session";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export default async function WalletPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // 1. Fetch user balance
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { walletBalance: true }
  });

  if (!user) redirect("/login");

  // 2. Fetch the agent's transaction history, newest first
  const transactions = await db.walletTransaction.findMany({
    where: { agentId: session.userId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Wallet</h1>
        <p className="text-slate-500 mt-2">View your available balance and transaction history.</p>
      </div>

      {/* Hero Balance Card */}
      <Card className="bg-blue-950 text-white border-blue-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-200">Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">₹{user.walletBalance.toString()}</div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
              No transactions found.
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-right">Running Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {txn.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          txn.type === "CREDIT" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount.toString()}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        ₹{txn.runningBalance.toString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}