import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "DEL";
  const to = searchParams.get("to") || "BOM";
  const date = searchParams.get("date") || "2026-03-10";

  // Mock B2B Flight Inventory
  const mockFlights = [
    {
      id: "FL-6E-204",
      airline: "IndiGo",
      flightNo: "6E-204",
      origin: from,
      destination: to,
      departureTime: "06:00 AM",
      arrivalTime: "08:15 AM",
      duration: "2h 15m",
      basePrice: 4500.00,
      markupPrice: 4800.00, // B2B agent net price
    },
    {
      id: "FL-UK-942",
      airline: "Vistara",
      flightNo: "UK-942",
      origin: from,
      destination: to,
      departureTime: "10:30 AM",
      arrivalTime: "12:50 PM",
      duration: "2h 20m",
      basePrice: 5800.00,
      markupPrice: 6200.00,
    },
    {
      id: "FL-AI-401",
      airline: "Air India",
      flightNo: "AI-401",
      origin: from,
      destination: to,
      departureTime: "04:15 PM",
      arrivalTime: "06:40 PM",
      duration: "2h 25m",
      basePrice: 5200.00,
      markupPrice: 5500.00,
    },
  ];

  return NextResponse.json({ success: true, flights: mockFlights });
}