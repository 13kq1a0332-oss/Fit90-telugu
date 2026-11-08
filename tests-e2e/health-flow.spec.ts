import { test, expect } from "@playwright/test";

test.describe("Fit90 Telugu - Phase 5 Health & Biometrics Tracking", () => {
  test("should load health dashboard with 4 tabs and biometrics overview", async ({
    page,
  }) => {
    await page.goto("/health");

    // Page title and subtitle
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("body")).toContainText(/Health & Biometrics|ఆరోగ్యం & శారీరక కొలతలు/i);

    // 4 Navigation tabs
    await expect(page.locator("#health-tab-overview")).toBeVisible();
    await expect(page.locator("#health-tab-trends")).toBeVisible();
    await expect(page.locator("#health-tab-labs")).toBeVisible();
    await expect(page.locator("#health-tab-reminders")).toBeVisible();

    // Biometrics overview cards
    await expect(page.locator("body")).toContainText(/Current Weight|శరీర బరువు/i);
    await expect(page.locator("body")).toContainText(/Waist Circumference|నడుము కొలత/i);
    await expect(page.locator("body")).toContainText(/Blood Pressure|రక్తపోటు/i);

    // Asian Indian cutoff advisory
    await expect(page.locator("body")).toContainText(/90/i);
  });

  test("should log blood pressure and display stage classification & emergency alert for crisis", async ({
    page,
  }) => {
    await page.goto("/health");

    // Open BP modal
    const logBpBtn = page.locator("#openBpModalBtn");
    await logBpBtn.click();

    // Verify modal is open
    await expect(page.locator("body")).toContainText(/Log Blood Pressure|రక్తపోటు \(BP\) నమోదు/i);

    // Fill in Stage 1 reading: 135 / 85 mmHg
    const systolicInput = page.locator("#systolicInput");
    await systolicInput.fill("135");

    const diastolicInput = page.locator("#diastolicInput");
    await diastolicInput.fill("85");

    const pulseInput = page.locator("#pulseInput");
    await pulseInput.fill("76");

    // Submit
    const submitBtn = page.locator("#submitBpBtn");
    await submitBtn.click();

    // Verify modal closed and value is displayed
    await expect(page.locator("[data-testid='latest-bp-val']")).toContainText("135/85");

    // Now test Hypertensive Crisis alert
    await logBpBtn.click();
    await systolicInput.fill("190");
    await diastolicInput.fill("115");
    await submitBtn.click();

    // Verify Emergency Alert is rendered
    await expect(page.locator("body")).toContainText(/EMERGENCY ALERT|అత్యవసర హెచ్చరిక/i);
  });

  test("should track water hydration and sleep with snoring question", async ({
    page,
  }) => {
    await page.goto("/health");

    // Add +250ml glass
    const addGlassBtn = page.locator("#addWaterGlassBtn");
    await addGlassBtn.click();

    // Hydration progress should reflect intake
    await expect(page.locator("body")).toContainText("250");

    // Add +500ml bottle
    const addBottleBtn = page.locator("#addWaterBottleBtn");
    await addBottleBtn.click();
    await expect(page.locator("body")).toContainText("750");

    // Toggle snoring question in sleep section
    const snoringCheckbox = page.locator("#snoringCheck");
    await snoringCheckbox.click();

    // Sleep apnea notice appears
    await expect(page.locator("body")).toContainText(/sleep apnea|స్లీప్ అప్నియా/i);

    // Save sleep log
    const saveSleepBtn = page.locator("#saveSleepBtn");
    await saveSleepBtn.click();
    await expect(page.locator("body")).toContainText(/saved|సేవ్ చేయబడింది|Sleep Logged/i);
  });

  test("should display trends & charts tab with trajectory and Asian Indian cutoff", async ({
    page,
  }) => {
    await page.goto("/health");

    // Click tab 2: Trends & Charts
    await page.locator("#health-tab-trends").click();

    // Verify charts container is visible
    await expect(page.locator("body")).toContainText(/Weight Loss Trajectory|బరువు తగ్గుదల పథం/i);
    await expect(page.locator("body")).toContainText(/Waist Circumference Trend|నడుము కొలత పురోగతి/i);
    await expect(page.locator("body")).toContainText(/90 cm|90 సెం.మీ/i);
  });

  test("should display private lab records with non-diagnostic disclaimer and load QA sample labs", async ({
    page,
  }) => {
    await page.goto("/health");

    // Click tab 3: Private Lab Records
    await page.locator("#health-tab-labs").click();

    // Mandatory Non-Diagnostic Medical Disclaimer
    await expect(page.locator("body")).toContainText(/Non-Diagnostic|వైద్య నిర్ధారణ రహిత నిరాకరణ/i);

    // 1-Click Load Sample Test Profile Labs button
    const loadSampleBtn = page.locator("#loadSampleLabsBtn");
    await loadSampleBtn.click();

    // Verify sample records are loaded
    await expect(page.locator("body")).toContainText(/hs-CRP/i);
    await expect(page.locator("body")).toContainText("12.25");
    await expect(page.locator("body")).toContainText(/HDL/i);
    await expect(page.locator("body")).toContainText("24.1");
    await expect(page.locator("body")).toContainText(/Vitamin D/i);
    await expect(page.locator("body")).toContainText("13.2");
    await expect(page.locator("body")).toContainText(/Triglycerides/i);
    await expect(page.locator("body")).toContainText("260");

    // Verify private PDF badge
    await expect(page.locator("body")).toContainText(/Private PDF/i);
  });

  test("should manage daily health reminders and adjust schedule times", async ({
    page,
  }) => {
    await page.goto("/health");

    // Click tab 4: Daily Reminders
    await page.locator("#health-tab-reminders").click();

    // Header and defaults
    await expect(page.locator("body")).toContainText(/Daily Health Reminders|దినచర్య ఆరోగ్య రిమైండర్లు/i);
    await expect(page.locator("body")).toContainText(/Morning Weight|బరువు/i);
    await expect(page.locator("body")).toContainText(/Hydration|నీరు/i);
    await expect(page.locator("body")).toContainText(/Walk|నడక/i);
    await expect(page.locator("body")).toContainText(/Sleep|నిద్ర/i);

    // Toggle a reminder switch
    const toggleFirst = page.locator('[data-testid^="toggle-reminder-"]').first();
    await toggleFirst.click();

    // Edit time on first reminder
    const timeInputFirst = page.locator('[data-testid^="reminder-time-input-"]').first();
    await timeInputFirst.fill("06:45");

    // Add custom reminder
    const openAddBtn = page.locator("#openAddReminderBtn");
    await openAddBtn.click();

    await page.locator('input[placeholder*="water"]').fill("Green tea break");
    await page.locator('input[type="time"]').last().fill("16:00");
    await page.locator("#submitCustomReminderBtn").click();

    await expect(page.locator("body")).toContainText("Green tea break");
  });
});
