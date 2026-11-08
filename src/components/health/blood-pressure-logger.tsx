"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  classifyBloodPressure,
  addBloodPressureLog,
  BloodPressureEntry,
} from "@/lib/health-store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse, AlertOctagon, X, CheckCircle2, ShieldAlert } from "lucide-react";

interface BloodPressureLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogged: () => void;
}

export function BloodPressureLogger({
  isOpen,
  onClose,
  onLogged,
}: BloodPressureLoggerProps) {
  const { locale, t } = useI18n();

  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(72);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const classification = classifyBloodPressure(systolic, diastolic);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addBloodPressureLog({
        systolic,
        diastolic,
        pulse,
        loggedDate: new Date().toISOString().slice(0, 10),
        loggedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        notes,
      });

      onLogged();
      onClose();
    } catch (err) {
      console.error("Error logging BP:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-red-500" />
              <span>{t.health.logBp}</span>
            </CardTitle>
            <p className="text-xs text-slate-500">
              {locale === "te"
                ? "డిజిటల్ BP మానిటర్ ద్వారా తీసుకున్న రీడింగ్‌ను నమోదు చేయండి"
                : "Record your blood pressure reading measured at rest"}
            </p>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            {/* Live Clinical Classification Badge */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between font-bold ${classification.colorClass}`}
            >
              <span>{locale === "te" ? "క్లినికల్ వర్గీకరణ:" : "Clinical Stage:"}</span>
              <span>{locale === "te" ? classification.labelTe : classification.labelEn}</span>
            </div>

            {/* Hypertensive Crisis Immediate Emergency Warning */}
            {classification.isCrisis && (
              <div className="p-3.5 bg-red-600 text-white rounded-xl shadow-md flex items-start gap-2.5 animate-bounce">
                <AlertOctagon className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">
                  {t.health.bpCrisisAlert}
                </p>
              </div>
            )}

            {/* Systolic & Diastolic Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="systolicInput" className="font-semibold mb-1 block">
                  {t.health.systolic}
                </Label>
                <Input
                  id="systolicInput"
                  type="number"
                  min={60}
                  max={260}
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  required
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {locale === "te" ? "సాధారణం: < 120" : "Normal: < 120"}
                </span>
              </div>

              <div>
                <Label htmlFor="diastolicInput" className="font-semibold mb-1 block">
                  {t.health.diastolic}
                </Label>
                <Input
                  id="diastolicInput"
                  type="number"
                  min={40}
                  max={160}
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  required
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {locale === "te" ? "సాధారణం: < 80" : "Normal: < 80"}
                </span>
              </div>
            </div>

            {/* Pulse */}
            <div>
              <Label htmlFor="pulseInput" className="font-semibold mb-1 block">
                {t.health.pulse}
              </Label>
              <Input
                id="pulseInput"
                type="number"
                min={30}
                max={220}
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
              />
            </div>

            {/* Measurement Context Note */}
            <div>
              <Label htmlFor="bpNotes" className="font-semibold mb-1 block">
                {locale === "te" ? "సందర్భం / గమనికలు (ఐచ్ఛికం)" : "Context Notes (Optional)"}
              </Label>
              <Input
                id="bpNotes"
                type="text"
                placeholder={
                  locale === "te"
                    ? "ఉదా: ఉదయం నిద్రలేవగానే, విశ్రాంతిగా ఉన్నప్పుడు..."
                    : "e.g. morning resting, after 5 mins seated..."
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {locale === "te" ? "రద్దు చేయండి" : "Cancel"}
            </Button>
            <Button
              id="submitBpBtn"
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {isSubmitting ? "Saving..." : t.health.logBp}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
