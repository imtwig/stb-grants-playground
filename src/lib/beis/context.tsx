"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { BeisApplication, SectionKey } from "./types";
import { createEmptyApplication, createSampleApplication } from "./mock-data";
import { STEP_SECTIONS } from "./field-config";

export type FormMode = "stepper" | "long";

interface BeisContextValue {
  app: BeisApplication;
  setApp: React.Dispatch<React.SetStateAction<BeisApplication>>;
  update: <K extends keyof BeisApplication>(key: K, value: BeisApplication[K]) => void;
  section: SectionKey;
  goTo: (section: SectionKey) => void;
  goNext: () => void;
  goBack: () => void;
  completedSections: Set<SectionKey>;
  markComplete: (section: SectionKey) => void;
  loadSample: () => void;
  reset: () => void;
  draftSavedAt: string | null;
  saveDraft: () => void;
  formMode: FormMode;
  setFormMode: (mode: FormMode) => void;
}

const BeisContext = createContext<BeisContextValue | null>(null);

const SECTION_ORDER: SectionKey[] = [
  "start", "path", "organisation", "project", "profile", "attendees", "costs", "documents", "declarations", "review",
];

export function BeisProvider({ children }: { children: React.ReactNode }) {
  const [app, setApp] = useState<BeisApplication>(() => createEmptyApplication());
  const [section, setSection] = useState<SectionKey>("start");
  const [completedSections, setCompletedSections] = useState<Set<SectionKey>>(new Set());
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>("stepper");

  const update = useCallback(<K extends keyof BeisApplication>(key: K, value: BeisApplication[K]) => {
    setApp((prev) => ({ ...prev, [key]: value }));
  }, []);

  const goTo = useCallback((s: SectionKey) => {
    setSection(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const relevantOrder = useMemo(() => {
    // Skip Event Profile step entirely unless the applicant's event type actually needs it.
    return SECTION_ORDER.filter((s) => {
      if (s === "profile") return app.eventType === "exhibition" || app.eventType === "trade-conference";
      return true;
    });
  }, [app.eventType]);

  const goNext = useCallback(() => {
    const idx = relevantOrder.indexOf(section);
    if (idx >= 0 && idx < relevantOrder.length - 1) {
      goTo(relevantOrder[idx + 1]);
    }
  }, [relevantOrder, section, goTo]);

  const goBack = useCallback(() => {
    const idx = relevantOrder.indexOf(section);
    if (idx > 0) {
      goTo(relevantOrder[idx - 1]);
    }
  }, [relevantOrder, section, goTo]);

  const markComplete = useCallback((s: SectionKey) => {
    setCompletedSections((prev) => new Set(prev).add(s));
  }, []);

  const loadSample = useCallback(() => {
    setApp(createSampleApplication());
    setCompletedSections(new Set(STEP_SECTIONS.filter((s) => s !== "review")));
  }, []);

  const reset = useCallback(() => {
    setApp(createEmptyApplication());
    setCompletedSections(new Set());
    setDraftSavedAt(null);
    setSection("start");
  }, []);

  const saveDraft = useCallback(() => {
    setDraftSavedAt(
      new Intl.DateTimeFormat("en-SG", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Singapore" }).format(new Date())
    );
  }, []);

  const value: BeisContextValue = {
    app, setApp, update, section, goTo, goNext, goBack,
    completedSections, markComplete, loadSample, reset, draftSavedAt, saveDraft,
    formMode, setFormMode,
  };

  return <BeisContext.Provider value={value}>{children}</BeisContext.Provider>;
}

export function useBeis() {
  const ctx = useContext(BeisContext);
  if (!ctx) throw new Error("useBeis must be used within BeisProvider");
  return ctx;
}
