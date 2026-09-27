"use client";

import { ReactNode } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useBeis } from "@/lib/beis/context";
import { SECTIONS, STEP_SECTIONS } from "@/lib/beis/field-config";

export function PageHeader({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <div className="sgds:mb-8">
      {eyebrow && (
        <p className="sgds:mb-1 sgds:text-body-sm sgds:font-medium sgds:text-primary-600 sgds:uppercase sgds:tracking-wide">
          {eyebrow}
        </p>
      )}
      <h1 className="sgds:text-heading-lg sgds:font-semibold sgds:text-zinc-900">{title}</h1>
      {description && (
        <p className="sgds:mt-2 sgds:max-w-2xl sgds:text-body-md sgds:text-zinc-600">{description}</p>
      )}
    </div>
  );
}

export function SectionCard({ title, description, children, className }: { title?: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-white p-6 shadow-sm", className)}>
      {title && <h2 className="text-heading-sm font-semibold text-zinc-900">{title}</h2>}
      {description && <p className="mt-1 text-body-sm text-zinc-500">{description}</p>}
      <div className={title ? "mt-5" : undefined}>{children}</div>
    </div>
  );
}

export function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-body-sm font-medium text-zinc-800">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      {hint && <p className="text-body-sm text-zinc-500">{hint}</p>}
      {children}
      {error && <p className="text-body-sm text-red-600">{error}</p>}
    </div>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return <Input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function NumberField({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="numeric"
        value={value}
        placeholder={placeholder ?? "0"}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
        className={suffix ? "pr-14" : undefined}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-body-sm text-zinc-400">{suffix}</span>
      )}
    </div>
  );
}

export function CurrencyField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-sm text-zinc-400">$</span>
      <Input
        type="text"
        inputMode="decimal"
        value={value}
        placeholder="0.00"
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
        className="pl-7"
      />
    </div>
  );
}

export function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return <Textarea value={value} placeholder={placeholder} rows={rows} onChange={(e) => onChange(e.target.value)} />;
}

export function InfoAlert({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "success" | "danger" | "warning" | "neutral";
  title?: string;
  children: ReactNode;
}) {
  const iconName =
    variant === "success"
      ? "check-circle-fill"
      : variant === "danger"
      ? "exclamation-circle-fill"
      : variant === "warning"
      ? "exclamation-triangle-fill"
      : "info-circle-fill";
  return (
    <sgds-alert show variant={variant} title={title}>
      <sgds-icon slot="icon" name={iconName} size="md"></sgds-icon>
      {children}
    </sgds-alert>
  );
}

export function YesNoToggle({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={cn(
          "rounded-md border px-5 py-2 text-body-sm font-medium transition-colors cursor-pointer",
          value === true
            ? "border-primary-600 bg-primary-50 text-primary-700"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
        )}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cn(
          "rounded-md border px-5 py-2 text-body-sm font-medium transition-colors cursor-pointer",
          value === false
            ? "border-primary-600 bg-primary-50 text-primary-700"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
        )}
      >
        No
      </button>
    </div>
  );
}

export function WizardFooter({
  onBack,
  onNext,
  nextLabel = "Save and continue",
  backLabel = "Back",
  hideBack = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  hideBack?: boolean;
}) {
  const { saveDraft } = useBeis();
  return (
    <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center">
      <div>
        {!hideBack && (
          <sgds-button variant="ghost" ariaLabel={backLabel} onClick={onBack}>
            <sgds-icon slot="leftIcon" name="arrow-left"></sgds-icon>
            {backLabel}
          </sgds-button>
        )}
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <sgds-button variant="outline" ariaLabel="Save as draft" onClick={() => { saveDraft(); toast.success("Draft saved"); }}>
          Save as draft
        </sgds-button>
        <sgds-button variant="primary" ariaLabel={nextLabel} type="button" onClick={onNext}>
          {nextLabel}
          <sgds-icon slot="rightIcon" name="arrow-right"></sgds-icon>
        </sgds-button>
      </div>
    </div>
  );
}

export function StepNav() {
  const { section, goTo, completedSections, app } = useBeis();
  const steps = STEP_SECTIONS.filter((s) => {
    if (s === "profile") return app.eventType === "exhibition" || app.eventType === "trade-conference";
    return true;
  });
  return (
    <nav aria-label="Application progress" className="mb-8">
      <ol className="flex flex-wrap gap-2">
        {steps.map((key, idx) => {
          const meta = SECTIONS.find((s) => s.key === key)!;
          const isCurrent = section === key;
          const isDone = completedSections.has(key);
          const isClickable = isDone || isCurrent;
          return (
            <li key={key}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && goTo(key)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-body-sm font-medium transition-colors",
                  isCurrent
                    ? "border-primary-600 bg-primary-600 text-white"
                    : isDone
                    ? "border-primary-200 bg-primary-50 text-primary-700 cursor-pointer hover:bg-primary-100"
                    : "border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                    isCurrent ? "bg-white/20" : isDone ? "bg-primary-600 text-white" : "bg-zinc-200"
                  )}
                >
                  {isDone && !isCurrent ? "✓" : idx + 1}
                </span>
                {meta.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ReviewRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-zinc-100 py-2.5 last:border-0 sm:flex-row sm:justify-between sm:gap-6">
      <span className="text-body-sm text-zinc-500">{label}</span>
      <span className="text-body-sm font-medium text-zinc-900 sm:text-right">{value || <span className="text-zinc-400">Not provided</span>}</span>
    </div>
  );
}
