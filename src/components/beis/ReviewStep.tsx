"use client";

import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useBeis } from "@/lib/beis/context";
import {
  attendeeTotals,
  eventDurationDays,
  formatDateSg,
  formatSgd,
  meetsMinimumForeignThreshold,
  totalProjectCosts,
} from "@/lib/beis/calculations";
import { COST_CATEGORIES, EVENT_TYPE_LABELS, STEP_SECTIONS, SUPPORT_TYPE_OPTIONS } from "@/lib/beis/field-config";
import type { SectionKey } from "@/lib/beis/types";
import { InfoAlert, PageHeader, ReviewRow, SectionCard } from "./shared";

const REQUIRED_SECTIONS: SectionKey[] = STEP_SECTIONS.filter((s) => s !== "review");

export function ReviewStep() {
  const { app, update, goTo, completedSections, goBack, saveDraft, formMode } = useBeis();
  const org = app.organisation;
  const pe = app.projectEvent;
  const duration = eventDurationDays(pe.startDate, pe.endDate);
  const totals = attendeeTotals(app.attendees);
  const totalCosts = totalProjectCosts(app.costs);
  const supportLabel = SUPPORT_TYPE_OPTIONS.find((o) => o.value === app.supportType)?.title ?? "";
  const meetsThreshold = meetsMinimumForeignThreshold(app);

  const sectionsToShow = REQUIRED_SECTIONS.filter((s) => {
    if (s === "profile") return app.eventType === "exhibition" || app.eventType === "trade-conference";
    return true;
  });
  const isSectionDone = (s: SectionKey) => formMode === "long" || completedSections.has(s);
  const allComplete = formMode === "long" || sectionsToShow.every((s) => completedSections.has(s));

  function handleSubmit() {
    if (!app.declarations.confirmed || !allComplete) return;
    update("submitted", true);
    update("submittedAt", new Intl.DateTimeFormat("en-SG", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Singapore" }).format(new Date()));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader eyebrow="Section 8 of 8" title="Review your application" description="Check the details below before submitting. You can edit any section." />

      {!meetsThreshold && app.supportType === "secure-events" && (
        <div className="mb-6">
          <InfoAlert variant="warning" title="Foreign participation below usual criterion">
            Based on the information provided, this project may not meet the usual BEiS criterion for foreign
            participation. You can still continue your application — STB may require further justification.
          </InfoAlert>
        </div>
      )}

      <div className="space-y-3">
        <ReviewSectionBlock title="Organisation" complete={isSectionDone("organisation")} onEdit={() => goTo("organisation")}>
          <ReviewRow label="Organisation name" value={org.organisationName} />
          <ReviewRow label="UEN" value={org.uen} />
          <ReviewRow label="Country of incorporation" value={org.countryOfIncorporation} />
          <ReviewRow label="Contact person" value={org.contact.name ? `${org.contact.name} (${org.contact.designation})` : ""} />
          <ReviewRow label="Key executives" value={`${org.keyExecutives.length} added`} />
          <ReviewRow label="Board of directors" value={`${org.boardOfDirectors.length} added`} />
        </ReviewSectionBlock>

        <ReviewSectionBlock title="Project / event" complete={isSectionDone("project")} onEdit={() => goTo("project")}>
          <ReviewRow label="Type of support" value={supportLabel} />
          <ReviewRow label="Event type" value={app.eventType ? EVENT_TYPE_LABELS[app.eventType] : ""} />
          <ReviewRow label="Title" value={pe.title} />
          <ReviewRow label="Dates" value={pe.startDate && pe.endDate ? `${formatDateSg(pe.startDate)} – ${formatDateSg(pe.endDate)}` : ""} />
          <ReviewRow label="Duration" value={duration ? `${duration} day${duration === 1 ? "" : "s"}` : ""} />
        </ReviewSectionBlock>

        {sectionsToShow.includes("profile") && (
          <ReviewSectionBlock title="Event profile" complete={isSectionDone("profile")} onEdit={() => goTo("profile")}>
            <ReviewRow label="Year of event" value={app.eventProfile.yearOfEvent} />
            <ReviewRow label="Total exhibitors" value={app.eventProfile.totalExhibitors} />
          </ReviewSectionBlock>
        )}

        <ReviewSectionBlock title="Attendees" complete={isSectionDone("attendees")} onEdit={() => goTo("attendees")}>
          <ReviewRow label="Total attendees" value={totals.totalAttendees.toLocaleString("en-SG")} />
          <ReviewRow label="Foreign participants" value={`${totals.foreignPercent.toFixed(1)}%`} />
        </ReviewSectionBlock>

        <ReviewSectionBlock title="Project costs" complete={isSectionDone("costs")} onEdit={() => goTo("costs")}>
          <ReviewRow label="Cost items" value={`${app.costs.length} added`} />
          <ReviewRow label="Estimated total project costs" value={formatSgd(totalCosts)} />
          {app.costs.slice(0, 3).map((c) => (
            <ReviewRow key={c.id} label={COST_CATEGORIES.find((cat) => cat.key === c.categoryKey)?.label ?? ""} value={formatSgd(Number(c.amount || 0))} />
          ))}
        </ReviewSectionBlock>

        <ReviewSectionBlock title="Supporting documents" complete={isSectionDone("documents")} onEdit={() => goTo("documents")}>
          <ReviewRow label="Documents uploaded" value={`${Object.values(app.documents.uploads).filter(Boolean).length} uploaded`} />
        </ReviewSectionBlock>

        <ReviewSectionBlock title="Declarations" complete={isSectionDone("declarations")} onEdit={() => goTo("declarations")}>
          <ReviewRow label="Authorised by" value={app.declarations.authorisation.name} />
          <ReviewRow label="Criminal proceedings" value={app.declarations.criminalProceedings.answer === null ? "" : app.declarations.criminalProceedings.answer ? "Yes" : "No"} />
          <ReviewRow label="Other grants received" value={app.declarations.otherGrants.answer === null ? "" : app.declarations.otherGrants.answer ? "Yes" : "No"} />
        </ReviewSectionBlock>
      </div>

      {!allComplete && (
        <div className="mt-6">
          <InfoAlert variant="warning" title="Incomplete sections">
            Please complete every section above before submitting your application.
          </InfoAlert>
        </div>
      )}

      <SectionCard className="mt-6">
        <label className="flex items-start gap-3">
          <Checkbox checked={app.declarations.confirmed} onCheckedChange={(v) => update("declarations", { ...app.declarations, confirmed: v === true })} className="mt-0.5" />
          <span className="text-body-sm text-zinc-700">
            I confirm that the information provided in this application is accurate to the best of my knowledge.
          </span>
        </label>
      </SectionCard>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center">
        <sgds-button variant="ghost" ariaLabel="Back" onClick={goBack}>
          <sgds-icon slot="leftIcon" name="arrow-left"></sgds-icon>
          Back
        </sgds-button>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <sgds-button variant="outline" ariaLabel="Save as draft" onClick={() => { saveDraft(); toast.success("Draft saved"); }}>
            Save as draft
          </sgds-button>
          <sgds-button
            variant="primary"
            ariaLabel="Submit application"
            disabled={!app.declarations.confirmed || !allComplete}
            onClick={handleSubmit}
          >
            Submit application
          </sgds-button>
        </div>
      </div>
    </div>
  );
}

function ReviewSectionBlock({
  title,
  complete,
  onEdit,
  children,
}: {
  title: string;
  complete: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <SectionCard>
      <div className="flex items-center justify-between">
        <h2 className="text-body-lg font-semibold text-zinc-900">{title}</h2>
        <div className="flex items-center gap-3">
          <sgds-badge variant={complete ? "success" : "warning"} outlined>
            {complete ? "Completed" : "Incomplete"}
          </sgds-badge>
          <sgds-button variant="ghost" size="sm" ariaLabel={`Edit ${title}`} onClick={onEdit}>
            Edit
          </sgds-button>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </SectionCard>
  );
}
