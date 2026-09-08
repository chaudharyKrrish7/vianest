import PendingHeader from "./PendingHeader";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Top Header with Logout Button */}
      <PendingHeader /> 

      {/* 2. Centered Verification Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white border border-yellow-400 rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          
          <h2 className="text-2xl font-bold text-orange-600 mb-2">
            Verification Pending
          </h2>
          
          <p className="text-slate-500 text-sm mb-6">
            Welcome to Vianest!
          </p>
          
          <p className="text-slate-700 mb-8 leading-relaxed">
            Your agent profile has been successfully created. Our administration team is currently reviewing your GST and business details.
          </p>
          
          <div className="bg-[#fff9e6] border border-yellow-200 rounded p-4">
            <p className="text-slate-800 text-sm font-medium">
              You will be granted access to B2B flight fares once approved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}