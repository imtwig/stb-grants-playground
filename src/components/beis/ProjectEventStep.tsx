"use client";

import { Button } from "@/components/ui/button";
import { useBeis } from "@/lib/beis/context";
import { eventDurationDays, formatSgd, projectionProfitLoss } from "@/lib/beis/calculations";
import { isExhibitionOrConference } from "@/lib/beis/types";
import { Field, InfoAlert, PageHeader, SectionCard, TextAreaField, TextField, WizardFooter, YesNoToggle, DateField } from "./shared";
import { Plus, Trash2 } from "lucide-react";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ProjectEventStep() {
  const { app, update, goNext, goBack, markComplete } = useBeis();
  const pe = app.projectEvent;
  const duration = eventDurationDays(pe.startDate, pe.endDate);
  const showEventManagementCompany = !isExhibitionOrConference(app.eventType);

  function setPe<K extends keyof typeof pe>(key: K, value: (typeof pe)[K]) {
    update("projectEvent", { ...pe, [key]: value });
  }

  function addProjection() {
    setPe("financialProjections", [...pe.financialProjections, { id: uid(), year: "", expectedRevenue: "", expectedExpenditure: "" }]);
  }

  function handleContinue() {
    markComplete("project");
    goNext();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader
        eyebrow="Section 2 of 8"
        title="Your project or event"
        description="Tell us about the event you are proposing to bring to Singapore."
      />

      <SectionCard title="Event details">
        <div className="space-y-5">
          <Field label="Project / event title" required>
            <TextField value={pe.title} onChange={(v) => setPe("title", v)} placeholder="e.g. Asia Maritime & Logistics Expo 2027" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Event commencement date" required>
              <DateField value={pe.startDate} onChange={(v) => setPe("startDate", v)} />
            </Field>
            <Field label="Event end date" required>
              <DateField value={pe.endDate} onChange={(v) => setPe("endDate", v)} />
            </Field>
          </div>

          {duration !== null && (
            <div className="rounded-md bg-zinc-50 px-4 py-2.5 text-body-sm text-zinc-600">
              Event duration: <span className="font-semibold text-zinc-900">{duration} day{duration === 1 ? "" : "s"}</span> — calculated automatically
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Project / event description" description="Describe your project using the prompts below rather than one long field." className="mt-6">
        <div className="space-y-5">
          <Field label="Target attendee profile and markets" hint="Who are you expecting to attend, and from which international markets?" required>
            <TextAreaField
              value={pe.description.attendeeProfile}
              onChange={(v) => setPe("description", { ...pe.description, attendeeProfile: v })}
              placeholder="e.g. Senior procurement and operations leaders from shipping lines and port operators"
              rows={3}
            />
          </Field>
          <Field label="Target markets / international representation" hint="Which countries or regions are you targeting for overseas participation?">
            <TextAreaField
              value={pe.description.targetMarkets}
              onChange={(v) => setPe("description", { ...pe.description, targetMarkets: v })}
              placeholder="e.g. China, South Korea, Vietnam, Indonesia and the Middle East"
              rows={2}
            />
          </Field>
          <Field label="Key event components" hint="e.g. exhibition floor, conference tracks, awards dinner, hosted buyer programme" required>
            <TextAreaField
              value={pe.description.keyComponents}
              onChange={(v) => setPe("description", { ...pe.description, keyComponents: v })}
              rows={3}
            />
          </Field>
          <Field label="Full programme or itinerary" hint="A day-by-day outline is sufficient at this stage." required>
            <TextAreaField
              value={pe.description.programme}
              onChange={(v) => setPe("description", { ...pe.description, programme: v })}
              rows={4}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Affiliations" className="mt-6">
        <Field label="Parent, affiliated or supporting international organisations or associations" hint="Leave blank if not applicable.">
          <TextAreaField value={pe.affiliatedOrganisations} onChange={(v) => setPe("affiliatedOrganisations", v)} rows={2} placeholder="e.g. Held in partnership with the Asian Shipowners' Association" />
        </Field>
      </SectionCard>

      {showEventManagementCompany && (
        <SectionCard title="Event management" className="mt-6">
          <Field label="Will you engage an event management company, DMC, PCO or handling agent for this project?">
            <YesNoToggle value={pe.hasEventManagementCompany} onChange={(v) => setPe("hasEventManagementCompany", v)} />
          </Field>
          {pe.hasEventManagementCompany && (
            <div className="mt-4">
              <Field label="Name of event management company / DMC / PCO / handling agent">
                <TextField value={pe.eventManagementCompany} onChange={(v) => setPe("eventManagementCompany", v)} placeholder="e.g. Global Expo Management (DMC) Pte Ltd" />
              </Field>
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard title="Marketing and growth plan" className="mt-6">
        <Field label="Do you have a marketing and growth plan for this event?" hint="Applicable for multi-year projects or events with a defined growth strategy.">
          <YesNoToggle value={pe.hasMarketingPlan} onChange={(v) => setPe("hasMarketingPlan", v)} />
        </Field>
        {pe.hasMarketingPlan && (
          <div className="mt-4">
            <Field label="Describe your marketing and growth plan">
              <TextAreaField value={pe.marketingPlan} onChange={(v) => setPe("marketingPlan", v)} rows={3} />
            </Field>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Event financial projection" description="Provide expected revenue and expenditure for each year of the project. Profit or loss is calculated automatically." className="mt-6">
        <div className="space-y-3">
          {pe.financialProjections.map((row) => {
            const pl = projectionProfitLoss(row);
            return (
              <div key={row.id} className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 p-4 sm:grid-cols-[0.7fr_1fr_1fr_1fr_auto] sm:items-end">
                <Field label="Year">
                  <TextField value={row.year} onChange={(v) => setPe("financialProjections", pe.financialProjections.map((r) => (r.id === row.id ? { ...r, year: v.replace(/\D/g, "") } : r)))} placeholder="2027" />
                </Field>
                <Field label="Expected revenue">
                  <TextField value={row.expectedRevenue} onChange={(v) => setPe("financialProjections", pe.financialProjections.map((r) => (r.id === row.id ? { ...r, expectedRevenue: v.replace(/[^\d.]/g, "") } : r)))} placeholder="0.00" />
                </Field>
                <Field label="Expected expenditure">
                  <TextField value={row.expectedExpenditure} onChange={(v) => setPe("financialProjections", pe.financialProjections.map((r) => (r.id === row.id ? { ...r, expectedExpenditure: v.replace(/[^\d.]/g, "") } : r)))} placeholder="0.00" />
                </Field>
                <Field label="Profit / (loss) before tax">
                  <div className={`rounded-md px-3 py-2 text-body-sm font-semibold tabular-nums ${pl >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {formatSgd(pl)}
                  </div>
                </Field>
                <Button variant="ghost" size="icon" aria-label="Remove year" onClick={() => setPe("financialProjections", pe.financialProjections.filter((r) => r.id !== row.id))} className="cursor-pointer text-zinc-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          <Button variant="outline" size="sm" onClick={addProjection} className="cursor-pointer">
            <Plus className="h-4 w-4" /> Add year
          </Button>
        </div>
        {pe.financialProjections.length === 0 && (
          <InfoAlert variant="info">Add at least one year to project revenue and expenditure for this event.</InfoAlert>
        )}
      </SectionCard>

      <WizardFooter onBack={goBack} onNext={handleContinue} />
    </div>
  );
}
