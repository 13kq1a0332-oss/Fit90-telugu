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
import { Lock, Mail, AlertCircle, Info, Phone, Sparkles } from "lucide-react";
import { MobileOtpAuth } from "./mobile-otp-auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";
  const { t, locale } = useI18n();

  const [authMethod, setAuthMethod] = useState<"email" | "mobile">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: "google" | "azure") => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "https://fit90-telugu.vercel.app";

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.common.error;
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  if (authMethod === "mobile") {
    return <MobileOtpAuth mode="login" onSwitchToEmail={() => setAuthMethod("email")} />;
  }

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

        {/* Auth Method Switcher Tabs */}
        <div className="pt-3 flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setAuthMethod("mobile")}
            className="flex-1 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{locale === "te" ? "మొబైల్ OTP" : "Mobile OTP"}</span>
          </button>
          <button
            type="button"
            className="flex-1 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs flex items-center justify-center gap-1"
          >
            <span>📧 {locale === "te" ? "ఇమెయిల్" : "Email & Password"}</span>
          </button>
        </div>
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

      <CardFooter className="flex flex-col gap-3 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
        {/* Real OAuth Buttons: Google & Outlook */}
        <div className="w-full space-y-2">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            className="w-full min-h-[46px] rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs hover:border-slate-400"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{locale === "te" ? "గూగుల్ ఖాతాతో లాగిన్ అవ్వండి" : "Sign In with Google"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("azure")}
            className="w-full min-h-[46px] rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs hover:border-slate-400"
          >
            <svg className="h-4 w-4" viewBox="0 0 23 23">
              <path fill="#f25022" d="M1 1h10v10H1z" />
              <path fill="#00a4ef" d="M1 12h10v10H1z" />
              <path fill="#7fba00" d="M12 1h10v10H12z" />
              <path fill="#ffb900" d="M12 12h10v10H12z" />
            </svg>
            <span>{locale === "te" ? "అవుట్‌లుక్ / మైక్రోసాఫ్ట్ తో ప్రవేశించండి" : "Sign In with Outlook"}</span>
          </button>
        </div>

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

