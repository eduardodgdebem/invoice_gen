import { create } from "zustand";

export type TItemsSelectedByCategory = Record<number, Record<number, string>>


export type invoiceGenState = {
  itemsSelectedByCategory: TItemsSelectedByCategory;
  updateItem: (categoryId: number, itemId: number, description: string) => void;
  // removeItem: (categoryId: number, itemId: number) => void;
};

export const invoiceGenUseStore = create<invoiceGenState>((set) => ({
  itemsSelectedByCategory: {},
  updateItem: (categoryId: number, itemId: number, description: string) =>
    set((state) => ({
      itemsSelectedByCategory: {
        ...state.itemsSelectedByCategory,
        [categoryId]: {
          ...state.itemsSelectedByCategory?.[categoryId],
          [itemId]: description,
        },
      },
    })),
  // removeItem: (categoryId: number, itemId: number) => {},
}));
