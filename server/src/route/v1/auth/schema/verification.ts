import z from "zod";

export const VerificationSchema = z.object({
    email: z.email("Invalid Email").trim().toLowerCase(),
    otp: z.string("Otp must be string")
          .length(6,"Otp must have 6 character")
          .regex(/^\d+$/, "OTP must only contain digits")
})

export type VerificationType = z.infer<typeof VerificationSchema>;