import { test, expect } from "@playwright/test";

test.describe("Fit90 Telugu - Landing & Mobile PWA Shell", () => {
  test("should display home page with Telugu title and disclaimer banner", async ({ page }) => {
    await page.goto("/");

    // Verify main brand heading
    await expect(page.locator("h1")).toContainText("90");

    // Verify disclaimer short notice
    const disclaimer = page.locator("aside");
    await expect(disclaimer).toBeVisible();

    // Verify Call to Action buttons
    const signupBtn = page.getByRole("button", { name: /ఖాతా సృష్టించండి|Create Account/i });
    await expect(signupBtn).toBeVisible();
  });

  test("should toggle language from Telugu to English smoothly", async ({ page }) => {
    await page.goto("/");

    // Find the English switch button
    const enButton = page.getByRole("button", { name: "EN" });
    await enButton.click();

    // Verify English text appears
    await expect(page.locator("h1")).toContainText("Sustainable Weight Loss");

    // Switch back to Telugu
    const teButton = page.getByRole("button", { name: "తెలుగు" });
    await teButton.click();
    await expect(page.locator("h1")).toContainText("స్థిరమైన బరువు నిర్వహణ");
  });
});

