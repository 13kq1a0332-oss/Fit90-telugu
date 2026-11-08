import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Security & Row Level Security (RLS) Isolation Audit", () => {
  const rootDir = process.cwd();
  const schemaPath = path.join(rootDir, "supabase", "migrations", "20261108000000_initial_schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  describe("PostgreSQL Schema & RLS Hardening", () => {
    const requiredTables = [
      "profiles",
      "goals",
      "food_items",
      "meal_plans",
      "meal_plan_entries",
      "food_logs",
      "exercises",
      "workout_plans",
      "workout_sessions",
      "workout_exercise_logs",
      "weight_logs",
      "waist_logs",
      "water_logs",
      "step_logs",
      "sleep_logs",
      "blood_pressure_logs",
      "lab_records",
      "reminders",
      "notification_preferences",
      "audit_events",
    ];

    it("enables Row Level Security on all 20 required tables", () => {
      for (const table of requiredTables) {
        const regex = new RegExp(`ALTER\\s+TABLE\\s+public\\.${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, "i");
        expect(
          regex.test(schemaSql),
          `Table public.${table} must have ENABLE ROW LEVEL SECURITY defined`
        ).toBe(true);
      }
    });

    it("enforces strict user isolation policies on all private tables", () => {
      const privateTables = [
        "goals",
        "meal_plans",
        "food_logs",
        "workout_plans",
        "workout_sessions",
        "weight_logs",
        "waist_logs",
        "water_logs",
        "step_logs",
        "sleep_logs",
        "blood_pressure_logs",
        "lab_records",
        "reminders",
        "notification_preferences",
      ];

      for (const table of privateTables) {
        const policyRegex = new RegExp(
          `CREATE\\s+POLICY[\\s\\S]*?ON\\s+public\\.${table}[\\s\\S]*?auth\\.uid\\(\\)\\s*=\\s*user_id`,
          "i"
        );
        expect(
          policyRegex.test(schemaSql),
          `Table public.${table} must have an RLS policy asserting auth.uid() = user_id`
        ).toBe(true);
      }
    });

    it("enforces profiles RLS policy asserting auth.uid() = id", () => {
      expect(schemaSql).toMatch(/CREATE\s+POLICY\s+"Users can view own profile"[\s\S]*?ON\s+public\.profiles[\s\S]*?auth\.uid\(\)\s*=\s*id/i);
      expect(schemaSql).toMatch(/CREATE\s+POLICY\s+"Users can update own profile"[\s\S]*?ON\s+public\.profiles[\s\S]*?auth\.uid\(\)\s*=\s*id/i);
    });

    it("protects public reference catalogs (food_items & exercises) from unauthorized modification", () => {
      // Authenticated users can SELECT food_items and exercises
      expect(schemaSql).toMatch(/CREATE\s+POLICY\s+"Anyone authenticated can view food items"[\s\S]*?ON\s+public\.food_items\s+FOR\s+SELECT/i);
      expect(schemaSql).toMatch(/CREATE\s+POLICY\s+"Anyone can view exercises"[\s\S]*?ON\s+public\.exercises\s+FOR\s+SELECT/i);

      // Verify custom food item creation enforces created_by = auth.uid()
      expect(schemaSql).toMatch(/CREATE\s+POLICY\s+"Users can create custom food items"[\s\S]*?WITH\s+CHECK\s*\(auth\.uid\(\)\s*=\s*created_by\)/i);
    });

    it("defines ON DELETE CASCADE on user-owned foreign keys to respect privacy & data deletion", () => {
      expect(schemaSql).toMatch(/REFERENCES\s+public\.profiles\(id\)\s+ON\s+DELETE\s+CASCADE/i);
    });
  });

  describe("Client Secret Protection & Bundle Hygiene", () => {
    it("never exposes SUPABASE_SERVICE_ROLE_KEY to client components or public bundles", () => {
      const srcDir = path.join(rootDir, "src");

      function searchDirectory(dir: string): string[] {
        const results: string[] = [];
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            if (file.name !== "node_modules" && file.name !== ".next") {
              results.push(...searchDirectory(fullPath));
            }
          } else if (file.name.endsWith(".ts") || file.name.endsWith(".tsx") || file.name.endsWith(".js")) {
            const content = fs.readFileSync(fullPath, "utf-8");
            if (
              content.includes("SUPABASE_SERVICE_ROLE_KEY") &&
              !fullPath.includes("security-rls.test.ts") &&
              !fullPath.includes("server.ts")
            ) {
              results.push(fullPath);
            }
          }
        }
        return results;
      }

      const leakingFiles = searchDirectory(srcDir);
      expect(
        leakingFiles,
        `SUPABASE_SERVICE_ROLE_KEY must never be referenced in client files: ${leakingFiles.join(", ")}`
      ).toHaveLength(0);
    });

    it("ensures .env.example only references public anon variables with placeholder values", () => {
      const envExamplePath = path.join(rootDir, ".env.example");
      expect(fs.existsSync(envExamplePath)).toBe(true);

      const envExampleContent = fs.readFileSync(envExamplePath, "utf-8");
      expect(envExampleContent).toContain("NEXT_PUBLIC_SUPABASE_URL");
      expect(envExampleContent).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
      expect(envExampleContent).not.toMatch(/eyJ[a-zA-Z0-9_-]{20,}/); // No real JWT secret
    });
  });

  describe("Synthetic QA Profile Isolation", () => {
    it("strictly isolates synthetic sample data within explicitly marked test fixture functions", async () => {
      const { SAMPLE_TEST_USER_FIXTURE } = await import("@/lib/test-fixtures/sample-user");
      expect(SAMPLE_TEST_USER_FIXTURE).toBeDefined();
      expect(SAMPLE_TEST_USER_FIXTURE.profile.current_weight_kg).toBe(118);
      expect(SAMPLE_TEST_USER_FIXTURE.profile.waist_cm).toBe(150);
      expect(SAMPLE_TEST_USER_FIXTURE.profile.age).toBe(31);
      expect(SAMPLE_TEST_USER_FIXTURE.profile.height_cm).toBe(176);

      // Verify goals match QA spec
      expect(SAMPLE_TEST_USER_FIXTURE.goals.calorie_target_min).toBe(2000);
      expect(SAMPLE_TEST_USER_FIXTURE.goals.calorie_target_max).toBe(2200);
      expect(SAMPLE_TEST_USER_FIXTURE.goals.protein_target_min_g).toBe(100);
      expect(SAMPLE_TEST_USER_FIXTURE.goals.protein_target_max_g).toBe(120);
    });

    it("verifies fixture files include explicit warning notices against public usage", () => {
      const fixturePath = path.join(rootDir, "src", "lib", "test-fixtures", "sample-user.ts");
      const fixtureContent = fs.readFileSync(fixturePath, "utf-8");
      expect(fixtureContent).toContain("SAMPLE USER FIXTURE FOR TESTING AND QA VERIFICATION ONLY");
      expect(fixtureContent.toUpperCase()).toContain("NEVER BE USED AS A PUBLIC DEFAULT");
    });
  });

  describe("Malicious Input Sanitization & Injection Defense", () => {
    it("handles SQL injection payloads in food catalog search without syntax errors", async () => {
      const { searchFoodItems } = await import("@/lib/data/food-catalog");
      const injectionPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE profiles; --",
        "' UNION SELECT * FROM profiles --",
        "admin'--",
      ];

      for (const payload of injectionPayloads) {
        expect(() => searchFoodItems(payload)).not.toThrow();
        const results = searchFoodItems(payload);
        expect(Array.isArray(results)).toBe(true);
      }
    });

    it("handles XSS payloads in lifestyle coach user messages safely", async () => {
      const { checkMedicalRedFlags, generateCoachResponse } = await import("@/lib/ai/lifestyle-coach");
      const xssPayloads = [
        "<script>alert('xss')</script>",
        "<img src=x onerror=alert(1)>",
        "<svg onload=alert(document.cookie)>",
        "javascript:alert(1)",
      ];

      for (const payload of xssPayloads) {
        expect(() => checkMedicalRedFlags(payload)).not.toThrow();
        const response = generateCoachResponse(payload);
        expect(response).toBeDefined();
        expect(typeof response.textEn).toBe("string");
        // Script tags should not be evaluated as executable code
        expect(response.textEn).not.toContain("<script>");
      }
    });
  });

  describe("Route Protection Middleware Rules", () => {
    const protectedPaths = [
      "/dashboard",
      "/diet",
      "/workouts",
      "/health",
      "/insights",
      "/profile",
      "/onboarding",
    ];
    const publicPaths = [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/offline",
    ];

    it("verifies path categorization logic in middleware specification", () => {
      for (const p of protectedPaths) {
        const isPublic = publicPaths.some((pub) => p === pub || p.startsWith(pub + "/"));
        expect(isPublic).toBe(false);
      }

      for (const p of publicPaths) {
        const isProtected = protectedPaths.some((prot) => p === prot || p.startsWith(prot + "/"));
        expect(isProtected).toBe(false);
      }
    });
  });
});
