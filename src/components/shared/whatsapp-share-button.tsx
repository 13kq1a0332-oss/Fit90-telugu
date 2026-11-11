"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Share2, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WhatsAppShareData {
  dayNumber: number;
  weightLossKg?: number;
  stepsToday?: number;
  proteinGToday?: number;
  caloriesToday?: number;
  targetCalories?: number;
  metabolicScore?: number;
}

export function WhatsAppShareButton({
  dayNumber,
  weightLossKg = 0,
  stepsToday = 0,
  proteinGToday = 0,
  caloriesToday = 0,
  targetCalories = 2000,
  metabolicScore = 85,
}: WhatsAppShareData) {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const generateMessage = (): string => {
    if (locale === "te") {
      let text = `🔥 *నా Fit90 ప్రయాణం - Day ${dayNumber}/90*\n\n`;
      text += `నేను ఈరోజు Fit90 తెలుగు యాప్‌తో నా ఆరోగ్య లక్ష్యాలను ట్రాక్ చేశాను:\n`;
      text += `🚶‍♂️ నేటి నడక: *${stepsToday.toLocaleString()} అడుగులు*\n`;
      text += `🥗 తీసుకున్న క్యాలరీలు: *${caloriesToday} / ${targetCalories} kcal*\n`;
      text += `💪 ప్రోటీన్: *${proteinGToday}g*\n`;
      if (weightLossKg > 0) text += `📉 తగ్గిన బరువు: *${weightLossKg.toFixed(1)} kg*\n`;
      text += `⚡ మెటబాలిక్ స్కోర్: *${metabolicScore}/100*\n\n`;
      text += `ఆరోగ్యకరమైన దక్షిణ భారతీయ జీవనశైలితో బరువు నియంత్రణ! 🌿\n`;
      text += `👉 https://fit90-telugu.vercel.app`;
      return text;
    } else {
      let text = `🔥 *My Fit90 Journey - Day ${dayNumber}/90*\n\n`;
      text += `Crushed my daily targets on Fit90 Telugu app today:\n`;
      text += `🚶‍♂️ Steps: *${stepsToday.toLocaleString()} steps*\n`;
      text += `🥗 Nutrition: *${caloriesToday} / ${targetCalories} kcal*\n`;
      text += `💪 Protein: *${proteinGToday}g*\n`;
      if (weightLossKg > 0) text += `📉 Weight Progress: *-${weightLossKg.toFixed(1)} kg*\n`;
      text += `⚡ Metabolic Score: *${metabolicScore}/100*\n\n`;
      text += `Healthy South Indian metabolic transformation! 🌿\n`;
      text += `👉 https://fit90-telugu.vercel.app`;
      return text;
    }
  };

  const handleShare = () => {
    const message = generateMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btn-3d-emerald inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-white font-black text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all min-h-[44px]"
      title="Share your daily progress on WhatsApp"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span>{locale === "te" ? "షేర్ చేయబడింది!" : "Shared!"}</span>
        </>
      ) : (
        <>
          <MessageCircle className="h-4 w-4 fill-white text-emerald-600" />
          <span>{locale === "te" ? "వాట్సాప్‌లో షేర్ చేయండి" : "Share on WhatsApp"}</span>
        </>
      )}
    </button>
  );
}

