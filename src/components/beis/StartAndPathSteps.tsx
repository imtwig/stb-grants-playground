"use client";

import { useBeis } from "@/lib/beis/context";
import { EVENT_TYPE_OPTIONS, STEP_SECTIONS, SUPPORT_TYPE_OPTIONS } from "@/lib/beis/field-config";
import { cn } from "@/lib/utils";
import { PageHeader } from "./shared";

export function StartStep() {
  const { goTo, loadSample } = useBeis();
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8 lg:px-0">
      <p className="mb-2 text-body-sm font-medium uppercase tracking-wide text-primary-600">
        Singapore Tourism Board
      </p>
      <h1 className="text-heading-xl font-semibold text-zinc-900">
        Apply for Business Events in Singapore (BEiS) support
      </h1>
      <p className="mt-4 max-w-2xl text-body-lg leading-7 text-zinc-600">
        BEiS funding helps organisations bring quality business events to Singapore, or build the
        foundation to do so. This application will ask about:
      </p>

      <ol className="mt-6 space-y-3">
        {[
          "Your organisation",
          "The proposed project or event",
          "Expected attendees and event scale",
          "Project costs",
          "Declarations",
          "Supporting documents",
        ].map((item, i) => (
          <li key={item} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-body-sm font-semibold text-primary-700">
              {i + 1}
            </span>
            <span className="text-body-md text-zinc-800">{item}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-body-sm text-zinc-600">
          This should take about 20–30 minutes. Your progress will be saved as you go, and you can
          return to finish it later.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <sgds-button variant="primary" size="lg" ariaLabel="Start application" onClick={() => goTo("path")}>
          Start application
          <sgds-icon slot="rightIcon" name="arrow-right"></sgds-icon>
        </sgds-button>
        <sgds-button variant="ghost" size="lg" ariaLabel="Load a sample application" onClick={() => { loadSample(); goTo("review"); }}>
          Load sample application
        </sgds-button>
      </div>
    </div>
  );
}

export function PathStep() {
  const { app, update, goTo, markComplete } = useBeis();

  const canContinue = app.supportType && (app.supportType === "build-foundation" || app.eventType);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader
        eyebrow="Before you begin"
        title="What are you seeking support for?"
        description="This determines which questions you will be asked. You will not need to answer questions that do not apply to your project."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {SUPPORT_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update("supportType", opt.value)}
            className={cn(
              "rounded-xl border p-5 text-left transition-colors cursor-pointer",
              app.supportType === opt.value
                ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            )}
          >
            <h3 className="text-body-lg font-semibold text-zinc-900">{opt.title}</h3>
            <p className="mt-1.5 text-body-sm text-zinc-600">{opt.description}</p>
          </button>
        ))}
      </div>

      {app.supportType === "secure-events" && (
        <div className="mt-8">
          <h2 className="text-body-md font-semibold text-zinc-900">What type of event is this?</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("eventType", opt.value)}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left text-body-sm font-medium transition-colors cursor-pointer",
                  app.eventType === opt.value
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {app.supportType === "build-foundation" && (
        <div className="mt-6">
          <sgds-alert show variant="info" title="Build Foundation">
            <sgds-icon slot="icon" name="info-circle-fill" size="md"></sgds-icon>
            Build Foundation activities cover a supplementary set of questions in the Data Schema.
            The sections ahead will reflect this pathway.
          </sgds-alert>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6">
        <sgds-button variant="ghost" ariaLabel="Back to start" onClick={() => goTo("start")}>
          <sgds-icon slot="leftIcon" name="arrow-left"></sgds-icon>
          Back
        </sgds-button>
        <sgds-button
          variant="primary"
          ariaLabel="Continue"
          disabled={!canContinue}
          onClick={() => {
            if (!canContinue) return;
            markComplete("path");
            goTo(STEP_SECTIONS[0]);
          }}
        >
          Continue
          <sgds-icon slot="rightIcon" name="arrow-right"></sgds-icon>
        </sgds-button>
      </div>
    </div>
  );
}
