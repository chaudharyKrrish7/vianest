import { db } from "../../../../lib/db";
import { getSession } from "../../../../lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent } from "../../../../components/ui/card";
import PrintButton from "./PrintButton";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const resolvedParams = await params;
  const bookingId = resolvedParams.id;

  // Fetch the booking, verifying it belongs to this specific agent
  const booking = await db.booking.findFirst({
    where: { 
      id: bookingId,
      agentId: session.userId 
    },
    include: { 
      passengers: true,
      agent: true 
    }
  });

  if (!booking) {
    return (
      <div className="p-12 text-center text-slate-500">
        Invoice not found or unauthorized.
      </div>
    );
  }

  const agent = booking.agent;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tax Invoice</h1>
        <PrintButton />
      </div>

      <Card className="bg-white border-slate-200">
        <CardContent className="p-8 space-y-8">
          
          {/* Header Section */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-8">
            <div>
              <h2 className="text-3xl font-black text-blue-600 tracking-tighter">VIANEST</h2>
              <p className="text-sm text-slate-500 mt-1">B2B Travel Solutions</p>
              <p className="text-sm text-slate-500">Gurugram, Haryana, India</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 uppercase">Invoice No: {booking.id}</p>
              <p className="text-sm text-slate-500">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-slate-500">PNR: <span className="font-bold text-slate-900">{booking.tripjackPnr}</span></p>
            </div>
          </div>

          {/* Billing Details Section */}
          <div className="grid grid-cols-2 gap-8 border-b border-slate-100 pb-8">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 mb-2">Billed To (Agent)</p>
              <h3 className="text-lg font-bold text-slate-900">{agent.agencyName || "Agent"}</h3>
              <p className="text-sm text-slate-600">{agent.address || "Address not provided"}</p>
              {agent.gstNumber && (
                <p className="text-sm text-slate-900 font-medium mt-2">GSTIN: {agent.gstNumber}</p>
              )}
            </div>
          </div>

          {/* Passenger & Flight Details */}
          <div>
            <p className="text-xs font-bold uppercase text-slate-400 mb-2">Passenger Manifest</p>
            <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
              <ul className="space-y-1">
                {booking.passengers.map((p, index) => (
                  <li key={p.id} className="text-sm font-medium text-slate-700">
                    {index + 1}. {p.firstName} {p.lastName} <span className="text-slate-400 font-normal">({p.type})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="py-2 px-4 font-semibold rounded-l-md">Description</th>
                  <th className="py-2 px-4 font-semibold text-right rounded-r-md">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 text-slate-700">Flight Net Fare</td>
                  <td className="py-3 px-4 text-right text-slate-700">₹{booking.netAmount.toString()}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-700">Platform Markup / Fees</td>
                  <td className="py-3 px-4 text-right text-slate-700">₹{booking.agentMarkup.toString()}</td>
                </tr>
                <tr className="font-bold text-lg bg-slate-50">
                  <td className="py-4 px-4 text-slate-900 rounded-l-md">Total Gross Amount</td>
                  <td className="py-4 px-4 text-right text-slate-900 rounded-r-md">₹{booking.grossAmount.toString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}