import z from "zod";

export const carRegister = z.object({
  body: z.object({
    plate: z.string().min(4).max(10),
    vendor: z.string().max(20),
    model: z.string().max(20),
    color: z.enum(["red", "blue"]),
  }),
});

export type CarRegisterPayload = z.infer<typeof carRegister>
