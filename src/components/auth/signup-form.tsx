"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSignupSchema, type SignupFormData } from "@/lib/validations/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formSchema = createSignupSchema({
    nameRequired: t.auth.nameRequired,
    emailInvalid: t.auth.emailInvalid,
    weakPassword: t.auth.weakPassword,
    passwordMismatch: t.auth.passwordMismatch,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      preferredLocale: locale,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const configured = isSupabaseConfigured();

      if (!configured) {
        setSuccessMessage(
          "Notice: Supabase live keys not set in .env.local. Signup validated! Redirecting to login..."
        );
        setTimeout(() => {
          setIsLoading(false);
          router.push("/login");
        }, 1200);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            preferred_locale: values.preferredLocale,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        // Auto confirmed
        router.push("/dashboard");
        router.refresh();
      } else {
        setSuccessMessage(
          "Registration successful! Please check your email to confirm your account."
        );
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.common.error;
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-slate-200/90 dark:border-slate-800">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.auth.signupTitle}
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          {t.auth.signupSubtitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-5">
            <span className="text-sm font-medium">{errorMessage}</span>
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className="mb-5">
            <span className="text-sm font-medium">{successMessage}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="fullName" required>
              {t.auth.fullNameLabel}
            </Label>
            <Input
              id="fullName"
              placeholder={t.auth.fullNamePlaceholder}
              error={errors.fullName?.message}
              {...register("fullName")}
            />
          </div>

          <div>
            <Label htmlFor="email" required>
              {t.auth.emailLabel}
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t.auth.emailPlaceholder}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div>
            <Label htmlFor="preferredLocale">
              {t.auth.preferredLanguageLabel}
            </Label>
            <Select
              id="preferredLocale"
              {...register("preferredLocale")}
              onChange={(e) => {
                const val = e.target.value as "te" | "en";
                setValue("preferredLocale", val);
                setLocale(val);
              }}
            >
              <option value="te">తెలుగు (Telugu - Recommended)</option>
              <option value="en">English</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="password" required>
              {t.auth.passwordLabel}
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder={t.auth.passwordPlaceholder}
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" required>
              {t.auth.confirmPasswordLabel}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder={t.auth.confirmPasswordPlaceholder}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-base font-semibold mt-2"
            isLoading={isLoading}
          >
            {t.auth.signupButton}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 text-center border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t.auth.alreadyHaveAccount}{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline ml-1"
          >
            {t.auth.loginLink}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

