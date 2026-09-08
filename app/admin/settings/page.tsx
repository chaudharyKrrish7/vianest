import { db } from "../../lib/db";
import { updateMarkup } from "./actions";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default async function SettingsPage() {
  // Fetch the current settings, default to 300 if it's the first time
  const settings = await db.platformSettings.findUnique({ where: { id: "global" } });
  const currentMarkup = settings ? Number(settings.flightMarkup) : 300;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 mt-2">Manage global configurations and profit margins.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateMarkup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Global Flight Markup (₹)
              </label>
              <div className="flex items-center space-x-4">
                <Input 
                  name="flightMarkup" 
                  type="number" 
                  defaultValue={currentMarkup} 
                  required 
                  className="max-w-[200px] text-lg font-bold"
                />
                <span className="text-sm text-slate-500">
                  This flat fee is automatically added to the net fare of every booking.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}