import { create } from "zustand";
import { mockLists, type MockList } from "@/data/mockList";
import { deriveInitialListMetrics } from "@/lib/listMetrics";

type ListStore = {
  lists: MockList[];

  addList: (list: MockList) => void;
  removeList: (id: number) => void;
  updateList: (
    id: number,
    updates: Partial<MockList>
  ) => void;
};

export const useListStore = create<ListStore>((set) => ({
  lists: mockLists.map((list) => ({
    ...list,
    ...deriveInitialListMetrics(list),
  })),

  addList: (list) =>
    set((state) => ({
      lists: [...state.lists, list],
    })),

  removeList: (id) =>
    set((state) => ({
      lists: state.lists.filter(
        (list) => list.id !== id
      ),
    })),

  updateList: (id, updates) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === id
          ? { ...list, ...updates }
          : list
      ),
    })),
}));
