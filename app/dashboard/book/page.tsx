import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { processBooking } from "./actions"; 

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ flightId?: string; airline?: string; price?: string; from?: string; to?: string; date?: string; passengers?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;

  // If someone tries to visit /book directly without picking a flight, kick them back
  if (!params.flightId || !params.price) {
    redirect("/dashboard");
  }

  const passengerCount = parseInt(params.passengers || "1", 10);
  const basePrice = parseInt(params.price, 10);
  const totalNetFare = basePrice * passengerCount;

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#FAFAFA] bg-dot-grid py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-[fadeIn_0.5s_ease-out_forwards]">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">Complete Booking</h1>
          <p className="mt-2 text-zinc-500 font-medium">Enter passenger details to finalize this reservation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Passenger Form */}
          <div className="lg:col-span-8">
           <form action={processBooking} className="space-y-6">
              
              {/* Changed from flightId to flightNo to match your backend schema */}
              <input type="hidden" name="flightNo" value={params.flightId} />
              <input type="hidden" name="airline" value={params.airline} />
              <input type="hidden" name="price" value={basePrice.toString()} />
              <input type="hidden" name="pnr" value={`VNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`} />

              <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8">
                
                {Array.from({ length: passengerCount }).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">
                      Passenger {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-2 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all">
                        {/* Passes 'firstName' for the first passenger to satisfy backend */}
                        <input 
                          name={index === 0 ? "firstName" : `firstName_${index}`} 
                          type="text" 
                          placeholder="First Name" 
                          required 
                          className="w-full bg-transparent p-2 text-sm font-bold text-zinc-900 outline-none"
                        />
                      </div>
                      <div className="p-2 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all">
                        {/* Passes 'lastName' for the first passenger to satisfy backend */}
                        <input 
                          name={index === 0 ? "lastName" : `lastName_${index}`} 
                          type="text" 
                          placeholder="Last Name" 
                          required 
                          className="w-full bg-transparent p-2 text-sm font-bold text-zinc-900 outline-none"
                        />
                      </div>
                      <div className="p-2 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all">
                        <select 
                          name={`gender_${index}`} 
                          required
                          className="w-full bg-transparent p-2 text-sm font-bold text-zinc-500 outline-none cursor-pointer"
                        >
                          <option value="">Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="px-12 py-4 bg-zinc-900 text-white rounded-full font-bold tracking-wide hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                >
                  Confirm & Pay →
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Flight Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
              
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 mb-6">Flight Summary</h3>
              
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
                <div>
                  <p className="text-2xl font-black text-zinc-900">{params.from}</p>
                  <p className="text-xs font-bold text-zinc-400 uppercase">{params.date}</p>
                </div>
                <div className="text-zinc-300">✈</div>
                <div className="text-right">
                  <p className="text-2xl font-black text-zinc-900">{params.to}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase">{params.airline}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm font-medium">
                <div className="flex justify-between text-zinc-500">
                  <span>Base Fare ({passengerCount}x)</span>
                  <span className="text-zinc-900">₹{totalNetFare}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Taxes & Fees</span>
                  <span className="text-green-600">Included</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 border-dashed flex justify-between items-end">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Net Payable</span>
                <span className="text-3xl font-black tracking-tighter text-zinc-900">₹{totalNetFare}</span>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-center">
                <p className="text-xs font-bold text-blue-600">
                  Amount will be deducted from B2B Wallet.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}