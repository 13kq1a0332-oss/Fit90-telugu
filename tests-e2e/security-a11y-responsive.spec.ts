import { test, expect } from "@playwright/test";

test.describe("Fit90 Phase 7 — Accessibility, Responsiveness & Error Recovery", () => {
  test.beforeEach(async ({ page }) => {
    // Populate session storage to bypass onboarding for protected view checks
    await page.addInitScript(() => {
      localStorage.setItem("fit90_onboarded", "true");
      localStorage.setItem(
        "fit90_profile",
        JSON.stringify({
          fullName: "Srinivas Rao",
          locale: "te",
          age: 31,
          gender: "male",
          heightCm: 176,
          weightKg: 118,
          waistCm: 150,
          targetWeightKg: 112,
          targetDays: 90,
          activityLevel: "sedentary",
          dailyCaloriesMin: 2000,
          dailyCaloriesMax: 2200,
          dailyProteinMin: 100,
          dailyProteinMax: 120,
        })
      );
    });
  });

  test("Mobile Viewport (375px iPhone SE) has zero horizontal scroll overflow on all core routes", async ({
    page,
  }) => {
    // Set viewport to smallest target mobile width: 375px
    await page.setViewportSize({ width: 375, height: 667 });

    const routes = ["/dashboard", "/diet", "/workouts", "/health", "/insights", "/profile"];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(
        hasHorizontalScroll,
        `Page ${route} should not have horizontal scroll overflow on 375px viewport`
      ).toBe(false);
    }
  });

  test("Bottom navigation bar provides accessible touch targets (>= 44x44px) on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");

    const bottomNav = page.locator("nav.fixed.bottom-0");
    await expect(bottomNav).toBeVisible();

    // Check all navigation tab touch target dimensions
    const navButtons = bottomNav.locator("a");
    const count = await navButtons.count();
    expect(count).toBeGreaterThanOrEqual(5);

    for (let i = 0; i < count; i++) {
      const button = navButtons.nth(i);
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        // Height and width should satisfy minimum touch targets
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("Language toggle seamlessly updates document and UI text between Telugu and English", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Look for language toggle button
    const langBtn = page.locator('button:has-text("EN"), button:has-text("తెలుగు")').first();
    await expect(langBtn).toBeVisible();

    // Switch to English
    if (await page.locator('button:has-text("EN")').first().isVisible()) {
      await page.locator('button:has-text("EN")').first().click();
      await expect(page.locator("body")).toContainText("Dashboard");
    }

    // Switch to Telugu
    const teBtn = page.locator('button:has-text("తెలుగు")').first();
    if (await teBtn.isVisible()) {
      await teBtn.click();
      await expect(page.locator("body")).toContainText("డాష్‌బోర్డ్");
    }
  });

  test("Custom 404 page renders gracefully with recovery navigation buttons", async ({
    page,
  }) => {
    await page.goto("/non-existent-route-for-qa-test-12345");

    await expect(page.locator("h1")).toContainText("పేజీ కనుగొనబడలేదు");
    await expect(page.locator("#notFoundDashboardBtn")).toBeVisible();
    await expect(page.locator("#notFoundHomeBtn")).toBeVisible();

    // Click dashboard button to recover
    await page.locator("#notFoundDashboardBtn").click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("Offline PWA fallback page renders informative message and reload action", async ({
    page,
  }) => {
    await page.goto("/offline");

    await expect(page.locator("h1")).toBeVisible();
    const refreshBtn = page.locator("button:has(svg.lucide-rotate-cw), button:has-text('ప్రయత్నించండి'), button:has-text('Refresh')").first();
    await expect(refreshBtn).toBeVisible();
  });

  test("Accessible headings and landmarks exist across all dashboard sections", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Semantic landmark checks
    const mainLandmark = page.locator("main");
    await expect(mainLandmark).toBeVisible();

    // Heading hierarchy check - wait for header to render
    await expect(page.locator("h1").first()).toBeVisible();
  });
});
