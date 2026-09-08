import { db } from "../../lib/db";
import { getSession } from "../../lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function BookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const bookings = await db.booking.findMany({
    where: { agentId: session.userId },
    include: { passengers: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-dot-grid w-full px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-5xl animate-[fadeIn_0.5s_ease-out_forwards]">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">My Bookings</h1>
          <p className="mt-2 text-zinc-500 font-medium">Manage your confirmed flights and invoices.</p>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="p-12 text-center bg-white/50 backdrop-blur-sm border border-zinc-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <p className="text-zinc-500 font-medium">You haven't booked any flights yet.</p>
              <Link href="/dashboard" className="inline-block mt-4 text-sm font-bold text-zinc-900 hover:underline">
                Start a search →
              </Link>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-zinc-300/80">
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Confirmed</span>
                    <span className="text-sm font-semibold text-zinc-400">PNR: <span className="text-zinc-800">{booking.tripjackPnr}</span></span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{booking.passengers[0]?.firstName} {booking.passengers[0]?.lastName}</h3>
                  <p className="text-sm text-zinc-500 mt-1">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Gross Total</p>
                    <p className="text-xl font-bold text-zinc-900">₹{booking.grossAmount.toString()}</p>
                  </div>
                  
                  <Link 
                    href={`/dashboard/bookings/${booking.id}/invoice`}
                    className="px-6 py-3 bg-zinc-900 text-white rounded-full text-sm font-bold tracking-wide hover:bg-zinc-800 transition-all text-center"
                  >
                    View Invoice
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