"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useBeis } from "@/lib/beis/context";
import { DOCUMENT_REQUIREMENTS } from "@/lib/beis/field-config";
import { InfoAlert, PageHeader, SectionCard, WizardFooter } from "./shared";
import { FileText, Upload, X } from "lucide-react";

export function DocumentsStep() {
  const { app, update, goNext, goBack, markComplete } = useBeis();
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const requirements = DOCUMENT_REQUIREMENTS.filter((d) => d.applies(app));

  function handleUpload(key: string, file: File | undefined) {
    if (!file) return;
    update("documents", {
      uploads: {
        ...app.documents.uploads,
        [key]: {
          id: key,
          fileName: file.name,
          uploadedAt: new Intl.DateTimeFormat("en-SG", { dateStyle: "medium", timeZone: "Asia/Singapore" }).format(new Date()),
        },
      },
    });
  }

  function handleRemove(key: string) {
    const uploads = { ...app.documents.uploads };
    uploads[key] = null;
    update("documents", { uploads });
  }

  function handleContinue() {
    markComplete("documents");
    goNext();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader
        eyebrow="Section 6 of 8"
        title="Supporting documents"
        description="Upload the documents below to support your application. Requirements are based on the answers you have given so far."
      />

      <div className="mb-6">
        <InfoAlert variant="info" title="Quotations">
          At least one supplier quotation is required at application to substantiate your projected costs.
        </InfoAlert>
      </div>

      <div className="space-y-4">
        {requirements.map((doc) => {
          const upload = app.documents.uploads[doc.key];
          return (
            <SectionCard key={doc.key}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                  <div>
                    <h3 className="text-body-md font-semibold text-zinc-900">{doc.name}</h3>
                    <p className="mt-0.5 text-body-sm text-zinc-500">{doc.reason}</p>
                    {upload && (
                      <p className="mt-2 text-body-sm text-emerald-700">
                        Uploaded: {upload.fileName} · {upload.uploadedAt}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <input
                    ref={(el) => { fileInputs.current[doc.key] = el; }}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUpload(doc.key, e.target.files?.[0])}
                  />
                  <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => fileInputs.current[doc.key]?.click()}>
                    <Upload className="h-4 w-4" /> {upload ? "Replace" : "Upload document"}
                  </Button>
                  {upload && (
                    <Button variant="ghost" size="sm" aria-label="Remove document" className="cursor-pointer text-zinc-400 hover:text-red-600" onClick={() => handleRemove(doc.key)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <WizardFooter onBack={goBack} onNext={handleContinue} />
    </div>
  );
}
