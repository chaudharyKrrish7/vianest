"use client";

import { logoutUser } from "./actions";

export default function PendingHeader() {
  return (
    <div className="w-full bg-white p-4 flex justify-end shadow-sm border-b">
      <button 
        onClick={() => logoutUser()} 
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium text-sm"
      >
        Log Out
      </button>
    </div>
  );
}