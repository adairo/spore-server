import z from "zod";

const carSchema = z.object({
  id: z.number(),
  plate: z.string().min(4).max(10),
  vendor: z.string().max(20),
  model: z.string().max(20),
  color: z.enum(["red", "blue"]),
  userId: z.number(),
});

export const carRegister = z.object({
  body: carSchema.omit({ id: true, userId: true }),
});

export type Car = z.infer<typeof carSchema>;
export type CarRegisterPayload = z.infer<typeof carRegister>;
