import { Descriptive } from "@prisma/client";
import { create } from "zustand";

export type TDescriptive = Record<
  number,
  Record<number, { description: string; note?: string }>
>;

export type invoiceGenState = {
  descriptiveId: number | null;
  updateDescriptiveId: (id: number) => void;
  descriptive: TDescriptive;
  updateItem: (categoryId: number, itemId: number, description: string) => void;
  removeItem: (categoryId: number, itemId: number) => void;
  updateNote: (categoryId: number, itemId: number, note: string) => void;
  client: { name: string; address: string };
  updateClient: ({
    name,
    address,
  }: {
    name?: string;
    address?: string;
  }) => void;
  title: string;
  updateTitle: (title: string) => void;
  updateDescriptive: (descriptive: Descriptive) => void;
};

export const invoiceGenUseStore = create<invoiceGenState>((set) => ({
  descriptiveId: null,
  updateDescriptiveId: (id) =>
    set((state) => ({ ...state, descriptiveId: id })),
  descriptive: {},
  updateItem: (categoryId: number, itemId: number, description: string) =>
    set((state) => ({
      descriptive: {
        ...state.descriptive,
        [categoryId]: {
          ...state.descriptive?.[categoryId],
          [itemId]: { description },
        },
      },
    })),
  removeItem: (categoryId: number, itemId: number) => {
    set((state) => {
      delete state.descriptive[categoryId]?.[itemId];
      return state;
    });
  },
  updateNote: (categoryId: number, itemId: number, note: string) =>
    set((state) => ({
      descriptive: {
        ...state.descriptive,
        [categoryId]: {
          ...state.descriptive?.[categoryId],
          [itemId]: {
            ...state.descriptive[categoryId]![itemId]!,
            note,
          },
        },
      },
    })),
  client: { name: "", address: "" },
  updateClient: (client) =>
    set((state) => ({ ...state, client: { ...state.client, ...client } })),
  title: "",
  updateTitle: (title) => set((state) => ({ ...state, title })),
  updateDescriptive: (descriptive: Descriptive) =>
    set((state) => {
      if (descriptive.clientAddress)
        state.client.address = descriptive.clientAddress;
      if (descriptive.clientName) state.client.name = descriptive.clientName;
      if (descriptive.title) state.title = descriptive.title;

      console.log(descriptive.json)

      return {
        ...state,
        descriptiveId: descriptive.id,
        descriptive: descriptive.json as TDescriptive,
      };
    }),
}));
