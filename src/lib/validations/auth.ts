import { z } from "zod";

export const createLoginSchema = (errorMessages?: {
  emailInvalid?: string;
  passwordRequired?: string;
}) =>
  z.object({
    email: z
      .string()
      .min(1, errorMessages?.emailInvalid || "Email is required")
      .email(errorMessages?.emailInvalid || "Please enter a valid email address"),
    password: z
      .string()
      .min(1, errorMessages?.passwordRequired || "Password is required"),
    rememberMe: z.boolean().optional(),
  });

export const createSignupSchema = (errorMessages?: {
  nameRequired?: string;
  emailInvalid?: string;
  weakPassword?: string;
  passwordMismatch?: string;
}) =>
  z
    .object({
      fullName: z
        .string()
        .min(2, errorMessages?.nameRequired || "Full name must be at least 2 characters")
        .max(100),
      email: z
        .string()
        .min(1, errorMessages?.emailInvalid || "Email is required")
        .email(errorMessages?.emailInvalid || "Please enter a valid email address"),
      preferredLocale: z.enum(["te", "en"]).default("te"),
      password: z
        .string()
        .min(8, errorMessages?.weakPassword || "Password must be at least 8 characters")
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)/,
          errorMessages?.weakPassword || "Password must contain at least one letter and one number"
        ),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: errorMessages?.passwordMismatch || "Passwords do not match",
      path: ["confirmPassword"],
    });

export const createForgotPasswordSchema = (errorMessages?: {
  emailInvalid?: string;
}) =>
  z.object({
    email: z
      .string()
      .min(1, errorMessages?.emailInvalid || "Email is required")
      .email(errorMessages?.emailInvalid || "Please enter a valid email address"),
  });

export const createResetPasswordSchema = (errorMessages?: {
  weakPassword?: string;
  passwordMismatch?: string;
}) =>
  z
    .object({
      password: z
        .string()
        .min(8, errorMessages?.weakPassword || "Password must be at least 8 characters")
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)/,
          errorMessages?.weakPassword || "Password must contain at least one letter and one number"
        ),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: errorMessages?.passwordMismatch || "Passwords do not match",
      path: ["confirmPassword"],
    });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>;
export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;

