import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";

export default function PendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-amber-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-amber-600">
            Verification Pending
          </CardTitle>
          <CardDescription className="text-slate-500">
            Welcome to Vianest! 
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-slate-700 space-y-4">
          <p>
            Your agent profile has been successfully created. Our administration team is currently reviewing your GST and business details.
          </p>
          <p className="text-sm font-medium text-slate-900 bg-amber-50 p-3 rounded-md border border-amber-100">
            You will be granted access to B2B flight fares once approved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}