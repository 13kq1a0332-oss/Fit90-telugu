"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createResetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export function ResetPasswordForm() {
  const router = useRouter();
  const { t } = useI18n();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formSchema = createResetPasswordSchema({
    weakPassword: t.auth.weakPassword,
    passwordMismatch: t.auth.passwordMismatch,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const configured = isSupabaseConfigured();

      if (!configured) {
        setSuccessMessage("Notice: Password update simulated in test mode! Redirecting to login...");
        setTimeout(() => {
          setIsLoading(false);
          router.push("/login");
        }, 1200);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setSuccessMessage(t.auth.updateSuccessMessage);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
          {t.auth.resetPasswordTitle}
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          {t.auth.resetPasswordSubtitle}
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
            <Label htmlFor="password" required>
              {t.auth.passwordLabel}
            </Label>
            <Input
              id="password"
              type="password"
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
            {t.auth.updatePasswordButton}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
        <Link
          href="/login"
          className="text-sm font-semibold text-slate-600 hover:text-emerald-700"
        >
          {t.auth.backToLogin}
        </Link>
      </CardFooter>
    </Card>
  );
}

