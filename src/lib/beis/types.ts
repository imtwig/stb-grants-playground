// BEiS5 grant application — data model.
// Field IDs (F0xx) are preserved from the BEiS Detailed Data Schema for traceability.
// They are never shown to applicants — see field-config.ts for applicant-facing labels/help text.

export type SupportType = "secure-events" | "build-foundation";

export type EventType =
  | "association-convention"
  | "exhibition"
  | "meeting"
  | "incentive-travel"
  | "trade-conference"
  | "awards-competition";

export const isExhibitionOrConference = (t: EventType | null) =>
  t === "exhibition" || t === "trade-conference";

export const isMeetingsIncentive = (t: EventType | null) =>
  t === "meeting" || t === "incentive-travel";

export interface KeyPerson {
  id: string;
  name: string;
  idNumber: string; // NRIC/FIN/passport
  nationality: string;
  role: string;
}

export interface Shareholder {
  id: string;
  name: string;
  idNumber: string;
  nationality: string;
  shareholdingPercent: string;
}

// F001-F010
export interface OrganisationData {
  uen: string; // F002
  retrieved: boolean;
  organisationName: string; // F001
  countryOfIncorporation: string; // F003
  address: string; // F004
  businessDescription: string; // F005
  keyExecutives: KeyPerson[]; // F006
  boardOfDirectors: KeyPerson[]; // F007
  keyShareholders: Shareholder[]; // F008
  financialInfo: {
    // F009
    lastFYRevenue: string;
    lastFYNetProfit: string;
    paidUpCapital: string;
  };
  contact: {
    // F010
    name: string;
    designation: string;
    phone: string;
    email: string;
  };
}

// F020 row
export interface FinancialProjectionRow {
  id: string;
  year: string;
  expectedRevenue: string;
  expectedExpenditure: string;
}

// F011, F013-F019
export interface ProjectEventData {
  title: string; // F011
  startDate: string; // F013
  endDate: string; // F014
  description: {
    // F016 — structured prompts
    attendeeProfile: string;
    targetMarkets: string;
    keyComponents: string;
    programme: string;
  };
  affiliatedOrganisations: string; // F017
  hasEventManagementCompany: boolean | null;
  eventManagementCompany: string; // F018
  hasMarketingPlan: boolean | null;
  marketingPlan: string; // F019
  financialProjections: FinancialProjectionRow[]; // F020
}

// F021-F027 exhibitions only
export interface EventProfileData {
  yearOfEvent: string; // F021
  previousEditionDestination: string; // F022
  grossSpaceIndoor: string; // F023
  grossSpaceOutdoor: string; // F024
  netSpaceIndoor: string; // F025
  netSpaceOutdoor: string; // F026
  totalExhibitors: string; // F027
}

// F031-F054
export interface AttendeesData {
  foreignByMarket: {
    notKnown: string; // F031
    americas: string; // F032
    europe: string; // F033
    aseanI: string; // F034
    aseanM: string; // F035
    northAsia: string; // F036
    prChina: string; // F037
    hongKong: string; // F038
    taiwan: string; // F039
    southAsia: string; // F040
    westAsia: string; // F041
    africa: string; // F042
    oceania: string; // F043
  };
  local: string; // F044
  composition: {
    nonSeniorManagement: string; // F048
    seniorManagement: string; // F049
    accompanyingPersons: string; // F050
  };
  tradeConsumer: {
    tradeForeign: string; // F051 (incl. media)
    tradeLocal: string; // F052 (incl. media)
    consumerForeign: string; // F053
    consumerLocal: string; // F054
  };
}

export interface CostItem {
  id: string;
  categoryKey: string; // maps to cost category config (F060-F071)
  description: string;
  amount: string;
  hasQuotation: boolean;
}

export interface DocumentUpload {
  id: string;
  fileName: string;
  uploadedAt: string;
}

export interface SupportingDocumentsData {
  uploads: Record<string, DocumentUpload | null>; // keyed by document key
}

// F074-F078 progressive disclosure blocks
export interface YesNoDetail {
  answer: boolean | null;
  country?: string;
  details?: string;
  status?: string;
  agency?: string;
  scheme?: string;
  amount?: string;
  applicationStatus?: string;
  supplier?: string;
  relationship?: string;
  involvement?: string;
}

export interface DeclarationsData {
  criminalProceedings: YesNoDetail; // F074
  civilSuits: YesNoDetail; // F075
  bankruptcy: YesNoDetail; // F076
  otherGrants: YesNoDetail; // F077
  supplierRelationships: YesNoDetail; // F078
  authorisation: {
    // F080
    name: string;
    designation: string;
    phone: string;
    email: string;
    date: string;
  };
  confirmed: boolean;
}

export interface BeisApplication {
  supportType: SupportType | null;
  eventType: EventType | null;
  organisation: OrganisationData;
  projectEvent: ProjectEventData;
  eventProfile: EventProfileData;
  attendees: AttendeesData;
  costs: CostItem[];
  documents: SupportingDocumentsData;
  declarations: DeclarationsData;
  submitted: boolean;
  submittedAt: string | null;
}

export type SectionKey =
  | "start"
  | "path"
  | "organisation"
  | "project"
  | "profile"
  | "attendees"
  | "costs"
  | "documents"
  | "declarations"
  | "review";
