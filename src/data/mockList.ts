import { mockProspects, type Prospect } from "@/data/mockData";

export type ListStatus = "ready" | "processing" | "failed";

export type MockList = {
  id: number;
  name: string;
  rows: number;
  createdAt: string;
  status: ListStatus;
  source: string;

  interested: number;
  notInterested: number;
  callBack: number;
  noAnswer: number;
  notCalled: number;
  called: number;

  prospects?: Prospect[];
};

export const mockLists: MockList[] = [
  {
    id: 1,
    name: "Pharma Marketing Leads",
    rows: 10,
    createdAt: "2024-12-01",
    status: "ready",
    source: "CSV Upload",

    interested: 5,
    notInterested: 2,
    called: 10,
    callBack: 1,
    noAnswer: 2,
    notCalled: 0,

    prospects: mockProspects.slice(0, 10),
  },

  {
    id: 2,
    name: "SaaS Growth Targets",
    rows: 5,
    createdAt: "2024-12-10",
    status: "ready",
    source: "PDF Extract",

    interested: 3,
    notInterested: 2,
    callBack: 0,
    noAnswer: 0,
    notCalled: 0,
    called: 5,

    prospects: mockProspects.slice(10, 15),
  },

  {
    id: 3,
    name: "Healthcare Decision Makers",
    rows: 10,
    createdAt: "2024-12-15",
    status: "processing",
    source: "CSV Upload",

    interested: 6,
    notInterested: 3,
    callBack: 1,
    noAnswer: 0,
    notCalled: 0,
    called: 10,

    prospects: mockProspects.slice(16, 26),
  },
];
