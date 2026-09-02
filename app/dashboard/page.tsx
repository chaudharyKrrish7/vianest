import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function AgentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-slate-500 mt-2">Ready to book some flights today?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹0</div>
            <p className="text-xs text-slate-500 mt-1">Contact Super Admin to recharge</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Tickets Booked (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
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