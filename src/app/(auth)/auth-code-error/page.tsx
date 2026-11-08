import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        ధృవీకరణ లింక్ చెల్లదు / Authentication Link Expired
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        The sign-in or confirmation link has expired or has already been used. Please request a new link or try signing in with your email and password.
      </p>
      <Link href="/login">
        <Button variant="primary">తిరిగి లాగిన్‌కు / Return to Login</Button>
      </Link>
    </div>
  );
}

