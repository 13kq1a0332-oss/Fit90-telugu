"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { X, Scale, Ruler } from "lucide-react";

interface QuickLogModalProps {
  type: "weight" | "waist";
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  currentValue?: number;
}

export function QuickLogModal({
  type,
  isOpen,
  onClose,
  onSave,
  currentValue = 118,
}: QuickLogModalProps) {
  const { t, locale } = useI18n();
  const [value, setValue] = useState<number>(currentValue);

  if (!isOpen) return null;

  const isWeight = type === "weight";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value > 0) {
      onSave(value);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-sm shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            {isWeight ? <Scale className="h-5 w-5" /> : <Ruler className="h-5 w-5" />}
          </div>
          <CardTitle className="text-lg">
            {isWeight
              ? locale === "te" ? "నేటి బరువు నమోదు" : "Log Today's Weight"
              : locale === "te" ? "నడుము కొలత నమోదు" : "Log Waist Circumference"}
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quickLogValue">
                {isWeight
                  ? locale === "te" ? "బరువు (కిలోలు)" : "Weight (kg)"
                  : locale === "te" ? "నడుము (సెం.మీ.)" : "Waist (cm)"}
              </Label>
              <Input
                id="quickLogValue"
                type="number"
                step="0.1"
                min={20}
                max={300}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-1">
                {isWeight
                  ? locale === "te"
                    ? "ఉదయం ఖాళీ కడుపుతో బరువు చూసుకోవడం మంచిది."
                    : "Best measured in the morning fasting state."
                  : locale === "te"
                    ? "బొడ్డు భాగం వద్ద కొలవండి."
                    : "Measure across the navel level."}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary">
              {t.common.save}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

