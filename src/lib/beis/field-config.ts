import type { EventType, SectionKey, SupportType } from "./types";

// Applicant-facing config, separate from presentation. Internal Field IDs (F0xx) are kept
// in comments only for traceability back to the BEiS Detailed Data Schema — never rendered.

export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "start", label: "Start" },
  { key: "path", label: "Type of support" },
  { key: "organisation", label: "Organisation" },
  { key: "project", label: "Project / Event" },
  { key: "profile", label: "Event profile" },
  { key: "attendees", label: "Attendees" },
  { key: "costs", label: "Project costs" },
  { key: "documents", label: "Supporting documents" },
  { key: "declarations", label: "Declarations" },
  { key: "review", label: "Review & submit" },
];

// Sections shown in the step navigation (start/path are entry screens, not tracked steps)
export const STEP_SECTIONS: SectionKey[] = [
  "organisation", "project", "profile", "attendees", "costs", "documents", "declarations", "review",
];

export const SUPPORT_TYPE_OPTIONS: { value: SupportType; title: string; description: string }[] = [
  {
    value: "secure-events",
    title: "Secure Events",
    description: "For events with quality content and global significance that you are bringing to Singapore.",
  },
  {
    value: "build-foundation",
    title: "Build Foundation",
    description: "For activities that build the foundation towards bringing events to Singapore in the long term.",
  },
];

export const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: "association-convention", label: "Association convention" },
  { value: "exhibition", label: "Exhibition" },
  { value: "meeting", label: "Meeting" },
  { value: "incentive-travel", label: "Incentive travel" },
  { value: "trade-conference", label: "Trade conference" },
  { value: "awards-competition", label: "Awards & competition" },
];

// F060-F071 cost categories, grouped
export const COST_CATEGORIES: { key: string; group: string; label: string }[] = [
  { key: "auditFees", group: "Professional services", label: "External audit fees" },
  { key: "eventOrganiser", group: "Professional services", label: "External event organiser / DMC costs" },
  { key: "speakerEngagement", group: "Content development", label: "Speaker engagement" },
  { key: "programmeDevelopment", group: "Content development", label: "Programme development costs" },
  { key: "marketingCollateral", group: "Marketing", label: "Marketing collaterals / website production" },
  { key: "hostedMedia", group: "Marketing", label: "Hosted media programme" },
  { key: "galaDinner", group: "Social / networking", label: "Gala dinner" },
  { key: "cocktailFunction", group: "Social / networking", label: "Cocktail function" },
  { key: "hostedBuyer", group: "Hosting", label: "Hosted buyer programme / hosting fees" },
  { key: "venueRental", group: "Venue", label: "Venue rental" },
  { key: "meetingPackage", group: "Venue", label: "Meeting package" },
  { key: "otherCosts", group: "Others", label: "Other project costs" },
];

export function costCategoryLabel(key: string): string {
  return COST_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

// F031-F043 foreign attendee markets
export const FOREIGN_MARKETS: { key: keyof import("./types").AttendeesData["foreignByMarket"]; label: string }[] = [
  { key: "americas", label: "Americas" },
  { key: "europe", label: "Europe" },
  { key: "aseanI", label: "ASEAN (I)" },
  { key: "aseanM", label: "ASEAN (M)" },
  { key: "northAsia", label: "North Asia" },
  { key: "prChina", label: "PR China" },
  { key: "hongKong", label: "Hong Kong" },
  { key: "taiwan", label: "Taiwan" },
  { key: "southAsia", label: "South Asia" },
  { key: "westAsia", label: "West Asia" },
  { key: "africa", label: "Africa" },
  { key: "oceania", label: "Oceania" },
  { key: "notKnown", label: "Place of residence not known" },
];

// Supporting documents — driven by applicant answers, not invented beyond schema/handbook
export interface DocumentRequirement {
  key: string;
  name: string;
  reason: string;
  applies: (app: import("./types").BeisApplication) => boolean;
}

export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    key: "acra",
    name: "ACRA business profile",
    reason: "Confirms your organisation's registration details.",
    applies: () => true,
  },
  {
    key: "financialStatements",
    name: "Latest audited financial statements",
    reason: "Supports the financial information provided about your organisation.",
    applies: () => true,
  },
  {
    key: "eventProposal",
    name: "Event proposal or programme outline",
    reason: "Substantiates the project and programme details described in this application.",
    applies: () => true,
  },
  {
    key: "quotation",
    name: "Supplier quotation",
    reason: "Required to substantiate at least one projected cost item entered in this application.",
    applies: (app) => app.costs.length > 0,
  },
  {
    key: "dmcAgreement",
    name: "Event management / DMC engagement letter",
    reason: "Supports the appointed event management company or handling agent named in this application.",
    applies: (app) => app.projectEvent.hasEventManagementCompany === true,
  },
  {
    key: "marketingPlan",
    name: "Marketing and growth plan document",
    reason: "Supports the multi-year marketing and growth plan described in this application.",
    applies: (app) => app.projectEvent.hasMarketingPlan === true,
  },
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  "association-convention": "Association convention",
  exhibition: "Exhibition",
  meeting: "Meeting",
  "incentive-travel": "Incentive travel",
  "trade-conference": "Trade conference",
  "awards-competition": "Awards & competition",
};
