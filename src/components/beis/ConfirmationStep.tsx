"use client";

import { CheckCircle2 } from "lucide-react";
import { useBeis } from "@/lib/beis/context";

export function ConfirmationStep() {
  const { app, reset } = useBeis();

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:px-8 lg:px-0">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
      </div>
      <h1 className="mt-6 text-heading-lg font-semibold text-zinc-900">Application submitted</h1>
      <p className="mt-3 text-body-md text-zinc-600">
        Thank you. Your BEiS application for{" "}
        <span className="font-medium text-zinc-900">{app.projectEvent.title || "your project"}</span> has been
        received.
      </p>
      {app.submittedAt && <p className="mt-1 text-body-sm text-zinc-500">Submitted on {app.submittedAt}</p>}

      <div className="mx-auto mt-8 max-w-md rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-left">
        <p className="text-body-sm text-zinc-600">
          STB will review your application and may contact your listed contact person,{" "}
          <span className="font-medium text-zinc-800">{app.organisation.contact.name || "your contact person"}</span>,
          for further information.
        </p>
      </div>

      <div className="mt-10">
        <sgds-button variant="outline" ariaLabel="Start a new prototype run" onClick={reset}>
          Reset prototype
        </sgds-button>
      </div>
    </div>
  );
}
