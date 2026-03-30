import z from "zod";

export const ForgotPasswordSchema = z.object({
    email: z.email("Invalid Email").trim().toLowerCase()
})

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;