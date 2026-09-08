import { db } from "../../lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export default async function GlobalLedgerPage() {
  // Fetch every transaction across the entire platform, including the agent's details
  const transactions = await db.walletTransaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      agent: {
        select: { phone: true, agencyName: true }
      }
    }
  });

  // Calculate some quick platform statistics
  const totalCredits = transactions
    .filter(t => t.type === "CREDIT")
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalDebits = transactions
    .filter(t => t.type === "DEBIT")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Global Ledger</h1>
        <p className="text-slate-500 mt-2">Monitor all platform-wide financial transactions.</p>
      </div>

      {/* Platform Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900 text-white">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Money Loaded (Credits)</p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">+ ₹{totalCredits}</h2>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 text-white">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Flight Sales (Debits)</p>
            <h2 className="text-3xl font-bold mt-2 text-blue-400">- ₹{totalDebits}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Global Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Agent</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(txn.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {txn.agent.agencyName || "Agent"} <br/>
                        <span className="text-xs text-slate-400 font-normal">{txn.agent.phone}</span>
                      </td>
                      <td className="px-6 py-4">
                        {txn.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          txn.type === "CREDIT" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount.toString()}
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