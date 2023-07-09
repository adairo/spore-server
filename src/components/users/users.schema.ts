import z from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Correo no válido"),
    password: z
      .string()
      .min(8, { message: "La contraseña debe ser de al menos 8 caracteres" })
      .max(12, "La contraseña no puede ser mayor a 12 caracteres"),
    role: z.enum(["regular", "admin"]),
  }),
});

// the same schema of createUserShchema but without "role"
export const loginSchema = z.object({
  body: createUserSchema.shape.body.omit({ role: true }),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
type UserRole = CreateUserPayload["body"]["role"];
export type LoginPayload = z.infer<typeof loginSchema>;
export type UserToken = { id: number; email: string; role: UserRole };
