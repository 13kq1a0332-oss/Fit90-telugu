import { test, expect } from "@playwright/test";

test.describe("Authentication Forms Validation & Navigation", () => {
  test("should show validation errors when submitting empty login form", async ({ page }) => {
    await page.goto("/login");

    // Click submit without entering values
    const submitBtn = page.getByRole("button", { name: /లాగిన్ అవ్వండి|Sign In/i });
    await submitBtn.click();

    // Verify validation errors
    await expect(page.locator("p.text-red-600").first()).toBeVisible();
  });

  test("should show signup form with language selector and password validation", async ({ page }) => {
    await page.goto("/signup");

    const nameInput = page.locator("#fullName");
    await expect(nameInput).toBeVisible();

    const localeSelect = page.locator("#preferredLocale");
    await expect(localeSelect).toBeVisible();

    // Fill short password and mismatch
    await nameInput.fill("రమేష్");
    await page.locator("#email").fill("ramesh@fit90.test");
    await page.locator("#password").fill("short");
    await page.locator("#confirmPassword").fill("mismatch");

    const submitBtn = page.getByRole("button", { name: /ఖాతా సృష్టించండి|Create Account/i });
    await submitBtn.click();

    await expect(page.locator("p.text-red-600").first()).toBeVisible();
  });

  test("should navigate to forgot-password page and return back to login", async ({ page }) => {
    await page.goto("/login");

    const forgotLink = page.getByRole("link", { name: /పాస్‌వర్డ్ మర్చిపోయారా\?|Forgot password\?/i });
    await forgotLink.click();

    await expect(page).toHaveURL(/.*forgot-password/);

    const backLink = page.getByRole("link", { name: /తిరిగి లాగిన్‌కు|Back to Login/i });
    await backLink.click();

    await expect(page).toHaveURL(/.*login/);
  });
});

