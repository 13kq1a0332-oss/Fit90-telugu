import { test, expect } from "@playwright/test";

test.describe("Fit90 Telugu - Phase 6 Insights, Trends & Guarded AI Coach", () => {
  test("should load weekly insights dashboard with 4 tabs and progress summary digest", async ({
    page,
  }) => {
    await page.goto("/insights");

    // Page header
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("body")).toContainText(
      /Weekly Insights & Trends|వారపు పురోగతి & అంతర్దృష్టులు/i
    );

    // 4 Segmented navigation tabs
    await expect(page.locator("#insights-tab-summary")).toBeVisible();
    await expect(page.locator("#insights-tab-trends")).toBeVisible();
    await expect(page.locator("#insights-tab-coach")).toBeVisible();
    await expect(page.locator("#insights-tab-notifications")).toBeVisible();

    // Default tab is Weekly Summary: 6 Core Metrics Grid
    await expect(page.locator("body")).toContainText(/Calories|కేలరీలు/i);
    await expect(page.locator("body")).toContainText(/Protein|ప్రోటీన్/i);
    await expect(page.locator("body")).toContainText(/Steps|అడుగులు/i);
    await expect(page.locator("body")).toContainText(/117.2/i);
    await expect(page.locator("body")).toContainText(/148.5/i);

    // Clinical notices
    await expect(page.locator("body")).toContainText(/0.4 - 0.8|0.4 నుండి 0.8/i);
    await expect(page.locator("body")).toContainText(/visceral|విసెరల్/i);

    // Adherence Wins Section
    await expect(page.locator("body")).toContainText(
      /Adherence Wins|సాధించిన విజయాలు/i
    );

    // Share Digest button click
    const shareBtn = page.locator("#shareWeeklyDigestBtn");
    await shareBtn.click();
    await expect(page.locator("body")).toContainText(
      /Copied to Clipboard|కాపీ చేయబడింది/i
    );
  });

  test("should display trend correlations and 7-day rolling moving average chart", async ({
    page,
  }) => {
    await page.goto("/insights");

    // Click Tab 2: Trends
    await page.locator("#insights-tab-trends").click();

    // Rolling moving average explanation
    await expect(page.locator("body")).toContainText(
      /7-Day Rolling|7-రోజుల రోలింగ్/i
    );
    await expect(page.locator("body")).toContainText(
      /water retention, sodium|నీరు, ఉప్పు/i
    );

    // Multi-metric correlations
    await expect(page.locator("body")).toContainText(
      /Blood Pressure Correlation|రక్తపోటు సంబంధం/i
    );
    await expect(page.locator("body")).toContainText(
      /Hydration Compliance|నీటి పరిమాణం/i
    );
  });

  test("should enforce AI consent gate, formulate lifestyle advice, and deflect medical emergencies", async ({
    page,
  }) => {
    await page.goto("/insights");

    // Click Tab 3: AI Lifestyle Coach
    await page.locator("#insights-tab-coach").click();

    // Verify Consent Gate is active initially
    await expect(page.locator("body")).toContainText(
      /AI Coaching Consent|AI కోచింగ్ సమ్మతి/i
    );
    await expect(page.locator("body")).toContainText(
      /Non-Diagnostic|వైద్య నిర్ధారణ రహిత/i
    );

    // Grant Consent
    const grantBtn = page.locator("#grantAiConsentBtn");
    await grantBtn.click();

    // Verify AI interface activated
    await expect(page.locator("body")).toContainText(
      /AI Enabled|AI యాక్టివ్‌గా ఉంది/i
    );

    // Click suggested prompt chip: South Indian dinner swaps
    await page.locator('[data-testid="prompt-chip-2"]').click();

    // Verify formulated advice contains South Indian staples
    await expect(page.locator("#coachMessagesThread")).toContainText(
      /Pesarattu|పెసరట్లు|Pappu|పప్పు/i
    );

    // Test Acute Medical Emergency Deflection
    const askInput = page.locator("#askCoachInput");
    await askInput.fill("I have sudden chest pain and severe shortness of breath");

    const sendBtn = page.locator("#sendCoachQuestionBtn");
    await sendBtn.click();

    // Verify Emergency Red-Flag Warning Deflection
    await expect(page.locator("#coachMessagesThread")).toContainText(
      /CRITICAL MEDICAL ALERT|అత్యవసర వైద్య హెచ్చరిక/i
    );
    await expect(page.locator("#coachMessagesThread")).toContainText(
      /108|112/
    );
  });

  test("should manage notification preferences, toggle channels, and set quiet hours", async ({
    page,
  }) => {
    await page.goto("/insights");

    // Click Tab 4: Notifications
    await page.locator("#insights-tab-notifications").click();

    // Verify channels
    await expect(page.locator("body")).toContainText(
      /Push|పుష్/i
    );
    await expect(page.locator("body")).toContainText(
      /Weekly Sunday Progress Email|ఆదివారం వారపు పురోగతి ఈమెయిల్/i
    );
    await expect(page.locator("body")).toContainText(
      /Quiet Hours|నిశ్శబ్ద వేళలు/i
    );

    // Toggle push notification switch
    const togglePushBtn = page.locator("#togglePushNotificationsBtn");
    await togglePushBtn.click();

    // Adjust quiet hours
    const quietStart = page.locator("#quietStart");
    await quietStart.fill("23:30");

    // Save preferences
    const saveBtn = page.locator("#saveNotificationPreferencesBtn");
    await saveBtn.click();

    // Verify confirmation message
    await expect(page.locator("body")).toContainText(
      /saved successfully|విజయవంతంగా సేవ్/i
    );
  });
});
