import { db } from "../../lib/db";
import { getSession } from "../../lib/session";
import { redirect } from "next/navigation";
import { updateProfile } from "./actions";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch current user data to pre-fill the form
  const user = await db.user.findUnique({
    where: { id: session.userId }
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Business Profile</h1>
        <p className="text-slate-500 mt-2">Manage your agency details and GST information for invoicing.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agency Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agency Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Agency Name</label>
                <Input 
                  name="agencyName" 
                  defaultValue={user.agencyName || ""} 
                  placeholder="e.g. Acme Travels" 
                  required 
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Business Email</label>
                <Input 
                  name="email" 
                  type="email" 
                  defaultValue={user.email || ""} 
                  placeholder="admin@acmetravels.com" 
                  required 
                />
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">GST Number</label>
                <Input 
                  name="gstNumber" 
                  defaultValue={user.gstNumber || ""} 
                  placeholder="22AAAAA0000A1Z5" 
                  maxLength={15}
                  className="uppercase"
                />
                <p className="text-xs text-slate-400">Required for B2B tax invoices.</p>
              </div>

              {/* Registered Phone (Read-Only) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Registered Phone</label>
                <Input 
                  value={user.phone} 
                  disabled 
                  className="bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Billing Address</label>
              <Input 
                name="address" 
                defaultValue={user.address || ""} 
                placeholder="123 Business Park, City, State, PIN" 
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 px-8">
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}