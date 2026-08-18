import type { MockList } from "@/data/mockList";
import { mockContacts } from "@/data/mockContacts";
import type { Contact } from "@/types/contact";

type ListMetric = Pick<
  MockList,
  "rows" | "interested" | "notInterested" | "callBack" | "noAnswer" | "called" | "notCalled"
>;

function getListContacts(listId: number, contacts: Contact[]) {
  return contacts.filter((contact) => contact.listId === listId);
}

function countByFeedback(
  contacts: Contact[],
  feedback: Contact["callFeedback"],
) {
  return contacts.filter((contact) => contact.callFeedback === feedback).length;
}

function getTotalContacts(list: MockList) {
  const listContacts = getListContacts(list.id, mockContacts);

  if (listContacts.length > 0) {
    return listContacts.length;
  }

  if (list.prospects?.length) {
    return list.prospects.length;
  }

  return list.rows;
}

export function deriveInitialListMetrics(list: MockList): ListMetric {
  const totalContacts = getTotalContacts(list);

  return {
    rows: totalContacts,
    interested: 0,
    notInterested: 0,
    callBack: 0,
    noAnswer: 0,
    called: 0,
    notCalled: totalContacts,
  };
}

export function deriveListMetrics(list: MockList): ListMetric {
  const totalContacts = getTotalContacts(list);
  const called = list.called || 0;

  return {
    rows: totalContacts,
    interested: list.interested || 0,
    notInterested: list.notInterested || 0,
    callBack: list.callBack || 0,
    noAnswer: list.noAnswer || 0,
    called,
    notCalled: Math.max(0, totalContacts - called),
  };
}

export function deriveListTotals(lists: MockList[]) {
  return lists.reduce(
    (acc, list) => {
      const metrics = deriveListMetrics(list);

      acc.totalLists += 1;
      acc.totalContacts += metrics.rows;
      acc.interested += metrics.interested;
      acc.notCalled += metrics.notCalled;

      return acc;
    },
    {
      totalLists: 0,
      totalContacts: 0,
      interested: 0,
      notCalled: 0,
    },
  );
}
