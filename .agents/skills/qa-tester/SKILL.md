---
name: qa-tester
description: Automated & manual end-to-end QA testing harness for web applications, user journey validations, multi-user session isolation, clinical compliance boundaries, and regression testing.
---

# QA Tester: Quality Assurance & Feature Verification Guide

Use this skill to audit, verify, and regression-test web applications across all critical layers: Authentication, Data Privacy & Session Isolation, Clinical Safeguards, Offline-First PWA capabilities, and Mobile Responsiveness.

---

## 1. Automated Verification Commands

Run these automated verification commands in sequence to guarantee zero regressions:

1. **TypeScript Type Integrity:**
   ```bash
   npm run typecheck
   ```
   *Expected: Zero type errors, strict null checks passing.*

2. **Full Unit & Calculation Regression Test Suite:**
   ```bash
   npm test
   ```
   *Expected: 100% test files passing across all health formulas, RLS policies, error boundaries, and localization.*

3. **Production Webpack Bundle & SSG/SSR Build:**
   ```bash
   npm run build
   ```
   *Expected: Clean static page generation (20/20 routes) with zero build-time lint or hook violations.*

---

## 2. Multi-User Session Isolation & State Purity Checklist

A common flaw in client-side applications is leaking state between User A and User B. Ensure:

- [ ] **Clean Logout Purge:** Logout must not only clear server cookies, but must actively purge client-side storage (`fit90_user_profile`, `fit90_user_goals`, `fit90_current_user`, `fit90_food_logs`).
- [ ] **Supabase Scoped Queries:** Database fetches must query by authenticated `user.id`. Never serve a cached user profile from `localStorage` if an active Supabase user is logged in.
- [ ] **RLS Enforcement:** Verify that queries across all tables (`profiles`, `goals`, `food_logs`, `biometrics`, `lab_records`) enforce `auth.uid() = user_id`.

---

## 3. Clinical & Safety Boundary Testing

For clinical/health applications:
- [ ] **Hypertension Crisis Check:** Logging Systolic $\ge 180$ or Diastolic $\ge 120$ must trigger an immediate red alert and surface direct links to emergency services (108 / 112).
- [ ] **South Asian BMI Cutoffs:** Overweight must trigger at BMI $\ge 23$ (not Western 25), and Obese at $\ge 27.5$ (ICMR 2020 guidelines).
- [ ] **Non-Diagnostic Disclaimers:** Every page must visibly state that the tool is for lifestyle tracking and does not replace medical advice.

---

## 4. Mobile & PWA Verification

- [ ] Touch targets $\ge 44 \times 44$ px on mobile displays.
- [ ] Zero horizontal scroll at 375px viewport width.
- [ ] Telugu typography line-height $\ge 1.65$ to prevent diacritic conjunct clipping.
- [ ] Offline caching via Service Worker.

