"use client";

import { useBeis } from "@/lib/beis/context";
import { attendeeTotals, formatNumber, tradeConsumerTotals } from "@/lib/beis/calculations";
import { FOREIGN_MARKETS } from "@/lib/beis/field-config";
import { isExhibitionOrConference, isMeetingsIncentive } from "@/lib/beis/types";
import { InfoAlert, NumberField, PageHeader, SectionCard, WizardFooter } from "./shared";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AttendeesStep() {
  const { app, update, goNext, goBack, markComplete } = useBeis();
  const a = app.attendees;
  const totals = attendeeTotals(a);
  const tc = tradeConsumerTotals(a);
  const showTradeConsumer = isExhibitionOrConference(app.eventType);

  function setForeign(key: keyof typeof a.foreignByMarket, value: string) {
    update("attendees", { ...a, foreignByMarket: { ...a.foreignByMarket, [key]: value } });
  }
  function setComposition(key: keyof typeof a.composition, value: string) {
    update("attendees", { ...a, composition: { ...a.composition, [key]: value } });
  }
  function setTradeConsumer(key: keyof typeof a.tradeConsumer, value: string) {
    update("attendees", { ...a, tradeConsumer: { ...a.tradeConsumer, [key]: value } });
  }

  function handleContinue() {
    markComplete("attendees");
    goNext();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader
        eyebrow="Section 4 of 8"
        title="Expected attendees"
        description="Enter your expected attendee numbers by market. Totals and the foreign participation rate are calculated automatically."
      />

      {app.supportType === "secure-events" && (
        <div className="mb-6">
          <InfoAlert variant="info" title="Foreign participation guideline">
            Secure Events generally requires a minimum of 20% foreign participants.
            {isMeetingsIncentive(app.eventType) &&
              " For Meetings & Incentives, this can also be met with a minimum 2 nights' stay, 100% top performers, or minimum 50% foreign senior participants."}
            {isExhibitionOrConference(app.eventType) &&
              " For Exhibitions, this can also be met with strong industry support, or a minimum 10% foreign senior participants."}
          </InfoAlert>
        </div>
      )}

      <SectionCard title="Foreign attendees by market">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Market</TableHead>
              <TableHead className="text-right">Attendees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FOREIGN_MARKETS.map((m) => (
              <TableRow key={m.key}>
                <TableCell className="font-medium text-zinc-700">{m.label}</TableCell>
                <TableCell className="text-right">
                  <div className="ml-auto w-32">
                    <NumberField value={a.foreignByMarket[m.key]} onChange={(v) => setForeign(m.key, v)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-zinc-50">
              <TableCell className="font-semibold text-zinc-900">Total foreign attendees</TableCell>
              <TableCell className="text-right font-semibold tabular-nums text-zinc-900">{formatNumber(totals.totalForeign)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Local attendees" className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <label className="text-body-sm font-medium text-zinc-800">Singapore</label>
          <div className="w-40">
            <NumberField value={a.local} onChange={(v) => update("attendees", { ...a, local: v })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Attendee totals" className="mt-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-zinc-600">Total foreign attendees</TableCell>
              <TableCell className="text-right font-medium tabular-nums">{formatNumber(totals.totalForeign)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-zinc-600">Total local attendees</TableCell>
              <TableCell className="text-right font-medium tabular-nums">{formatNumber(totals.totalLocal)}</TableCell>
            </TableRow>
            <TableRow className="bg-zinc-50">
              <TableCell className="font-semibold text-zinc-900">Total attendees</TableCell>
              <TableCell className="text-right font-semibold tabular-nums text-zinc-900">{formatNumber(totals.totalAttendees)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p className="mt-3 text-body-sm text-zinc-600">
          Foreign participants: <span className="font-semibold text-zinc-900 tabular-nums">{totals.foreignPercent.toFixed(1)}%</span>
        </p>
      </SectionCard>

      <SectionCard
        title="Attendee composition"
        description="Further classify your expected attendees, where applicable."
        className="mt-6"
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="text-body-sm font-medium text-zinc-800">Non-senior management</label>
            <div className="mt-1.5">
              <NumberField value={a.composition.nonSeniorManagement} onChange={(v) => setComposition("nonSeniorManagement", v)} />
            </div>
          </div>
          <div>
            <label className="text-body-sm font-medium text-zinc-800">Senior management</label>
            <div className="mt-1.5">
              <NumberField value={a.composition.seniorManagement} onChange={(v) => setComposition("seniorManagement", v)} />
            </div>
          </div>
          <div>
            <label className="text-body-sm font-medium text-zinc-800">Accompanying persons</label>
            <div className="mt-1.5">
              <NumberField value={a.composition.accompanyingPersons} onChange={(v) => setComposition("accompanyingPersons", v)} />
            </div>
          </div>
        </div>
      </SectionCard>

      {showTradeConsumer && (
        <SectionCard
          title="Trade attendees and consumers"
          description="Media representatives are included within trade attendees rather than collected separately."
          className="mt-6"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-right">Foreign</TableHead>
                <TableHead className="text-right">Local</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-zinc-700">Trade attendees</TableCell>
                <TableCell className="text-right">
                  <div className="ml-auto w-28"><NumberField value={a.tradeConsumer.tradeForeign} onChange={(v) => setTradeConsumer("tradeForeign", v)} /></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="ml-auto w-28"><NumberField value={a.tradeConsumer.tradeLocal} onChange={(v) => setTradeConsumer("tradeLocal", v)} /></div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-zinc-700">Consumers</TableCell>
                <TableCell className="text-right">
                  <div className="ml-auto w-28"><NumberField value={a.tradeConsumer.consumerForeign} onChange={(v) => setTradeConsumer("consumerForeign", v)} /></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="ml-auto w-28"><NumberField value={a.tradeConsumer.consumerLocal} onChange={(v) => setTradeConsumer("consumerLocal", v)} /></div>
                </TableCell>
              </TableRow>
              <TableRow className="bg-zinc-50">
                <TableCell className="font-semibold text-zinc-900">Total</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-zinc-900">{formatNumber(tc.foreignTotal)}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-zinc-900">{formatNumber(tc.localTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </SectionCard>
      )}

      <WizardFooter onBack={goBack} onNext={handleContinue} />
    </div>
  );
}
