export type ListStatus = "ready" | "processing" | "failed";
export type CallStatus =
  | "not_called"
  | "calling"
  | "interested"
  | "not_interested"
  | "call_back"
  | "no_answer";

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
};

export const mockLists: MockList[] = [
  {
    id: 1,
    name: "Pharma Marketing Leads",
    rows: 30,
    createdAt: "2024-12-01",
    status: "ready",
    source: "CSV Upload",
    interested: 8,
    notInterested: 5,
    callBack: 4,
    noAnswer: 3,
    notCalled: 10,
  },
  {
    id: 2,
    name: "SaaS Growth Targets",
    rows: 20,
    createdAt: "2024-12-10",
    status: "ready",
    source: "PDF Extract",
    interested: 6,
    notInterested: 3,
    callBack: 2,
    noAnswer: 2,
    notCalled: 7,
  },
  {
    id: 3,
    name: "Healthcare Decision Makers",
    rows: 15,
    createdAt: "2024-12-15",
    status: "processing",
    source: "CSV Upload",
    interested: 0,
    notInterested: 0,
    callBack: 0,
    noAnswer: 0,
    notCalled: 15,
  },
];
