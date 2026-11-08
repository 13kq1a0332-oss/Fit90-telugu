import { describe, it, expect } from "vitest";
import {
  createLoginSchema,
  createSignupSchema,
  createForgotPasswordSchema,
  createResetPasswordSchema,
} from "@/lib/validations/auth";

describe("Auth Validation Schemas", () => {
  describe("Login Schema", () => {
    const loginSchema = createLoginSchema();

    it("should accept valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "ramesh@example.com",
        password: "StrongPassword123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "StrongPassword123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const result = loginSchema.safeParse({
        email: "ramesh@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Signup Schema", () => {
    const signupSchema = createSignupSchema();

    it("should accept valid signup details", () => {
      const result = signupSchema.safeParse({
        fullName: "సురేష్ వర్మ",
        email: "suresh@example.com",
        preferredLocale: "te",
        password: "ValidPass123",
        confirmPassword: "ValidPass123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject password mismatch", () => {
      const result = signupSchema.safeParse({
        fullName: "సురేష్ వర్మ",
        email: "suresh@example.com",
        preferredLocale: "te",
        password: "ValidPass123",
        confirmPassword: "DifferentPass456",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("confirmPassword");
      }
    });

    it("should reject password shorter than 8 chars", () => {
      const result = signupSchema.safeParse({
        fullName: "User",
        email: "user@example.com",
        preferredLocale: "en",
        password: "Pass1",
        confirmPassword: "Pass1",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without numbers", () => {
      const result = signupSchema.safeParse({
        fullName: "User",
        email: "user@example.com",
        preferredLocale: "en",
        password: "PasswordWithoutNumber",
        confirmPassword: "PasswordWithoutNumber",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Forgot Password Schema", () => {
    const forgotSchema = createForgotPasswordSchema();

    it("should validate proper email", () => {
      expect(forgotSchema.safeParse({ email: "user@domain.com" }).success).toBe(true);
      expect(forgotSchema.safeParse({ email: "invalid" }).success).toBe(false);
    });
  });

  describe("Reset Password Schema", () => {
    const resetSchema = createResetPasswordSchema();

    it("should enforce matching passwords and complexity", () => {
      expect(
        resetSchema.safeParse({
          password: "NewPassword123",
          confirmPassword: "NewPassword123",
        }).success
      ).toBe(true);

      expect(
        resetSchema.safeParse({
          password: "NewPassword123",
          confirmPassword: "Mismatch456",
        }).success
      ).toBe(false);
    });
  });
});

