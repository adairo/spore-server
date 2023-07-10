import z from "zod";

const carSchema = z.object({
  id: z.number(),
  plate: z.string().min(4).max(10),
  vendor: z.string().max(20),
  model: z.string().max(20),
  color: z.enum(["red", "blue"]),
  userId: z.number(),
});

export const createCarSchema = z.object({
  body: carSchema.omit({ id: true, userId: true }).strict(),
});

const carIdSchema = z.object({ carId: z.coerce.number() });
export const editCarSchema = z.object({
  params: carIdSchema,
  body: carSchema.omit({ id: true, userId: true }).strict().partial(),
});

export const updatePosition = z.object({
  params: carIdSchema,
  query: z.object({
    lattitude: z.coerce.number(),
    longitude: z.coerce.number(),
  }),
});

export type UpdateCarPositionPayload = z.infer<typeof updatePosition>
export type Car = z.infer<typeof carSchema>;
export type CarRegisterPayload = z.infer<typeof createCarSchema>;
export type CarEditPayload = z.infer<typeof editCarSchema>;
