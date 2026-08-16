
export type CallFeedback =
  | "Interested"
  | "Not Interested"
  | "Call Back"
  | "Not Answered";
export type CallStatus =
  | "not_called"
  | "interested"
  | "not_interested"
  | "call_back"
  | "no_answer"
  | "Called"  

export interface Contact {
  id: number;
  listId: number;
  callFeedback: CallFeedback;
  name: string;
  company: string;
  designation: string;

  phone: string;
  email: string;

  status: CallStatus;
}