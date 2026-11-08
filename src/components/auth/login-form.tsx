"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoginSchema, type LoginFormData } from "@/lib/validations/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Lock, Mail, AlertCircle, Info } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";
  const { t } = useI18n();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const formSchema = createLoginSchema({
    emailInvalid: t.auth.emailInvalid,
    passwordRequired: t.auth.passwordPlaceholder,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setDemoNotice(null);

    try {
      const configured = isSupabaseConfigured();

      if (!configured) {
        // Safe development simulation when Supabase credentials are placeholders
        setDemoNotice(
          "Notice: Supabase live keys are not configured in .env.local yet. Simulating login for testing..."
        );
        setTimeout(() => {
          setIsLoading(false);
          router.push(redirectedFrom);
          router.refresh();
        }, 800);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setErrorMessage(error.message || t.auth.invalidCredentials);
        setIsLoading(false);
        return;
      }

      router.push(redirectedFrom);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.common.error;
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card rounded-3xl p-2 sm:p-3 shadow-2xl border border-slate-200/80 dark:border-slate-800/90 relative overflow-hidden">
      {/* Ambient background decoration inside card */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <CardHeader className="space-y-1 text-center relative z-10">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-2">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
            {t.auth.loginTitle}
          </span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t.auth.loginSubtitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-5">
            <span className="text-sm font-medium">{errorMessage}</span>
          </Alert>
        )}

        {demoNotice && (
          <Alert variant="default" className="mb-5 border-blue-200 bg-blue-50 text-blue-900">
            <span className="text-xs">{demoNotice}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email" required>
              {t.auth.emailLabel}
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t.auth.emailPlaceholder}
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="password" required className="mb-0">
                {t.auth.passwordLabel}
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                {t.auth.forgotPasswordLink}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t.auth.passwordPlaceholder}
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              {...register("rememberMe")}
            />
            <label htmlFor="rememberMe" className="text-xs text-slate-600 dark:text-slate-400">
              {t.auth.rememberMe}
            </label>
          </div>

          <Button
            type="submit"
            className="w-full text-base font-semibold mt-2"
            isLoading={isLoading}
          >
            {t.auth.loginButton}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 text-center border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t.auth.dontHaveAccount}{" "}
          <Link
            href="/signup"
            className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline ml-1"
          >
            {t.auth.signupLink}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

