import { test, expect } from "@playwright/test";

test.describe("Fit90 Telugu - Phase 3 Diet, Food Catalog & Grocery List", () => {
  test("should load diet dashboard with tabs and default 90-day meal plan", async ({ page }) => {
    await page.goto("/diet");

    // Verify Diet Page Header
    await expect(page.locator("h1")).toBeVisible();

    // Verify 4 segmented tabs exist
    const tabButtons = page.locator("div.grid.grid-cols-4 button");
    await expect(tabButtons).toHaveCount(4);

    // Default tab is Daily Log: verify calorie and protein goals
    await expect(page.locator("body")).toContainText("kcal");
    await expect(page.locator("body")).toContainText(/protein|ప్రోటీన్/i);
  });

  test("should search food catalog in English and Telugu and open portion calculator", async ({
    page,
  }) => {
    await page.goto("/diet");

    // Click Food Catalog tab (3rd tab)
    const catalogTab = page.locator("div.grid.grid-cols-4 button").nth(2);
    await catalogTab.click();

    // Verify search input is present
    const searchInput = page.locator("input[type='search']");
    await expect(searchInput).toBeVisible();

    // Search for 'pesarattu'
    await searchInput.fill("pesarattu");
    await expect(page.locator("body")).toContainText("Pesarattu");

    // Clear search and search for Telugu keyword 'అన్నం'
    await searchInput.fill("అన్నం");
    await expect(page.locator("body")).toContainText("సోనా మసూరి");

    // Open Portion Calculator Modal for Sona Masoori Rice
    const calcBtn = page.getByRole("button", { name: /Portion Calculator|పరిమాణం లెక్కించండి/i }).first();
    await calcBtn.click();

    // Verify modal is open
    await expect(page.locator("body")).toContainText("100g");

    // Click to select 150g or change grams in #exactGrams
    const gramInput = page.locator("#exactGrams");
    await expect(gramInput).toBeVisible();
    await gramInput.fill("200");

    // Submit log
    const submitBtn = page.getByRole("button", { name: /Log to Food Diary|డైరీలో నమోదు చేయండి/i });
    await submitBtn.click();

    // Verify success toast or switch to daily log
    const dailyTab = page.locator("div.grid.grid-cols-4 button").nth(0);
    await dailyTab.click();

    // Verify logged food is reflected in daily log (200g Sona Masoori rice)
    await expect(page.locator("body")).toContainText("200g");
  });

  test("should explore 90-day meal plan, perform food substitution and view grocery budget", async ({
    page,
  }) => {
    await page.goto("/diet");

    // Click Meal Plan tab (2nd tab)
    const mealPlanTab = page.locator("div.grid.grid-cols-4 button").nth(1);
    await mealPlanTab.click();

    // Verify plan header displays target window (2000-2200 kcal)
    await expect(page.locator("body")).toContainText("2000");
    await expect(page.locator("body")).toContainText("2200");

    // Verify substitution dropdown exists
    const subDropdown = page.locator("select[aria-label='Substitute Food']").first();
    await expect(subDropdown).toBeVisible();

    // Swap item using dropdown
    const options = await subDropdown.locator("option").all();
    if (options.length > 1) {
      const secondOptionVal = await options[1].getAttribute("value");
      if (secondOptionVal) {
        await subDropdown.selectOption(secondOptionVal);
      }
    }

    // Switch to Grocery List tab (4th tab)
    const groceryTab = page.locator("div.grid.grid-cols-4 button").nth(3);
    await groceryTab.click();

    // Verify grocery budget card
    await expect(page.locator("body")).toContainText("₹");

    // Toggle 7 Days / 30 Days view
    const monthlyBtn = page.getByRole("button", { name: /30 Days|30 రోజులు/i });
    if (await monthlyBtn.isVisible()) {
      await monthlyBtn.click();
      await expect(page.locator("body")).toContainText("30 Days");
    }

    // Check off a grocery item
    const firstCheckbox = page.locator("button[aria-label*='bought']").first();
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.click();
    }

    // Click copy grocery list button
    const copyBtn = page.getByRole("button", { name: /Copy Grocery List|జాబితా కాపీ చేయండి/i });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
  });
});
