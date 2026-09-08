"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function FlightSearchPage() {
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [flights, setFlights] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const res = await fetch(`/api/flights/search?from=${from}&to=${to}&date=${date}`);
      const data = await res.json();
      if (data.success) {
        setFlights(data.flights);
      } else {
        alert("Failed to fetch flights");
      }
    } catch (err) {
      console.error(err);
      alert("Search error occurred");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Search Flights</h1>
        <p className="text-slate-500 mt-2">Find live B2B fares for your customers.</p>
      </div>

      <Card className="border-blue-100 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-semibold text-slate-800">One Way Flight</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">From</label>
                <Input value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} required className="h-12 uppercase" maxLength={3} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">To</label>
                <Input value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} required className="h-12 uppercase" maxLength={3} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Travel Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="h-12" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Passengers</label>
                <Input type="number" min="1" max="9" value={passengers} onChange={(e) => setPassengers(e.target.value)} required className="h-12" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg w-full md:w-auto" disabled={isSearching}>
                {isSearching ? "Searching Airfares..." : "Search Flights"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Flight Results Grid */}
      <div className="space-y-4">
        {flights.length > 0 && <h2 className="text-xl font-bold text-slate-800">Available Flights ({flights.length})</h2>}
        {flights.map((flight) => (
          <Card key={flight.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-bold text-lg text-slate-900">{flight.airline}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">{flight.flightNo}</span>
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {flight.origin} ➔ {flight.destination} | {flight.departureTime} ({flight.duration})
              </div>
            </div>
            <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">₹{flight.markupPrice}</div>
                <div className="text-xs text-green-600 font-medium">B2B Agent Net Fare</div>
              </div>
              <a 
                href={`/dashboard/book?flightNo=${flight.flightNo}&airline=${flight.airline}&origin=${flight.origin}&destination=${flight.destination}&price=${flight.markupPrice}`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white h-10 px-4 py-2"
              >
                Book Now
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}