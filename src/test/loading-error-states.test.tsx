import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalLoading from "@/app/loading";
import GlobalError from "@/app/error";
import NotFoundPage from "@/app/not-found";
import DashboardLoading from "@/app/(dashboard)/loading";
import DashboardError from "@/app/(dashboard)/error";
import OfflinePage from "@/app/offline/page";
import { I18nProvider } from "@/lib/i18n/context";

describe("Loading, Error & Fallback Boundaries", () => {
  describe("GlobalLoading Component", () => {
    it("renders with role='status' and accessible bilingual loading indicators", () => {
      render(<GlobalLoading />);
      const statusElement = screen.getByRole("status");
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveAttribute("aria-live", "polite");
      expect(screen.getByText(/లోడ్ అవుతోంది... \/ Loading.../i)).toBeInTheDocument();
    });
  });

  describe("GlobalError Boundary Component", () => {
    it("renders with role='alert', displays bilingual error text, and triggers reset() on click", () => {
      const mockReset = vi.fn();
      const testError = new Error("Test critical crash") as Error & { digest?: string };
      testError.digest = "err_12345";

      render(<GlobalError error={testError} reset={mockReset} />);

      const alertElement = screen.getByRole("alert");
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveAttribute("aria-live", "assertive");

      // Check bilingual headings
      expect(screen.getByText(/ఏదో తప్పు జరిగింది \/ Something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/Error Digest: err_12345/i)).toBeInTheDocument();

      // Check retry button
      const retryBtn = screen.getByRole("button", { name: /మళ్లీ ప్రయత్నించండి \/ Try Again/i });
      expect(retryBtn).toBeInTheDocument();
      fireEvent.click(retryBtn);
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("NotFoundPage (404) Component", () => {
    it("renders bilingual 404 heading and navigation action buttons", () => {
      render(<NotFoundPage />);

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByText(/404 — పేజీ కనుగొనబడలేదు \/ Not Found/i)).toBeInTheDocument();
      expect(screen.getByText("పేజీ కనుగొనబడలేదు")).toBeInTheDocument();

      // Check links to Dashboard and Home
      const dashboardLink = screen.getByRole("link", { name: /డాష్‌బోర్డ్ \/ Dashboard/i });
      expect(dashboardLink).toHaveAttribute("href", "/dashboard");

      const homeLink = screen.getByRole("link", { name: /హోమ్ \/ Home/i });
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("DashboardLoading Component", () => {
    it("renders accessible skeleton structure for dashboard layout", () => {
      render(<DashboardLoading />);
      const statusElement = screen.getByRole("status");
      expect(statusElement).toBeInTheDocument();
      expect(screen.getByText(/డాష్‌బోర్డ్ లోడ్ అవుతోంది... \/ Loading dashboard data.../i)).toBeInTheDocument();
    });
  });

  describe("DashboardError Component", () => {
    it("renders localized dashboard error message and executes retry callback", () => {
      const mockReset = vi.fn();
      const testError = new Error("Dashboard telemetry error");

      render(<DashboardError error={testError} reset={mockReset} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/డాష్‌బోర్డ్ లోడ్ చేయడంలో లోపం \/ Failed to load dashboard/i)).toBeInTheDocument();

      const retryBtn = screen.getByRole("button", { name: /మళ్లీ ప్రయత్నించండి \/ Retry/i });
      fireEvent.click(retryBtn);
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("OfflinePage (PWA Fallback)", () => {
    it("renders offline status and refresh action in Telugu and English", () => {
      render(
        <I18nProvider initialLocale="te">
          <OfflinePage />
        </I18nProvider>
      );

      // Check Telugu offline heading
      expect(screen.getByText(/మీరు ఆఫ్‌లైన్‌లో ఉన్నారు/i)).toBeInTheDocument();
      const refreshBtn = screen.getByRole("button", { name: /మళ్లీ ప్రయత్నించండి/i });
      expect(refreshBtn).toBeInTheDocument();
    });
  });
});

