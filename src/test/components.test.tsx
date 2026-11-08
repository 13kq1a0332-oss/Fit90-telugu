import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { I18nProvider } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { SafetyBanner } from "@/components/layout/safety-banner";

describe("UI Components & Accessibility", () => {
  it("renders Button with proper text and minimum touch height", () => {
    render(<Button>ప్రారంభించండి</Button>);
    const button = screen.getByRole("button", { name: "ప్రారంభించండి" });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("h-12"); // Minimum 48px touch target
  });

  it("handles loading state in Button", () => {
    render(<Button isLoading>సేవ్ చేయండి</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders Input with error state", () => {
    render(<Input placeholder="Email" error="సరైన ఈమెయిల్ ఇవ్వండి" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByText("సరైన ఈమెయిల్ ఇవ్వండి")).toBeInTheDocument();
  });

  it("renders Alert with message", () => {
    render(<Alert variant="destructive">నెట్‌వర్క్ లోపం సంభవించింది</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("నెట్‌వర్క్ లోపం సంభవించింది");
  });

  it("renders LanguageToggle and switches language correctly", () => {
    render(
      <I18nProvider initialLocale="te">
        <LanguageToggle />
        <SafetyBanner />
      </I18nProvider>
    );

    const teBtn = screen.getByRole("button", { name: "తెలుగు" });
    const enBtn = screen.getByRole("button", { name: "EN" });

    expect(teBtn).toBeInTheDocument();
    expect(enBtn).toBeInTheDocument();

    // Default locale is 'te'
    expect(teBtn).toHaveAttribute("aria-pressed", "true");

    // Click English switch
    fireEvent.click(enBtn);
    expect(enBtn).toHaveAttribute("aria-pressed", "true");
  });
});

