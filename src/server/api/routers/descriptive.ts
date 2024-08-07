import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const descriptiveRouter = createTRPCRouter({
  addDescriptive: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        clientName: z.string(),
        clientAddress: z.string(),
        json: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.descriptive.create({
        data: input,
      });
    }),
  //   Record<
  //      number,
  //       Record<number, { description: string; note?: string }>
  //    >;
  updateDescriptive: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        clientName: z.string(),
        clientAddress: z.string(),
        json: z.record(
          z.string(),
          z.record(
            z.string(),
            z.object({
              description: z.string().optional(),
              note: z.string().optional(),
            }),
          ),
        ),
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.descriptive.update({
        where: { id: input.id },
        data: {
          title: input.title,
          clientName: input.clientName,
          clientAddress: input.clientAddress,
          json: input.json,
        },
      });
    }),

  getAllDescriptives: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.descriptive.findMany();
  }),
});
