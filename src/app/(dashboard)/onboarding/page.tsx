import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata = {
  title: "Onboarding - Fit90 Telugu",
  description: "Set up your personal biometrics and 90-day targets",
};

export default function OnboardingPage() {
  return (
    <div className="py-4">
      <OnboardingWizard />
    </div>
  );
}

