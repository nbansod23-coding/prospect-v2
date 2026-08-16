import { create } from "zustand";
import type {
  Campaign,
  CampaignStatus,
  LeadResult,
} from "@/types/campaign";
import type { Contact } from "@/types/contact";

type CampaignStore = {
  campaigns: Campaign[];

  activeCampaign: Campaign | null;

  startCampaign: (
    listId: number,
    agentId: string,
    agentName: string,
    contacts: Contact[],
  ) => void;

  setCurrentLead: (index: number) => void;

  setLeadResult: (
    contactId: number,
    result: LeadResult,
  ) => void;

  setCampaignStatus: (status: CampaignStatus) => void;

  clearActiveCampaign: () => void;
};

export const useCampaignStore = create<CampaignStore>((set) => ({
  campaigns: [],

  activeCampaign: null,

  startCampaign: (
    listId,
    agentId,
    agentName,
    contacts,
  ) => {
    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      listId,
      agentId,
      agentName,
      contacts,
      currentIndex: 0,
      results: {},
      status: "running",
      startedAt: new Date().toISOString(),
    };

    set((state) => ({
      campaigns: [...state.campaigns, campaign],
      activeCampaign: campaign,
    }));
  },

  setCurrentLead: (index) => {
    set((state) => {
      if (!state.activeCampaign) return state;

      const campaign = {
        ...state.activeCampaign,
        currentIndex: index,
      };

      return {
        activeCampaign: campaign,
        campaigns: state.campaigns.map((item) =>
          item.id === campaign.id ? campaign : item,
        ),
      };
    });
  },

  setLeadResult: (contactId, result) => {
    set((state) => {
      if (!state.activeCampaign) return state;

      const campaign = {
        ...state.activeCampaign,
        results: {
          ...state.activeCampaign.results,
          [contactId]: result,
        },
      };

      return {
        activeCampaign: campaign,
        campaigns: state.campaigns.map((item) =>
          item.id === campaign.id ? campaign : item,
        ),
      };
    });
  },

  setCampaignStatus: (status) => {
    set((state) => {
      if (!state.activeCampaign) return state;

      const campaign = {
        ...state.activeCampaign,
        status,
        ...(status === "completed"
          ? { completedAt: new Date().toISOString() }
          : {}),
      };

      return {
        activeCampaign: campaign,
        campaigns: state.campaigns.map((item) =>
          item.id === campaign.id ? campaign : item,
        ),
      };
    });
  },

  clearActiveCampaign: () => {
    set({
      activeCampaign: null,
    });
  },
}));