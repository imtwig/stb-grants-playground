"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBeis } from "@/lib/beis/context";
import { lookupUenMock } from "@/lib/beis/mock-data";
import type { KeyPerson, Shareholder } from "@/lib/beis/types";
import { CountryCodeField, Field, InfoAlert, PageHeader, SectionCard, TextAreaField, TextField, WizardFooter } from "./shared";
import { Plus, Trash2 } from "lucide-react";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function PersonRows({
  rows,
  onChange,
  roleLabel,
}: {
  rows: KeyPerson[];
  onChange: (rows: KeyPerson[]) => void;
  roleLabel: string;
}) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 p-4 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
          <TextField value={row.name} onChange={(v) => onChange(rows.map((r) => (r.id === row.id ? { ...r, name: v } : r)))} placeholder="Full name" />
          <TextField value={row.idNumber} onChange={(v) => onChange(rows.map((r) => (r.id === row.id ? { ...r, idNumber: v } : r)))} placeholder="NRIC / FIN / passport" />
          <TextField value={row.nationality} onChange={(v) => onChange(rows.map((r) => (r.id === row.id ? { ...r, nationality: v } : r)))} placeholder="Nationality" />
          <TextField value={row.role} onChange={(v) => onChange(rows.map((r) => (r.id === row.id ? { ...r, role: v } : r)))} placeholder={roleLabel} />
          <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => onChange(rows.filter((r) => r.id !== row.id))} className="cursor-pointer text-zinc-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => onChange([...rows, { id: uid(), name: "", idNumber: "", nationality: "", role: "" }])}
      >
        <Plus className="h-4 w-4" /> Add person
      </Button>
    </div>
  );
}

function ShareholderRows({ rows, onChange }: { rows: Shareholder[]; onChange: (rows: Shareholder[]) => void }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 p-4 sm:grid-cols-[1.4fr_1fr_1fr_0.7fr_auto]">
          <TextField value={row.name} onChange={(v) => onChange(rows.map((r) => (r.id === row.id ? { ...r, name: v } : r)))} placeholder="Shareholder name" />
          <TextField value={row.idNumber} onChange={(v) => onChange(rows.map((r) => (r.id === row.id ? { ...r, idNumber: v } : r)))} placeholder="NRIC / UEN" />
          <TextField value={row.nationality} onChange={(v) => onChange(rows.map((r) => (r.id === row.id ? { ...r, nationality: v } : r)))} placeholder="Nationality / country" />
          <TextField value={row.shareholdingPercent} onChange={(v) => onChange(rows.map((r) => (r.id === row.id ? { ...r, shareholdingPercent: v.replace(/[^\d.]/g, "") } : r)))} placeholder="% held" />
          <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => onChange(rows.filter((r) => r.id !== row.id))} className="cursor-pointer text-zinc-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => onChange([...rows, { id: uid(), name: "", idNumber: "", nationality: "", shareholdingPercent: "" }])}
      >
        <Plus className="h-4 w-4" /> Add shareholder
      </Button>
    </div>
  );
}

export function OrganisationStep() {
  const { app, update, goNext, goBack, markComplete } = useBeis();
  const org = app.organisation;
  const [uenInput, setUenInput] = useState(org.uen);
  const [looking, setLooking] = useState(false);

  const showKeyShareholders = !(
    app.eventType === "association-convention" ||
    app.eventType === "meeting" ||
    app.eventType === "incentive-travel"
  );

  function setOrg<K extends keyof typeof org>(key: K, value: (typeof org)[K]) {
    update("organisation", { ...org, [key]: value });
  }

  function handleRetrieve() {
    setLooking(true);
    setTimeout(() => {
      const result = lookupUenMock(uenInput);
      if (result) {
        update("organisation", {
          ...org,
          uen: uenInput,
          retrieved: true,
          organisationName: result.organisationName,
          address: result.address,
          businessDescription: result.businessDescription,
          countryOfIncorporation: result.countryOfIncorporation,
        });
      }
      setLooking(false);
    }, 600);
  }

  function handleContinue() {
    markComplete("organisation");
    goNext();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader
        eyebrow="Section 1 of 8"
        title="Tell us about your organisation"
        description="Enter your UEN and we will retrieve details STB already has on file, so you do not need to re-enter them."
      />

      <SectionCard title="Organisation details">
        <div className="space-y-5">
          <Field label="UEN / company registration number" required>
            <div className="flex gap-2">
              <div className="flex-1">
                <TextField value={uenInput} onChange={setUenInput} placeholder="e.g. 201812345K" />
              </div>
              <Button onClick={handleRetrieve} disabled={!uenInput || looking} className="cursor-pointer shrink-0">
                {looking ? "Retrieving…" : "Retrieve details"}
              </Button>
            </div>
          </Field>

          {org.retrieved && (
            <InfoAlert variant="success" title="Details retrieved">
              We found this organisation on file. Review the information below and edit anything
              that has changed.
            </InfoAlert>
          )}

          <Field label="Organisation name" required>
            <TextField value={org.organisationName} onChange={(v) => setOrg("organisationName", v)} placeholder="e.g. Meridian Exhibitions Pte Ltd" />
          </Field>

          <Field label="Country of incorporation" required>
            <TextField value={org.countryOfIncorporation} onChange={(v) => setOrg("countryOfIncorporation", v)} placeholder="e.g. Singapore" />
          </Field>

          <Field label="Organisation address" required>
            <TextAreaField value={org.address} onChange={(v) => setOrg("address", v)} rows={2} placeholder="Block/street, unit number, Singapore postal code" />
          </Field>

          <Field label="Brief description of organisation" hint="Principal business activities, in a sentence or two." required>
            <TextAreaField value={org.businessDescription} onChange={(v) => setOrg("businessDescription", v)} rows={3} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Contact person" description="The main point of contact for this application." className="mt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" required>
            <TextField value={org.contact.name} onChange={(v) => setOrg("contact", { ...org.contact, name: v })} placeholder="e.g. Priya Nair" />
          </Field>
          <Field label="Designation" required>
            <TextField value={org.contact.designation} onChange={(v) => setOrg("contact", { ...org.contact, designation: v })} placeholder="e.g. Finance Director" />
          </Field>
          <Field label="Phone number" required>
            <div className="flex gap-2">
              <div className="w-28 shrink-0">
                <CountryCodeField value={org.contact.countryCode} onChange={(v) => setOrg("contact", { ...org.contact, countryCode: v })} />
              </div>
              <div className="flex-1">
                <TextField value={org.contact.phone} onChange={(v) => setOrg("contact", { ...org.contact, phone: v })} placeholder="9123 4567" />
              </div>
            </div>
          </Field>
          <Field label="Email" required>
            <TextField type="email" value={org.contact.email} onChange={(v) => setOrg("contact", { ...org.contact, email: v })} placeholder="name@organisation.com.sg" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Organisation due diligence" description="Required so STB can assess the applicant organisation." className="mt-6">
        <div className="space-y-8">
          <div>
            <h3 className="text-body-md font-medium text-zinc-900">Key executives</h3>
            <p className="mb-3 text-body-sm text-zinc-500">Directors and senior management involved in this project.</p>
            <PersonRows rows={org.keyExecutives} onChange={(rows) => setOrg("keyExecutives", rows)} roleLabel="Position" />
          </div>

          <div>
            <h3 className="text-body-md font-medium text-zinc-900">Board of directors</h3>
            <p className="mb-3 text-body-sm text-zinc-500">All current directors of the organisation.</p>
            <PersonRows rows={org.boardOfDirectors} onChange={(rows) => setOrg("boardOfDirectors", rows)} roleLabel="Directorship" />
          </div>

          {showKeyShareholders && (
            <div>
              <h3 className="text-body-md font-medium text-zinc-900">Key shareholders</h3>
              <p className="mb-3 text-body-sm text-zinc-500">Shareholders holding a significant stake in the organisation.</p>
              <ShareholderRows rows={org.keyShareholders} onChange={(rows) => setOrg("keyShareholders", rows)} />
            </div>
          )}

          <div>
            <h3 className="text-body-md font-medium text-zinc-900">Organisation financial information</h3>
            <p className="mb-3 text-body-sm text-zinc-500">Figures from your most recent financial year.</p>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Revenue (last FY)">
                <TextField value={org.financialInfo.lastFYRevenue} onChange={(v) => setOrg("financialInfo", { ...org.financialInfo, lastFYRevenue: v.replace(/[^\d.]/g, "") })} placeholder="0.00" />
              </Field>
              <Field label="Net profit (last FY)">
                <TextField value={org.financialInfo.lastFYNetProfit} onChange={(v) => setOrg("financialInfo", { ...org.financialInfo, lastFYNetProfit: v.replace(/[^\d.-]/g, "") })} placeholder="0.00" />
              </Field>
              <Field label="Paid-up capital">
                <TextField value={org.financialInfo.paidUpCapital} onChange={(v) => setOrg("financialInfo", { ...org.financialInfo, paidUpCapital: v.replace(/[^\d.]/g, "") })} placeholder="0.00" />
              </Field>
            </div>
          </div>
        </div>
      </SectionCard>

      <WizardFooter onBack={goBack} onNext={handleContinue} />
    </div>
  );
}
