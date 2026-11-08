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

      // Auto-populate test name if empty
      if (!testName) {
        setTestName(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
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
              <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <Label htmlFor="docUpload" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Upload className="h-4 w-4 text-emerald-600" />
                  <span>{t.health.uploadReport}</span>
                </Label>
                <Input
                  id="docUpload"
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileUpload}
                  className="mt-2 text-xs"
                />
                {isUploading && (
                  <p className="mt-1 text-xs text-indigo-600 animate-pulse">{t.health.uploading}</p>
                )}
                {lastUploadedDoc && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded">
                    <FileCheck className="h-4 w-4 shrink-0" />
                    <span>{lastUploadedDoc} attached ({t.health.uploadSuccess})</span>
                  </div>
                )}
              </div>

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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
