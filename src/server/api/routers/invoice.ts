import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  addDescriptionByCategory: protectedProcedure
    .input(z.object({ description: z.string().min(1), categoryId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.serviceItems.create({
        data: {
          description: input.description,
          category: { connect: { id: input.categoryId } },
        },
      });
    }),

  addCategory: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.serviceCategories.create({
        data: {
          name: input.name,
        },
      });
    }),
  getInvoiceDescriptionItems: protectedProcedure.query(({ ctx }) => {
    return ctx.db.serviceItems.findMany({
      where: { categoryId: 1 },
    });
  }),
  getCategoryById: protectedProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.serviceCategories.findFirst({
        where: { id: input.categoryId },
      });
    }),
  getItemsByCategoryId: protectedProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.serviceItems.findMany({
        where: { categoryId: input.categoryId },
      });
    }),
  getAllCategories: protectedProcedure.query(({ ctx }) => {
    return ctx.db.serviceCategories.findMany();
  }),
});
