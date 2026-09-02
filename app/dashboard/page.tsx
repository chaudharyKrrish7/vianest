import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { db } from "../lib/db";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";

export default async function AgentDashboard() {
  // 1. Get the securely decoded session
  const session = await getSession();
  if (!session) redirect("/login");

  // 2. Fetch the live user data from the database
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { walletBalance: true, phone: true }
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-slate-500 mt-2">Agent ID: {user.phone}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Convert the Decimal object to a string for React */}
            <div className="text-3xl font-bold text-slate-900">₹{user.walletBalance.toString()}</div>
            <p className="text-xs text-slate-500 mt-1">Ready for bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Tickets Booked</CardTitle>
          </CardHeader>
          <CardContent>
            {/* We will make this dynamic when we build the booking engine */}
            <div className="text-3xl font-bold text-slate-900">0</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Quick Action</CardTitle>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/search" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 mt-2 w-full transition-colors">
              Search Flights Now
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}