import type { BeisApplication, YesNoDetail } from "./types";

export const emptyYesNo: YesNoDetail = { answer: null };

export function createEmptyApplication(): BeisApplication {
  return {
    supportType: null,
    eventType: null,
    organisation: {
      uen: "",
      retrieved: false,
      organisationName: "",
      countryOfIncorporation: "",
      address: "",
      businessDescription: "",
      keyExecutives: [],
      boardOfDirectors: [],
      keyShareholders: [],
      financialInfo: { lastFYRevenue: "", lastFYNetProfit: "", paidUpCapital: "" },
      contact: { name: "", designation: "", countryCode: "", phone: "", email: "" },
    },
    projectEvent: {
      title: "",
      startDate: "",
      endDate: "",
      description: { attendeeProfile: "", targetMarkets: "", keyComponents: "", programme: "" },
      affiliatedOrganisations: "",
      hasEventManagementCompany: null,
      eventManagementCompany: "",
      hasMarketingPlan: null,
      marketingPlan: "",
      financialProjections: [],
    },
    eventProfile: {
      yearOfEvent: "",
      previousEditionDestination: "",
      grossSpaceIndoor: "",
      grossSpaceOutdoor: "",
      netSpaceIndoor: "",
      netSpaceOutdoor: "",
      totalExhibitors: "",
    },
    attendees: {
      foreignByMarket: {
        notKnown: "", americas: "", europe: "", aseanI: "", aseanM: "",
        northAsia: "", prChina: "", hongKong: "", taiwan: "", southAsia: "",
        westAsia: "", africa: "", oceania: "",
      },
      local: "",
      composition: { nonSeniorManagement: "", seniorManagement: "", accompanyingPersons: "" },
      tradeConsumer: { tradeForeign: "", tradeLocal: "", consumerForeign: "", consumerLocal: "" },
    },
    costs: [],
    documents: { uploads: {} },
    declarations: {
      criminalProceedings: { ...emptyYesNo },
      civilSuits: { ...emptyYesNo },
      bankruptcy: { ...emptyYesNo },
      otherGrants: { ...emptyYesNo },
      supplierRelationships: { ...emptyYesNo },
      authorisation: { name: "", designation: "", phone: "", email: "", date: "" },
      confirmed: false,
    },
    submitted: false,
    submittedAt: null,
  };
}

// Realistic demo data — filled in via "Load sample application" for demoing the completed state.
export function createSampleApplication(): BeisApplication {
  const base = createEmptyApplication();
  return {
    ...base,
    supportType: "secure-events",
    eventType: "exhibition",
    organisation: {
      uen: "201812345K",
      retrieved: true,
      organisationName: "Meridian Exhibitions Pte Ltd",
      countryOfIncorporation: "Singapore",
      address: "8 Marina View, #21-01 Asia Square Tower 1, Singapore 018960",
      businessDescription:
        "Organiser of trade exhibitions and business events across the Asia Pacific region, specialising in maritime and logistics industries.",
      keyExecutives: [
        { id: "ke1", name: "Tan Wei Ming", idNumber: "S7712345A", nationality: "Singaporean", role: "Managing Director" },
        { id: "ke2", name: "Priya Nair", idNumber: "S8023456B", nationality: "Singaporean", role: "Finance Director" },
      ],
      boardOfDirectors: [
        { id: "bd1", name: "Tan Wei Ming", idNumber: "S7712345A", nationality: "Singaporean", role: "Director" },
        { id: "bd2", name: "Ahmad bin Ibrahim", idNumber: "S7534567C", nationality: "Singaporean", role: "Independent Director" },
      ],
      keyShareholders: [
        { id: "sh1", name: "Meridian Holdings Pte Ltd", idNumber: "201700111M", nationality: "Singapore", shareholdingPercent: "70" },
        { id: "sh2", name: "Lim Mei Ling", idNumber: "S7845678D", nationality: "Singaporean", shareholdingPercent: "30" },
      ],
      financialInfo: { lastFYRevenue: "8500000", lastFYNetProfit: "620000", paidUpCapital: "1000000" },
      contact: { name: "Priya Nair", designation: "Finance Director", countryCode: "+65", phone: "9123 4567", email: "priya.nair@meridianexpo.com.sg" },
    },
    projectEvent: {
      title: "Asia Maritime & Logistics Expo 2027",
      startDate: "2027-03-16",
      endDate: "2027-03-18",
      description: {
        attendeeProfile: "Senior procurement, operations and technology leaders from shipping lines, port operators, freight forwarders and maritime technology providers.",
        targetMarkets: "China, South Korea, Japan, Vietnam, Indonesia, India and the Middle East, alongside a strong Southeast Asian base.",
        keyComponents: "Exhibition floor of 180 booths, two-day conference track, industry awards dinner and hosted buyer programme for qualified overseas buyers.",
        programme: "Day 1: Opening keynote and exhibition floor opens. Day 2: Conference tracks on port digitalisation and green shipping. Day 3: Hosted buyer meetings and awards dinner.",
      },
      affiliatedOrganisations: "Held in partnership with the Asian Shipowners' Association.",
      hasEventManagementCompany: true,
      eventManagementCompany: "Global Expo Management (DMC) Pte Ltd",
      hasMarketingPlan: true,
      marketingPlan: "Three-year growth plan targeting a 15% year-on-year increase in overseas trade attendance through targeted digital campaigns in North Asia and South Asia, and expanded hosted buyer partnerships.",
      financialProjections: [
        { id: "fp1", year: "2027", expectedRevenue: "3200000", expectedExpenditure: "2850000" },
        { id: "fp2", year: "2028", expectedRevenue: "3600000", expectedExpenditure: "3050000" },
      ],
    },
    eventProfile: {
      yearOfEvent: "2027",
      previousEditionDestination: "Singapore (2025 edition)",
      grossSpaceIndoor: "12000",
      grossSpaceOutdoor: "0",
      netSpaceIndoor: "8400",
      netSpaceOutdoor: "0",
      totalExhibitors: "180",
    },
    attendees: {
      foreignByMarket: {
        notKnown: "50", americas: "120", europe: "260", aseanI: "480", aseanM: "310",
        northAsia: "410", prChina: "890", hongKong: "140", taiwan: "160", southAsia: "520",
        westAsia: "180", africa: "60", oceania: "90",
      },
      local: "2450",
      composition: { nonSeniorManagement: "3200", seniorManagement: "1470", accompanyingPersons: "0" },
      tradeConsumer: { tradeForeign: "3670", tradeLocal: "1950", consumerForeign: "0", consumerLocal: "500" },
    },
    costs: [
      { id: "c1", categoryKey: "eventOrganiser", description: "DMC management fee for on-ground production", amount: "180000", hasQuotation: true },
      { id: "c2", categoryKey: "venueRental", description: "Suntec Singapore hall rental, 3 days", amount: "210000", hasQuotation: true },
      { id: "c3", categoryKey: "marketingCollateral", description: "Event website, digital collateral and signage", amount: "65000", hasQuotation: false },
      { id: "c4", categoryKey: "hostedBuyer", description: "Hosted buyer programme — flights and accommodation for 40 qualified buyers", amount: "120000", hasQuotation: true },
      { id: "c5", categoryKey: "galaDinner", description: "Industry awards dinner for 300 guests", amount: "85000", hasQuotation: false },
    ],
    documents: { uploads: {} },
    declarations: {
      criminalProceedings: { answer: false },
      civilSuits: { answer: false },
      bankruptcy: { answer: false },
      otherGrants: {
        answer: true,
        agency: "Enterprise Singapore",
        scheme: "Market Readiness Assistance Grant",
        amount: "30000",
        applicationStatus: "Approved and disbursed, 2025",
      },
      supplierRelationships: { answer: false },
      authorisation: { name: "Tan Wei Ming", designation: "Managing Director", phone: "+65 9123 4567", email: "weiming.tan@meridianexpo.com.sg", date: "2026-09-27" },
      confirmed: false,
    },
    submitted: false,
    submittedAt: null,
  };
}

// Simulates STB's UEN lookup — pre-fills organisation profile fields already known to government systems.
export function lookupUenMock(uen: string): { organisationName: string; address: string; businessDescription: string; countryOfIncorporation: string } | null {
  if (!uen || uen.trim().length < 8) return null;
  return {
    organisationName: "Meridian Exhibitions Pte Ltd",
    address: "8 Marina View, #21-01 Asia Square Tower 1, Singapore 018960",
    businessDescription: "Organiser of trade exhibitions and business events across the Asia Pacific region, specialising in maritime and logistics industries.",
    countryOfIncorporation: "Singapore",
  };
}
