import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Set New Password - Fit90 Telugu",
  description: "Update your Fit90 account password",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <ResetPasswordForm />
    </div>
  );
}

