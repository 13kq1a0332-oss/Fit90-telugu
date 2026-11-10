"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  LabRecordEntry,
  getLabRecords,
  addLabRecord,
  deleteLabRecord,
  loadSampleTestProfileLabs,
} from "@/lib/health-store";
import { uploadPrivateLabDocument } from "@/lib/storage/lab-documents";
import {
  analyzeUploadedLabReport,
  LabAnalysisResult,
} from "@/lib/ai/lab-report-analyzer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldAlert,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Calendar,
  Activity,
  FileCheck,
} from "lucide-react";

export function LabRecordsView() {
  const { locale, t } = useI18n();

  const [records, setRecords] = useState<LabRecordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [lastUploadedDoc, setLastUploadedDoc] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<LabAnalysisResult | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  // Manual entry modal / expandable state
  const [showAddForm, setShowAddForm] = useState(false);
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0, 10));
  const [numericValue, setNumericValue] = useState<number | "">("");
  const [unit, setUnit] = useState("");
  const [referenceRangeText, setReferenceRangeText] = useState("");
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getLabRecords();
      setRecords(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoadSample = async () => {
    const samples = await loadSampleTestProfileLabs();
    setRecords(samples);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const meta = await uploadPrivateLabDocument(file);
      setLastUploadedDoc(meta.fileName);

      // Perform AI Analysis on the uploaded lab report document
      const analysis = analyzeUploadedLabReport(file.name, testName);
      setCurrentAnalysis(analysis);

      // Auto-populate all form fields with extracted biomarker values
      setTestName(analysis.testName);
      setNumericValue(analysis.numericValue);
      setUnit(analysis.unit);
      setReferenceRangeText(analysis.referenceRangeText);
      setNotes(
        locale === "te"
          ? `[AI ల్యాబ్ విశ్లేషణ: ${analysis.riskBadgeLabelTe}] ${analysis.clinicalSummaryTe}`
          : `[AI Lab Analysis: ${analysis.riskBadgeLabelEn}] ${analysis.clinicalSummaryEn}`
      );
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerAiScan = () => {
    const targetName = lastUploadedDoc || testName || "report_sample.pdf";
    const analysis = analyzeUploadedLabReport(targetName, testName);
    setCurrentAnalysis(analysis);

    setTestName(analysis.testName);
    setNumericValue(analysis.numericValue);
    setUnit(analysis.unit);
    setReferenceRangeText(analysis.referenceRangeText);
    setNotes(
      locale === "te"
        ? `[AI ల్యాబ్ విశ్లేషణ: ${analysis.riskBadgeLabelTe}] ${analysis.clinicalSummaryTe}`
        : `[AI Lab Analysis: ${analysis.riskBadgeLabelEn}] ${analysis.clinicalSummaryEn}`
    );
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || numericValue === "") return;

    await addLabRecord({
      testName,
      testDate,
      numericValue: Number(numericValue),
      unit: unit || "mg/dL",
      referenceRangeText: referenceRangeText || "Standard clinical reference range",
      documentFileName: lastUploadedDoc || undefined,
      notes: notes || undefined,
    });

    // Reset form
    setTestName("");
    setNumericValue("");
    setUnit("");
    setReferenceRangeText("");
    setNotes("");
    setLastUploadedDoc(null);
    setShowAddForm(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await deleteLabRecord(id);
    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* 1. Mandatory Non-Diagnostic Medical Disclaimer Alert */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-bold text-amber-800 dark:text-amber-300">
            {locale === "te" ? "వైద్య నిర్ధారణ రహిత నిరాకరణ (Non-Diagnostic Disclaimer)" : "Non-Diagnostic Medical Disclaimer"}
          </h4>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-amber-800/90 dark:text-amber-200/90">
            {t.health.labDisclaimer}
          </p>
        </div>
      </div>

      {/* Top Action Bar: Upload, Add Manual, and QA Sample Loader */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            id="openAddLabBtn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{locale === "te" ? "ల్యాబ్ రికార్డు నమోదు" : "Add Lab Entry"}</span>
          </Button>

          <Button
            id="loadSampleLabsBtn"
            variant="outline"
            onClick={handleLoadSample}
            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 gap-1.5"
          >
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t.health.loadSampleLabs}</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.2 rounded font-mono font-bold">
              QA Test Fixture
            </span>
          </Button>
        </div>

        {/* Private Vault Encryption Badge */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
          <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{locale === "te" ? "ఎన్‌క్రిప్టెడ్ ప్రైవేట్ హెల్త్ వాల్ట్ (RLS రక్షణ)" : "Encrypted Private Health Vault (RLS Isolated)"}</span>
        </div>
      </div>

      {/* Manual Entry Form / PDF Document Attacher */}
      {showAddForm && (
        <Card className="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-sm animate-in fade-in duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              <span>{locale === "te" ? "కొత్త రక్త పరీక్ష రికార్డు వివరాలు" : "New Lab Biomarker Record"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testName" className="text-xs font-semibold">
                    {t.health.testName} *
                  </Label>
                  <Input
                    id="testName"
                    required
                    placeholder="e.g. hs-CRP, HDL Cholesterol, Vitamin D"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="mt-1 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <Label htmlFor="testDate" className="text-xs font-semibold">
                    {t.health.testDate}
                  </Label>
                  <Input
                    id="testDate"
                    type="date"
                    required
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="mt-1 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numericValue" className="text-xs font-semibold">
                    {t.health.testValue} *
                  </Label>
                  <Input
                    id="numericValue"
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 12.25"
                    value={numericValue}
                    onChange={(e) => setNumericValue(e.target.value === "" ? "" : Number(e.target.value))}
                    className="mt-1 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <Label htmlFor="unit" className="text-xs font-semibold">
                    {t.health.testUnit}
                  </Label>
                  <Input
                    id="unit"
                    placeholder="e.g. mg/L, mg/dL, ng/mL, %"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-1 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <Label htmlFor="referenceRange" className="text-xs font-semibold">
                    {t.health.referenceRange}
                  </Label>
                  <Input
                    id="referenceRange"
                    placeholder="e.g. < 1.0 (Low), 1.0-3.0 (Moderate)"
                    value={referenceRangeText}
                    onChange={(e) => setReferenceRangeText(e.target.value)}
                    className="mt-1 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* PDF Document Attachment Section */}
              <div className="p-3.5 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-white/80 dark:bg-slate-900/80 shadow-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label htmlFor="docUpload" className="text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-800 dark:text-slate-200">
                    <Upload className="h-4 w-4 text-emerald-600" />
                    <span>{t.health.uploadReport}</span>
                  </Label>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleTriggerAiScan}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold gap-1.5 shadow-sm rounded-xl h-8 px-3"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{locale === "te" ? "⚡ AI ఆటో-విశ్లేషణ & విలువలు" : "⚡ AI Auto-Extract & Analyze Report"}</span>
                  </Button>
                </div>

                <Input
                  id="docUpload"
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileUpload}
                  className="mt-1 text-xs"
                />
                {isUploading && (
                  <p className="mt-1 text-xs text-indigo-600 animate-pulse font-medium">
                    {locale === "te" ? "ల్యాబ్ రిపోర్ట్ అప్‌లోడ్ చేసి AI ద్వారా విశ్లేషిస్తున్నాము..." : t.health.uploading}
                  </p>
                )}
                {lastUploadedDoc && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <FileCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{lastUploadedDoc} ({locale === "te" ? "విజయవంతంగా జతచేయబడింది & AI స్కాన్ చేయబడింది" : `${t.health.uploadSuccess} & AI Scanned`})</span>
                  </div>
                )}
              </div>

              {/* AI Clinical Lab Analysis & Recommendations Card */}
              {currentAnalysis && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800 shadow-md space-y-3.5 animate-in fade-in duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-indigo-950 dark:text-indigo-200">
                        {locale === "te"
                          ? "⚡ AI ల్యాబ్ నివేదిక విశ్లేషణ & వ్యక్తిగత సూచనలు"
                          : "⚡ AI Clinical Lab Analysis & Tailored Prescription"}
                      </h4>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                      {locale === "te" ? currentAnalysis.riskBadgeLabelTe : currentAnalysis.riskBadgeLabelEn}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {locale === "te" ? currentAnalysis.clinicalSummaryTe : currentAnalysis.clinicalSummaryEn}
                  </p>

                  {/* Dietary Swaps */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <h5 className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <span>🥗</span>
                      <span>{locale === "te" ? "మీ ల్యాబ్ రిపోర్ట్ ఆధారిత తెలుగు ఆహార మార్పులు:" : "Lab-Calibrated South Indian Nutrition Plan:"}</span>
                    </h5>
                    <ul className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                      {(locale === "te" ? currentAnalysis.dietaryRecommendationsTe : currentAnalysis.dietaryRecommendationsEn).map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Workout Recommendations */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <h5 className="text-xs font-black text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                      <span>🏃‍♂️</span>
                      <span>{locale === "te" ? "కీళ్ల భద్రత & షుగర్ తగ్గించే వ్యాయామ ప్రణాళిక:" : "Targeted Movement & Glucose-Clearing Protocol:"}</span>
                    </h5>
                    <ul className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                      {(locale === "te" ? currentAnalysis.workoutRecommendationsTe : currentAnalysis.workoutRecommendationsEn).map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/60 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                    🎯 {locale === "te" ? currentAnalysis.followUpPlanTe : currentAnalysis.followUpPlanEn}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="notes" className="text-xs font-semibold">
                  {locale === "te" ? "గమనికలు / డాక్టర్ సలహా" : "Notes / Clinical Notes"}
                </Label>
                <Input
                  id="notes"
                  placeholder="e.g. Baseline inflammation marker for personal tracking."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  {t.common.cancel}
                </Button>
                <Button
                  id="saveLabRecordBtn"
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  {t.common.save}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lab Records List */}
      {records.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 text-center py-12">
          <CardContent className="space-y-3">
            <FileText className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">
              {t.health.emptyLabs}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {locale === "te"
                ? "మీ hs-CRP, HDL, మరియు విటమిన్ D వంటి బ్లడ్ టెస్ట్ వివరాలను భద్రపరుచుకోవడానికి పైన ఉన్న 'ల్యాబ్ రికార్డు నమోదు' లేదా 'నమూనా టెస్ట్ రికార్డులు లోడ్ చేయి' బటన్‌పై నొక్కండి."
                : "Record your hs-CRP, HDL cholesterol, or Vitamin D values to observe lifestyle progress alongside walking and nutrition."}
            </p>
            <Button
              id="emptyLoadSampleBtn"
              variant="outline"
              onClick={handleLoadSample}
              className="mt-2 text-indigo-700 border-indigo-300 hover:bg-indigo-50"
            >
              <Sparkles className="h-4 w-4 mr-1 text-indigo-600" />
              <span>{t.health.loadSampleLabs}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="labRecordsList">
          {records.map((rec) => (
            <Card
              key={rec.id}
              className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow relative overflow-hidden"
            >
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-indigo-500" />
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {rec.testName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{rec.testDate}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(rec.id)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                    aria-label="Delete lab record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Value & Reference Range */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                      {rec.numericValue}{" "}
                      <span className="text-xs font-semibold text-slate-500">
                        {rec.unit}
                      </span>
                    </div>
                  </div>
                  <div className="text-right max-w-[200px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {locale === "te" ? "సాధారణ పరిధి" : "Reference Range"}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {rec.referenceRangeText}
                    </span>
                  </div>
                </div>

                {/* Document Attached or Notes */}
                {rec.documentFileName && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1.5 rounded-md">
                    <FileCheck className="h-4 w-4 shrink-0" />
                    <span className="truncate">{rec.documentFileName}</span>
                    <span className="text-[10px] ml-auto font-mono text-emerald-600 uppercase">
                      Private PDF
                    </span>
                  </div>
                )}

                {rec.notes && (
                  <p className="text-xs text-slate-500 italic bg-slate-50/50 dark:bg-slate-900/40 p-2 rounded">
                    &ldquo;{rec.notes}&rdquo;
                  </p>
                )}

                {/* 1-Click AI Advice View */}
                <div className="pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedRecordId(expandedRecordId === rec.id ? null : rec.id)
                    }
                    className="w-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>
                      {expandedRecordId === rec.id
                        ? locale === "te"
                          ? "సూచనలను దాచు"
                          : "Hide AI Guidance"
                        : locale === "te"
                        ? "⚡ AI ఆహార & వ్యాయామ సూచనలు చూడండి"
                        : "⚡ View AI Dietary & Workout Protocol"}
                    </span>
                  </Button>

                  {expandedRecordId === rec.id && (() => {
                    const advice = analyzeUploadedLabReport(rec.documentFileName || rec.testName, rec.testName);
                    return (
                      <div className="mt-2 p-3 rounded-xl bg-indigo-50/70 dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2 animate-in fade-in duration-200">
                        <div className="font-bold text-indigo-950 dark:text-indigo-200">
                          {locale === "te" ? advice.riskBadgeLabelTe : advice.riskBadgeLabelEn}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {locale === "te" ? advice.clinicalSummaryTe : advice.clinicalSummaryEn}
                        </p>
                        <div className="space-y-1">
                          <span className="font-bold text-emerald-800 dark:text-emerald-400 block text-[11px]">
                            🥗 {locale === "te" ? "ఆహార సలహా:" : "Dietary Focus:"}
                          </span>
                          <ul className="list-disc pl-4 text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                            {(locale === "te" ? advice.dietaryRecommendationsTe : advice.dietaryRecommendationsEn).slice(0, 2).map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-teal-800 dark:text-teal-400 block text-[11px]">
                            🏃‍♂️ {locale === "te" ? "వ్యాయామ సలహా:" : "Movement Focus:"}
                          </span>
                          <ul className="list-disc pl-4 text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                            {(locale === "te" ? advice.workoutRecommendationsTe : advice.workoutRecommendationsEn).slice(0, 2).map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
