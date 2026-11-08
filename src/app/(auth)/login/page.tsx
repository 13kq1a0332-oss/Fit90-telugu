import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login - Fit90 Telugu",
  description: "Sign in to your Fit90 Telugu health journey",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Suspense fallback={<div className="text-center py-8">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

