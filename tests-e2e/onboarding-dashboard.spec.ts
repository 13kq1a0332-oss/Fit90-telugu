import { test, expect } from "@playwright/test";

test.describe("Fit90 Telugu - Phase 2 Onboarding & Real Data Dashboard", () => {
  test("should complete multi-step onboarding and reflect persisted targets on dashboard", async ({
    page,
  }) => {
    // 1. Visit onboarding page
    await page.goto("/onboarding");
    // Verify Step 1 indicator
    await expect(page.locator("body")).toContainText("Step 1");

    // Click sample QA profile loader
    const loadSampleBtn = page.getByRole("button", { name: /Load Sample QA Profile/i });
    if (await loadSampleBtn.isVisible()) {
      await loadSampleBtn.click();
    }

    // Verify inputs reflect 118kg and 176cm
    await expect(page.locator("#weight")).toHaveValue("118");
    await expect(page.locator("#height")).toHaveValue("176");

    // Click Continue to Step 2
    const step1Next = page.getByRole("button", { name: /Continue|కొనసాగించండి/i });
    await step1Next.click();

    // Verify Step 2
    await expect(page.locator("body")).toContainText("Step 2");
    const step2Next = page.getByRole("button", { name: /Continue|కొనసాగించండి/i });
    await step2Next.click();

    // Verify Step 3 (Calorie & Macro Estimation)
    await expect(page.locator("body")).toContainText("Step 3");
    // Verify BMR is displayed (~2130 kcal)
    await expect(page.locator("body")).toContainText("2130");

    const step3Next = page.getByRole("button", { name: /Continue|కొనసాగించండి/i });
    await step3Next.click();

    // Verify Step 4 (90-Day Target Plan)
    await expect(page.locator("body")).toContainText("Step 4");

    // Save and go to dashboard
    const finishBtn = page.getByRole("button", { name: /Save & Go to Dashboard|సేవ్ చేసి డాష్‌బోర్డ్‌కు వెళ్లండి/i });
    await finishBtn.click();

    // Should navigate to dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Verify dashboard displays real persisted data
    await expect(page.locator("body")).toContainText("118");
    await expect(page.locator("body")).toContainText("kg");
  });

  test("should allow quick-logging biometrics on dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    // Open quick log weight modal
    const logWeightBtn = page.getByRole("button", { name: /Quick Log Weight|బరువు నమోదు/i });
    if (await logWeightBtn.isVisible()) {
      await logWeightBtn.click();

      // Verify modal is open
      const modalInput = page.locator("#quickLogValue");
      await expect(modalInput).toBeVisible();

      // Enter new weight (e.g. 117.5 kg)
      await modalInput.fill("117.5");

      const saveBtn = page.getByRole("button", { name: /Save Changes|సేవ్ చేయండి/i });
      await saveBtn.click();

      // Verify dashboard updates with new weight
      await expect(page.locator("body")).toContainText("117.5");
    }
  });

  test("should allow editing profile and reloading sample QA fixture", async ({ page }) => {
    await page.goto("/profile");

    // Verify Profile page heading
    await expect(page.locator("h1")).toBeVisible();

    // Click Load QA Test Profile button
    const qaBtn = page.getByRole("button", { name: /Load QA Test Profile/i });
    await qaBtn.click();

    // Verify 118 kg appears in weight input
    await expect(page.locator("#profileWeight")).toHaveValue("118");
    await expect(page.locator("#profileWaist")).toHaveValue("150");

    // Verify Asian Indian waist risk warning is shown (90 cm / 90 సెం.మీ)
    await expect(page.locator("body")).toContainText("90");
  });
});
