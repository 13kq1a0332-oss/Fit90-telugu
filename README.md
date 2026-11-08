# Fit90 Telugu (ఫిట్90 తెలుగు) 🏋️‍♂️🥗
> **A Production-Quality, Mobile-First Weight-Loss Tracking Progressive Web App (PWA)**  
> *Bilingual in Telugu (`te`) & English (`en`) for sustainable Indian health management.*

---

## ⚠️ Clinical Non-Diagnostic & Safety Disclaimer

> **IMPORTANT**:
> Fit90 Telugu is an educational lifestyle tracking application designed to assist users in building consistent, sustainable nutrition, hydration, and movement habits.
> - **Not Medical Advice**: This application does not diagnose medical conditions, provide clinical disease risk scores, prescribe pharmaceutical medications, or replace direct consultation with a qualified healthcare professional.
> - **No Crash Diets**: Extreme calorie deficits (<1500 kcal for adult men), rapid weight loss promises, or severe dietary restrictions are strictly rejected.
> - **Emergency Protocol**: Acute symptoms (severe chest pain, radiating left arm pain, sudden dizziness, shortness of breath, or hypertensive crisis $>180/>120$ mmHg) trigger an immediate high-priority alert directing users to emergency medical services (**108** or **112** in India).
> - **Sample Profile Quarantine**: Any synthetic test profile (e.g., 31yo, 118 kg, 150 cm waist) exists strictly in isolated test fixtures (`src/lib/test-fixtures/sample-user.ts`) and is never used as a public default.

---

## 📱 Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS & Lucide Icons
- **Backend & Auth**: Supabase Auth, PostgreSQL 15, Row Level Security (RLS), Supabase Storage
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualization**: Recharts (7-day rolling moving averages, trajectory lines, Asian Indian cutoffs)
- **Date Handling**: `date-fns`
- **Testing**:
  - **Vitest**: 11 suites, 89 unit & integration tests
  - **Playwright**: 8 suites, 62 end-to-end browser tests (Desktop & Mobile viewports)
- **PWA**: Installable Web App Manifest, Service Worker (`sw.js`), Offline Fallback Route (`/offline`)
- **Hosting & Deployment**: Vercel ready (`vercel.json` security headers)

---

## 📂 Project Architecture

```
Fit Track/
├── public/                     # Static assets, icons, manifest, service worker (sw.js)
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/             # Login, Signup, Forgot Password, Reset Password
│   │   ├── (dashboard)/        # Protected routes: Dashboard, Diet, Workouts, Health, Insights, Profile
│   │   ├── auth/               # OAuth callbacks & signout handlers
│   │   ├── offline/            # Offline PWA fallback page
│   │   ├── error.tsx           # Global error boundary (bilingual)
│   │   ├── loading.tsx         # Global loading skeleton
│   │   ├── not-found.tsx       # 404 page (bilingual)
│   │   └── layout.tsx          # Root HTML, font setup & i18n provider
│   ├── components/             # Reusable UI domain components
│   │   ├── dashboard/          # Metric cards, quick-log modals, risk badges
│   │   ├── diet/               # Portion calculator, food log, 90-day meal plan, grocery list
│   │   ├── workout/            # Strength routine, 13-wk walking roadmap, audio rest timer, schedule
│   │   ├── health/             # BP classifier, hydration, sleep, charts, PDF lab document vault
│   │   ├── insights/           # Weekly digest, 7-day rolling moving average, AI coach, notifications
│   │   ├── layout/             # Top navigation, mobile bottom navigation, safety banners
│   │   └── ui/                 # Accessible button, card, modal, alert components
│   ├── lib/                    # Core engines & business logic
│   │   ├── ai/                 # Guardrailed AI lifestyle coach & medical red flag detector
│   │   ├── data/               # Authentic South Indian food catalog (23+ items) & workout catalog
│   │   ├── i18n/               # Bilingual engine with complete English & Telugu dictionaries
│   │   ├── storage/            # Private lab documents vault (PDF upload & download)
│   │   ├── supabase/           # Client, server, and middleware Supabase instances
│   │   ├── health-calculations.ts # Mifflin-St Jeor BMR/TDEE, Asian Indian BMI/Waist cutoffs
│   │   ├── diet-store.ts       # Nutrition aggregations, daily food log CRUD
│   │   ├── workout-store.ts    # Workout history, frequency scheduler
│   │   ├── health-store.ts     # BP, water, sleep, weight, waist, lab records, reminders
│   │   └── insights-store.ts   # 7-day weekly progress digest & rolling average math
│   └── test/                   # Vitest unit and integration test suites
├── supabase/
│   └── migrations/             # 20-table normalized SQL migration with strict RLS
├── tests-e2e/                  # Playwright E2E browser automation test specs
├── vercel.json                 # Vercel production headers (CSP, nosniff, frame-ancestors)
└── next.config.mjs             # Next.js production configuration & security headers
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+ (developed with Node v26)
- npm or pnpm
- Supabase project (URL and Anon key)

### 2. Installation
```bash
git clone <repository-url>
cd "Fit Track"
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-server-admin-only
```
> **Security Note**: Never expose `SUPABASE_SERVICE_ROLE_KEY` with a `NEXT_PUBLIC_` prefix. Client bundles only receive `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 4. Database Setup & Migrations
Execute the SQL migration in your Supabase SQL Editor:
- [`supabase/migrations/20261108000000_initial_schema.sql`](supabase/migrations/20261108000000_initial_schema.sql)

This provisions 20 normalized tables with Row Level Security, ownership policies, indexes, and triggers:
- `profiles`, `goals`, `food_items`, `meal_plans`, `meal_plan_entries`, `food_logs`, `exercises`, `workout_plans`, `workout_sessions`, `workout_exercise_logs`, `weight_logs`, `waist_logs`, `water_logs`, `step_logs`, `sleep_logs`, `blood_pressure_logs`, `lab_records`, `reminders`, `notification_preferences`, `audit_events`.

### 5. Running Locally
```bash
# Start development server
npm run dev

# Open in browser: http://localhost:3000
```

---

## 🧪 Testing & Verification

### Unit & Integration Tests (Vitest)
```bash
npm run test
```
- **11 Suites, 89 Tests Passed**
- Verifies: Mifflin-St Jeor BMR/TDEE, Asian Indian cutoffs, diet calorie & macro calculations, workout progression, blood pressure classification, 7-day rolling moving averages, RLS policy coverage, client bundle secret quarantine, SQL injection & XSS sanitization, and error boundaries.

### End-to-End Browser Automation Tests (Playwright)
```bash
# Build production bundle
npm run build

# Run all E2E tests across Desktop and Mobile viewports
npx playwright test
```
- **8 Suites, 62 Tests Passed**
- Verifies Desktop Chrome and Mobile Chrome (Pixel 5 & iPhone SE viewports):
  - Multi-step onboarding and profile saving
  - South Indian food catalog search, portion calculator modal, food log, and meal plan substitutions
  - 13-week walking roadmap, knee-safe strength exercises, audio rest timer chime, and session logger
  - Blood pressure logging, stage classification, and emergency crisis alerts ($>180/>120$ mmHg)
  - Water and sleep logging with snoring notice
  - Private PDF lab document upload and retrieval
  - Weekly progress summary digest, rolling moving average chart, and WhatsApp share copy
  - Opt-in AI coach consent gate and medical red-flag deflection
  - 375px mobile viewport zero horizontal scroll overflow and $\ge 44 \times 44\text{ px}$ touch targets
  - Global error boundaries, custom 404 recovery, and `/offline` PWA page

### Code Quality & Types
```bash
# Typecheck
npm run typecheck

# Lint
npm run lint
```

---

## 🌐 Telugu & English Localization (`src/lib/i18n`)

Fit90 Telugu provides complete bilingual localization:
- **Telugu (`te`)**: Primary native language optimized with readable typography and `leading-relaxed` line-heights to preserve complex Telugu vowel marks (*ottulu* and *maatras*).
- **English (`en`)**: Full English mirror for bilingual fluency.
- **Dynamic Switcher**: Instant 1-click header language toggle preserved in user profile state.

---

## 🚢 Deployment to Vercel

Fit90 Telugu is configured for direct zero-config Vercel deployment:

1. Push code to your GitHub / GitLab repository.
2. Import project into [Vercel](https://vercel.com).
3. Set Environment Variables in Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy! Vercel automatically detects Next.js 14, applies `vercel.json` security headers, and generates static/SSR chunks.

---

## 🔒 Privacy & User Data Rights

- **Row Level Security (RLS)**: Every single health, vital, and nutrition record is strictly isolated to the authenticated user (`auth.uid() = user_id`).
- **Data Export**: Users can export their complete profile and metrics as JSON at any time from `/profile`.
- **Account Deletion**: Users can permanently delete their account and associated records (`ON DELETE CASCADE`) from `/profile`.

---

## 📄 License
MIT License. Built with ❤️ for healthy, sustainable Indian lifestyle management.
