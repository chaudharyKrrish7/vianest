import { getSession } from "../../lib/session";
import { db } from "../../lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Server action to update global markup
async function updateSettings(formData: FormData) {
  "use server";
  const flightMarkup = Number(formData.get("flightMarkup"));
  
  await db.platformSettings.upsert({
    where: { id: "global" },
    update: { flightMarkup },
    create: { id: "global", flightMarkup }
  });
  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const admin = await db.user.findUnique({ where: { id: session.userId } });
  if (!admin) redirect("/login");

  // Fetch your global markup settings
  const settings = await db.platformSettings.findUnique({ where: { id: "global" } });

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#FAFAFA] bg-dot-grid py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl animate-[fadeIn_0.5s_ease-out_forwards]">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">Platform Settings</h1>
          <p className="mt-2 text-zinc-500 font-medium">Manage B2B markups and admin profiles.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-8">
            {/* Global Settings linked to DB */}
            <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 mb-6">Financial & Markups</h3>
              <form action={updateSettings} className="space-y-4">
                <div className="p-4 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-zinc-900">Global Flight Markup (₹)</span>
                    <span className="text-xs text-zinc-500">Fixed amount per pax</span>
                  </label>
                  <input 
                    type="number" 
                    name="flightMarkup"
                    defaultValue={Number(settings?.flightMarkup || 300)} 
                    className="w-full bg-white border border-zinc-200 p-2 rounded-xl text-sm font-bold text-zinc-900 outline-none focus:border-zinc-400" 
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-zinc-900 text-white rounded-full text-xs font-bold tracking-wide hover:bg-zinc-800 transition-all shadow-md">
                  Save Markup Settings
                </button>
              </form>
            </div>
            
            {/* Admin Profile */}
            <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 mb-6">Admin Profile</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-3 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Agency / Name</label>
                  <input type="text" defaultValue={admin.agencyName || ""} disabled className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-none cursor-not-allowed" />
                </div>
                <div className="p-3 border border-zinc-200 rounded-2xl bg-zinc-50/50 opacity-70">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Email / Phone</label>
                  <input type="text" defaultValue={admin.email || admin.phone} disabled className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-none cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-tight text-white mb-6">Tripjack API Integration</h3>
              <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-white text-sm">Live Production Mode</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Awaiting verified credentials.</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Pending</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}