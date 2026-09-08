"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-medium print:hidden hover:bg-slate-800 transition-colors shadow-sm"
    >
      Print / Save as PDF
    </button>
  );
}