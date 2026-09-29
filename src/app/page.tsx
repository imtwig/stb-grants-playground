"use client";

import { BeisProvider, useBeis } from "@/lib/beis/context";
import { StartStep, PathStep } from "@/components/beis/StartAndPathSteps";
import { OrganisationStep } from "@/components/beis/OrganisationStep";
import { ProjectEventStep } from "@/components/beis/ProjectEventStep";
import { EventProfileStep } from "@/components/beis/EventProfileStep";
import { AttendeesStep } from "@/components/beis/AttendeesStep";
import { CostsStep } from "@/components/beis/CostsStep";
import { DocumentsStep } from "@/components/beis/DocumentsStep";
import { DeclarationsStep } from "@/components/beis/DeclarationsStep";
import { ReviewStep } from "@/components/beis/ReviewStep";
import { ConfirmationStep } from "@/components/beis/ConfirmationStep";
import { PrototypeBanner, StepNav } from "@/components/beis/shared";

function LongFormBody() {
  const { app } = useBeis();
  const showProfile = app.eventType === "exhibition" || app.eventType === "trade-conference";
  return (
    <div className="mx-auto max-w-3xl px-6 pt-6 sm:px-8 lg:px-0">
      <p className="text-body-sm text-zinc-500">
        All sections are shown on this one page. Fill in what you can, then review and submit at the end.
      </p>
      <div className="[&>div]:!mx-0 [&>div]:!max-w-none [&>div]:!px-0 [&>div]:!py-0 [&>div+div]:mt-10 [&>div+div]:border-t [&>div+div]:border-zinc-200 [&>div+div]:pt-10">
        <OrganisationStep />
        <ProjectEventStep />
        {showProfile && <EventProfileStep />}
        <AttendeesStep />
        <CostsStep />
        <DocumentsStep />
        <DeclarationsStep />
        <div className="mt-10 border-t border-zinc-200 pt-10">
          <ReviewStep />
        </div>
      </div>
    </div>
  );
}

function WizardBody() {
  const { app, section, reset, formMode } = useBeis();

  if (app.submitted) {
    return (
      <div className="bg-white pb-16">
        <PrototypeBanner />
        <ConfirmationStep />
      </div>
    );
  }

  const pastIntro = section !== "start" && section !== "path";
  const showStepNav = pastIntro && formMode === "stepper";

  return (
    <div className="bg-white pb-16">
      <PrototypeBanner />
      {pastIntro && (
        <div className="mx-auto max-w-4xl px-6 pt-8 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between gap-4">
            {showStepNav ? <StepNav /> : <div className="mb-8" />}
            <button
              type="button"
              onClick={reset}
              className="mb-8 shrink-0 cursor-pointer text-body-sm text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline"
            >
              Reset prototype
            </button>
          </div>
        </div>
      )}

      {section === "start" && <StartStep />}
      {section === "path" && <PathStep />}
      {pastIntro && formMode === "long" && <LongFormBody />}
      {pastIntro && formMode === "stepper" && (
        <>
          {section === "organisation" && <OrganisationStep />}
          {section === "project" && <ProjectEventStep />}
          {section === "profile" && <EventProfileStep />}
          {section === "attendees" && <AttendeesStep />}
          {section === "costs" && <CostsStep />}
          {section === "documents" && <DocumentsStep />}
          {section === "declarations" && <DeclarationsStep />}
          {section === "review" && <ReviewStep />}
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <BeisProvider>
      <WizardBody />
    </BeisProvider>
  );
}
