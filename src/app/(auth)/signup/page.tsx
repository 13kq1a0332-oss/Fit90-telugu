import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up - Fit90 Telugu",
  description: "Start your 90-day health transformation in Telugu & English",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}

