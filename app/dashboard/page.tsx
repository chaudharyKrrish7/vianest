import Link from "next/link";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string; passengers?: string }>;
}) {
  // Extract query parameters from the URL
  const params = await searchParams;
  const from = params.from?.toUpperCase() || "";
  const to = params.to?.toUpperCase() || "";
  const date = params.date || "";
  const passengers = params.passengers || "1";

  // Check if a search has been executed
  const isSearching = Boolean(from && to);

  // Mock Flight Data (This will be replaced by Tripjack API later)
  const mockFlights = [
    { id: "VJ-808", airline: "IndiGo", depTime: "06:30 AM", arrTime: "08:45 AM", duration: "2h 15m", price: 4200 },
    { id: "UK-992", airline: "Vistara", depTime: "10:15 AM", arrTime: "12:30 PM", duration: "2h 15m", price: 5800 },
    { id: "AI-301", airline: "Air India", depTime: "02:00 PM", arrTime: "04:30 PM", duration: "2h 30m", price: 4500 },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#FAFAFA] bg-dot-grid flex flex-col items-center pt-12 lg:pt-16 pb-12">
      
      {/* 1. Hero Typography (Hides when searching to save space) */}
      {!isSearching && (
        <div className="text-center max-w-4xl px-6 mb-10 animate-[fadeIn_0.5s_ease-out_forwards]">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 leading-[1.1]">
            Explore the World <br className="hidden md:block" /> in Style.
          </h1>
          <p className="mt-6 text-lg text-zinc-500 font-medium tracking-tight">
            Experience world-class B2B flight booking and seamless service with Vianest.
          </p>
        </div>
      )}

      {/* 2. Floating Search Card */}
      <div className="w-full max-w-5xl px-4 animate-[fadeIn_0.8s_ease-out_forwards] z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          
          <div className="flex border-b border-zinc-100">
            <button className="flex-1 py-4 text-sm font-bold text-zinc-900 border-b-2 border-zinc-900 bg-white">
              ✈ Search Flights
            </button>
            <button className="flex-1 py-4 text-sm font-semibold text-zinc-400 hover:text-zinc-600 transition-colors">
              Manage Booking
            </button>
          </div>

          {/* Form Action points to "/dashboard" to reload the same page with data */}
          <form action="/dashboard" method="GET" className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-center">
              
              <div className="p-4 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all cursor-text group">
                <label htmlFor="from" className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1 cursor-pointer">From</label>
                <input 
                  id="from" name="from" type="text" placeholder="DEL" defaultValue={from} required
                  className="w-full bg-transparent text-xl font-bold text-zinc-900 placeholder:text-zinc-300 outline-none uppercase"
                />
              </div>

              <div className="p-4 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all cursor-text group">
                <label htmlFor="to" className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1 cursor-pointer">To</label>
                <input 
                  id="to" name="to" type="text" placeholder="BOM" defaultValue={to} required
                  className="w-full bg-transparent text-xl font-bold text-zinc-900 placeholder:text-zinc-300 outline-none uppercase"
                />
              </div>

              <div className="p-4 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all cursor-text group md:col-span-1">
                <label htmlFor="date" className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1 cursor-pointer">Departing</label>
                <input 
                  id="date" name="date" type="date" defaultValue={date} required
                  className="w-full bg-transparent text-lg font-bold text-zinc-900 outline-none cursor-pointer"
                />
              </div>

              <div className="p-4 border border-zinc-200 rounded-2xl bg-zinc-50/50 focus-within:border-zinc-400 focus-within:bg-white transition-all cursor-text group md:col-span-1">
                <label htmlFor="passengers" className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1 cursor-pointer">Passengers</label>
                <input 
                  id="passengers" name="passengers" type="number" min="1" max="9" defaultValue={passengers} required
                  className="w-full bg-transparent text-xl font-bold text-zinc-900 outline-none"
                />
              </div>

            </div>

            <div className="mt-8 flex justify-center md:justify-end">
              <button type="submit" className="w-full md:w-auto px-12 py-4 bg-zinc-900 text-white rounded-full font-bold tracking-wide hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md">
                Search Flights →
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* 3. Search Results Section (Only visible after clicking search) */}
      {isSearching && (
        <div className="w-full max-w-5xl px-4 mt-8 animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">
              Select Flight to {to}
            </h2>
            <span className="px-4 py-1.5 bg-zinc-200/50 text-zinc-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {date} • {passengers} Pax
            </span>
          </div>

          <div className="space-y-4">
            {mockFlights.map((flight) => (
              <div key={flight.id} className="bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-zinc-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                
                {/* Flight Route & Timing */}
                <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto">
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-black text-zinc-900 tracking-tighter">{flight.depTime}</p>
                    <p className="text-sm font-bold text-zinc-400 mt-1">{from}</p>
                  </div>
                  
                  <div className="flex flex-col items-center w-24 md:w-32">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{flight.duration}</p>
                    <div className="h-px w-full bg-zinc-200 my-2 relative">
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-zinc-300 text-lg">✈</span>
                    </div>
                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">{flight.airline}</p>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-2xl font-black text-zinc-900 tracking-tighter">{flight.arrTime}</p>
                    <p className="text-sm font-bold text-zinc-400 mt-1">{to}</p>
                  </div>
                </div>

                {/* Pricing & Booking */}
                
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 border-zinc-100 pt-6 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Net B2B Fare</p>
                    <p className="text-3xl font-black text-zinc-900 tracking-tighter">₹{flight.price}</p>
                  </div>
                  
                  {/* Now a functional Link passing data to the checkout page */}
                  <Link 
                    href={`/dashboard/book?flightId=${flight.id}&airline=${flight.airline}&price=${flight.price}&from=${from}&to=${to}&date=${date}&passengers=${passengers}`}
                    className="px-8 py-3.5 bg-zinc-900 text-white rounded-full text-sm font-bold tracking-wide hover:bg-zinc-800 transition-all shadow-md active:scale-95 text-center"
                  >
                    Book Now
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}