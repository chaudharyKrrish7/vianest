import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { processBooking } from "./actions";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  const airline = params.airline || "Unknown Airline";
  const flightNo = params.flightNo || "XX-000";
  const origin = params.origin || "XXX";
  const destination = params.destination || "XXX";
  const price = params.price || "0";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
        <p className="text-slate-500 mt-2">Enter passenger details to confirm this booking.</p>
      </div>

      {/* Flight Summary Card */}
      <Card className="bg-slate-900 text-white border-slate-800">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{airline}</p>
              <h2 className="text-2xl font-bold mt-1">{origin} ➔ {destination}</h2>
              <p className="text-slate-300 mt-1">Flight: {flightNo}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Fare</p>
              <h2 className="text-3xl font-bold mt-1 text-green-400">₹{price}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passenger Form */}
      <Card>
        <CardHeader>
          <CardTitle>Passenger Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={processBooking} className="space-y-6">
            {/* Hidden fields to pass flight data to the server action */}
            <input type="hidden" name="flightNo" value={flightNo} />
            <input type="hidden" name="price" value={price} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <Input name="firstName" placeholder="e.g. Krish" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <Input name="lastName" placeholder="e.g. Chaudhary" required />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Confirm & Deduct ₹{price}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}