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
import { StepNav } from "@/components/beis/shared";

function WizardBody() {
  const { app, section, reset } = useBeis();

  if (app.submitted) {
    return <ConfirmationStep />;
  }

  const showStepNav = section !== "start" && section !== "path";

  return (
    <div className="bg-white pb-16">
      {showStepNav && (
        <div className="mx-auto max-w-4xl px-6 pt-8 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between">
            <StepNav />
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
      {section === "organisation" && <OrganisationStep />}
      {section === "project" && <ProjectEventStep />}
      {section === "profile" && <EventProfileStep />}
      {section === "attendees" && <AttendeesStep />}
      {section === "costs" && <CostsStep />}
      {section === "documents" && <DocumentsStep />}
      {section === "declarations" && <DeclarationsStep />}
      {section === "review" && <ReviewStep />}
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
