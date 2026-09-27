"use client";

import { useBeis } from "@/lib/beis/context";
import type { YesNoDetail } from "@/lib/beis/types";
import { DateField, Field, PageHeader, SectionCard, TextAreaField, TextField, WizardFooter, YesNoToggle } from "./shared";

function YesNoBlock({
  question,
  value,
  onChange,
  detailFields,
}: {
  question: string;
  value: YesNoDetail;
  onChange: (v: YesNoDetail) => void;
  detailFields: React.ReactNode;
}) {
  return (
    <SectionCard>
      <Field label={question}>
        <YesNoToggle value={value.answer} onChange={(answer) => onChange({ ...value, answer })} />
      </Field>
      {value.answer === true && <div className="mt-5 space-y-4 border-t border-zinc-100 pt-5">{detailFields}</div>}
    </SectionCard>
  );
}

export function DeclarationsStep() {
  const { app, update, goNext, goBack, markComplete } = useBeis();
  const d = app.declarations;

  function setD<K extends keyof typeof d>(key: K, value: (typeof d)[K]) {
    update("declarations", { ...d, [key]: value });
  }

  function handleContinue() {
    markComplete("declarations");
    goNext();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader
        eyebrow="Section 7 of 8"
        title="Declarations"
        description="Answer each question below. Follow-up details only appear if relevant."
      />

      <div className="space-y-5">
        <YesNoBlock
          question="Has the organisation or any relevant party been involved in criminal proceedings or convictions?"
          value={d.criminalProceedings}
          onChange={(v) => setD("criminalProceedings", v)}
          detailFields={
            <>
              <Field label="Country"><TextField value={d.criminalProceedings.country ?? ""} onChange={(v) => setD("criminalProceedings", { ...d.criminalProceedings, country: v })} /></Field>
              <Field label="Details"><TextAreaField value={d.criminalProceedings.details ?? ""} onChange={(v) => setD("criminalProceedings", { ...d.criminalProceedings, details: v })} rows={2} /></Field>
              <Field label="Status"><TextField value={d.criminalProceedings.status ?? ""} onChange={(v) => setD("criminalProceedings", { ...d.criminalProceedings, status: v })} placeholder="e.g. Concluded, ongoing" /></Field>
            </>
          }
        />

        <YesNoBlock
          question="Has the organisation or any relevant party been involved in civil suits or proceedings?"
          value={d.civilSuits}
          onChange={(v) => setD("civilSuits", v)}
          detailFields={
            <>
              <Field label="Country"><TextField value={d.civilSuits.country ?? ""} onChange={(v) => setD("civilSuits", { ...d.civilSuits, country: v })} /></Field>
              <Field label="Details"><TextAreaField value={d.civilSuits.details ?? ""} onChange={(v) => setD("civilSuits", { ...d.civilSuits, details: v })} rows={2} /></Field>
              <Field label="Status"><TextField value={d.civilSuits.status ?? ""} onChange={(v) => setD("civilSuits", { ...d.civilSuits, status: v })} /></Field>
            </>
          }
        />

        <YesNoBlock
          question="Has the organisation or any relevant party been subject to bankruptcy or judicial management?"
          value={d.bankruptcy}
          onChange={(v) => setD("bankruptcy", v)}
          detailFields={
            <>
              <Field label="Country"><TextField value={d.bankruptcy.country ?? ""} onChange={(v) => setD("bankruptcy", { ...d.bankruptcy, country: v })} /></Field>
              <Field label="Details"><TextAreaField value={d.bankruptcy.details ?? ""} onChange={(v) => setD("bankruptcy", { ...d.bankruptcy, details: v })} rows={2} /></Field>
              <Field label="Status"><TextField value={d.bankruptcy.status ?? ""} onChange={(v) => setD("bankruptcy", { ...d.bankruptcy, status: v })} /></Field>
            </>
          }
        />

        <YesNoBlock
          question="Has the organisation received or applied for any other grants, tax reliefs or financial incentives for this project?"
          value={d.otherGrants}
          onChange={(v) => setD("otherGrants", v)}
          detailFields={
            <>
              <Field label="Agency"><TextField value={d.otherGrants.agency ?? ""} onChange={(v) => setD("otherGrants", { ...d.otherGrants, agency: v })} placeholder="e.g. Enterprise Singapore" /></Field>
              <Field label="Scheme"><TextField value={d.otherGrants.scheme ?? ""} onChange={(v) => setD("otherGrants", { ...d.otherGrants, scheme: v })} /></Field>
              <Field label="Amount"><TextField value={d.otherGrants.amount ?? ""} onChange={(v) => setD("otherGrants", { ...d.otherGrants, amount: v.replace(/[^\d.]/g, "") })} placeholder="0.00" /></Field>
              <Field label="Application status"><TextField value={d.otherGrants.applicationStatus ?? ""} onChange={(v) => setD("otherGrants", { ...d.otherGrants, applicationStatus: v })} /></Field>
            </>
          }
        />

        <YesNoBlock
          question="Does the organisation have any relationships with suppliers or service providers involved in this project?"
          value={d.supplierRelationships}
          onChange={(v) => setD("supplierRelationships", v)}
          detailFields={
            <>
              <Field label="Supplier / service provider"><TextField value={d.supplierRelationships.supplier ?? ""} onChange={(v) => setD("supplierRelationships", { ...d.supplierRelationships, supplier: v })} /></Field>
              <Field label="Relationship to applicant"><TextField value={d.supplierRelationships.relationship ?? ""} onChange={(v) => setD("supplierRelationships", { ...d.supplierRelationships, relationship: v })} /></Field>
              <Field label="Involvement in this project"><TextAreaField value={d.supplierRelationships.involvement ?? ""} onChange={(v) => setD("supplierRelationships", { ...d.supplierRelationships, involvement: v })} rows={2} /></Field>
            </>
          }
        />
      </div>

      <SectionCard title="Applicant declaration and authorisation" className="mt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" required>
            <TextField value={d.authorisation.name} onChange={(v) => setD("authorisation", { ...d.authorisation, name: v })} />
          </Field>
          <Field label="Designation" required>
            <TextField value={d.authorisation.designation} onChange={(v) => setD("authorisation", { ...d.authorisation, designation: v })} />
          </Field>
          <Field label="Telephone" required>
            <TextField value={d.authorisation.phone} onChange={(v) => setD("authorisation", { ...d.authorisation, phone: v })} placeholder="+65 9123 4567" />
          </Field>
          <Field label="Email" required>
            <TextField type="email" value={d.authorisation.email} onChange={(v) => setD("authorisation", { ...d.authorisation, email: v })} />
          </Field>
          <Field label="Date" required>
            <DateField value={d.authorisation.date} onChange={(v) => setD("authorisation", { ...d.authorisation, date: v })} />
          </Field>
        </div>
      </SectionCard>

      <WizardFooter onBack={goBack} onNext={handleContinue} />
    </div>
  );
}
