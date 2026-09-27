"use client";

import { useBeis } from "@/lib/beis/context";
import { EVENT_TYPE_LABELS } from "@/lib/beis/field-config";
import { Field, NumberField, PageHeader, SectionCard, TextField, WizardFooter } from "./shared";

export function EventProfileStep() {
  const { app, update, goNext, goBack, markComplete } = useBeis();
  const ep = app.eventProfile;

  function setEp<K extends keyof typeof ep>(key: K, value: (typeof ep)[K]) {
    update("eventProfile", { ...ep, [key]: value });
  }

  function handleContinue() {
    markComplete("profile");
    goNext();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader
        eyebrow="Section 3 of 8"
        title="Event profile"
        description={`Additional statistics required for ${app.eventType ? EVENT_TYPE_LABELS[app.eventType] : "this event type"} applications.`}
      />

      <SectionCard title="Exhibition statistics">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Year of event">
              <TextField value={ep.yearOfEvent} onChange={(v) => setEp("yearOfEvent", v.replace(/\D/g, ""))} placeholder="2027" />
            </Field>
            <Field label="Destination of previous edition" hint="Where the previous edition of this event was held, if applicable.">
              <TextField value={ep.previousEditionDestination} onChange={(v) => setEp("previousEditionDestination", v)} placeholder="e.g. Singapore (2025 edition)" />
            </Field>
          </div>

          <div>
            <h3 className="mb-3 text-body-md font-medium text-zinc-900">Gross exhibition space</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Indoor">
                <NumberField value={ep.grossSpaceIndoor} onChange={(v) => setEp("grossSpaceIndoor", v)} suffix="sqm" />
              </Field>
              <Field label="Outdoor">
                <NumberField value={ep.grossSpaceOutdoor} onChange={(v) => setEp("grossSpaceOutdoor", v)} suffix="sqm" />
              </Field>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-body-md font-medium text-zinc-900">Net exhibition space</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Indoor">
                <NumberField value={ep.netSpaceIndoor} onChange={(v) => setEp("netSpaceIndoor", v)} suffix="sqm" />
              </Field>
              <Field label="Outdoor">
                <NumberField value={ep.netSpaceOutdoor} onChange={(v) => setEp("netSpaceOutdoor", v)} suffix="sqm" />
              </Field>
            </div>
          </div>

          <Field label="Total number of exhibitors">
            <NumberField value={ep.totalExhibitors} onChange={(v) => setEp("totalExhibitors", v)} />
          </Field>
        </div>
      </SectionCard>

      <WizardFooter onBack={goBack} onNext={handleContinue} />
    </div>
  );
}
