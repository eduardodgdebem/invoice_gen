import { create } from "zustand";

export type TItemsSelectedByCategory = Record<
  number,
  Record<number, { description: string; note?: string }>
>;

export type invoiceGenState = {
  itemsSelectedByCategory: TItemsSelectedByCategory;
  updateItem: (categoryId: number, itemId: number, description: string) => void;
  removeItem: (categoryId: number, itemId: number) => void;
  updateNote: (categoryId: number, itemId: number, note: string) => void;
};

export const invoiceGenUseStore = create<invoiceGenState>((set) => ({
  itemsSelectedByCategory: {},
  updateItem: (categoryId: number, itemId: number, description: string) =>
    set((state) => ({
      itemsSelectedByCategory: {
        ...state.itemsSelectedByCategory,
        [categoryId]: {
          ...state.itemsSelectedByCategory?.[categoryId],
          [itemId]: { description },
        },
      },
    })),
  removeItem: (categoryId: number, itemId: number) => {
    set((state) => {
      delete state.itemsSelectedByCategory[categoryId]?.[itemId];
      return state;
    });
  },
  updateNote: (categoryId: number, itemId: number, note: string) =>
    set((state) => ({
      itemsSelectedByCategory: {
        ...state.itemsSelectedByCategory,
        [categoryId]: {
          ...state.itemsSelectedByCategory?.[categoryId],
          [itemId]: {
            ...state.itemsSelectedByCategory[categoryId]![itemId]!,
            note,
          },
        },
      },
    })),
}));
