import { test, expect } from "@playwright/test";

test.describe("Fit90 Telugu - Phase 4 Workouts, 13-Week Walking & Knee Safety", () => {
  test("should load workouts dashboard with 4 tabs and knee-safe strength routine", async ({
    page,
  }) => {
    await page.goto("/workouts");

    // Page header
    await expect(page.locator("h1")).toBeVisible();

    // 4 Segmented tabs
    const tabButtons = page.locator("div.grid.grid-cols-4 button");
    await expect(tabButtons).toHaveCount(4);

    // Default tab is Today's Routine: verify knee safe badge & exercise list
    await expect(page.locator("body")).toContainText(/Knee-Safe|మోకాలికి రక్షణ/i);
    await expect(page.locator("body")).toContainText(/Chair Squats|కుర్చీ సాయంతో స్క్వాట్స్/i);
  });

  test("should trigger rest timer on completing set and allow knee alternative swap", async ({
    page,
  }) => {
    await page.goto("/workouts");

    // Click Set 1 on first exercise (Chair Squats)
    const set1Btn = page.getByRole("button", { name: /Set 1|సెట్ 1/i }).first();
    await set1Btn.click();

    // Verify Rest Timer modal opens
    await expect(page.locator("body")).toContainText(/Rest Timer|విశ్రాంతి టైమర్/i);

    // Click +30s Rest
    const add30Btn = page.getByRole("button", { name: /\+30s Rest|\+30 సెకన్లు/i });
    if (await add30Btn.isVisible()) {
      await add30Btn.click();
    }

    // Skip Rest
    const skipBtn = page.getByRole("button", { name: /Skip Rest|విశ్రాంతి దాటవేయి/i });
    await skipBtn.click();

    // Verify modal closed
    await expect(page.getByRole("button", { name: /Skip Rest|విశ్రాంతి దాటవేయి/i })).not.toBeVisible();

    // Click Knee Pain Alternative swap button
    const swapBtn = page.getByRole("button", { name: /Knee Pain Alternative|మోకాలి నొప్పి ప్రత్యామ్నాయం/i }).first();
    await swapBtn.click();

    // Verify Chair Squat swapped to Glute Bridges
    await expect(page.locator("body")).toContainText(/Glute Bridges|గ్లూట్ బ్రిడ్జెస్/i);
  });

  test("should navigate 13-week walking roadmap and log walking session with RPE and safety check", async ({
    page,
  }) => {
    await page.goto("/workouts");

    // Switch to 13-Week Walking tab (2nd tab)
    const walkingTab = page.locator("div.grid.grid-cols-4 button").nth(1);
    await walkingTab.click();

    // Verify Week 1 targets (20 mins, 4,500 steps)
    await expect(page.locator("body")).toContainText("20");
    await expect(page.locator("body")).toContainText("4,500");

    // Click Log Walk button
    const logWalkBtn = page.getByRole("button", { name: /Log Today's Walk|నేటి నడకను నమోదు చేయండి/i });
    await logWalkBtn.click();

    // Verify Session Logger modal is open
    await expect(page.locator("body")).toContainText(/Exertion|శ్రమ స్థాయి/i);

    // Check knee pain checkbox to verify joint safety alert appears
    const kneeCheckbox = page.locator("#kneePainCheckbox");
    await kneeCheckbox.check();

    // Verify joint safety advice renders
    await expect(page.locator("body")).toContainText(/Joint Safety Notice|కీళ్ల భద్రతా సూచన/i);

    // Uncheck and submit session
    await kneeCheckbox.uncheck();
    const submitBtn = page.locator("#sessionLoggerSubmitBtn");
    await submitBtn.click();

    // Switch to Workout History tab (4th tab)
    const historyTab = page.locator("div.grid.grid-cols-4 button").nth(3);
    await historyTab.click();

    // Verify session shows in history
    await expect(page.locator("body")).toContainText(/RPE 5\/10/i);
  });

  test("should adjust weekly schedule frequency and select active days", async ({ page }) => {
    await page.goto("/workouts");

    // Click Adjust Schedule button
    const adjustBtn = page.getByRole("button", { name: /Adjust Schedule|షెడ్యూల్ మార్చండి/i });
    await adjustBtn.click();

    // Modal opens
    await expect(page.locator("body")).toContainText(/Customize Weekly|వారపు వ్యాయామ/i);

    // Select 4 days
    const fourDaysBtn = page.getByRole("button", { name: /4 Days|4 రోజులు/i });
    await fourDaysBtn.click();

    // Save schedule
    const saveBtn = page.getByRole("button", { name: /Save Changes|సేవ్ చేయండి/i });
    await saveBtn.click();
  });
});
