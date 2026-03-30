import z from "zod";

export const ResetPasswordSchema = z.object({
    email: z.email("Invalid Email").trim().toLowerCase(),
    otp: z.string("Otp must be string")
          .length(6,"Otp must have 6 character")
          .regex(/^\d+$/, "OTP must only contain digits"),
    password: z.string()
                   .min(8,"Password at least eight character")
                   .max(50,"Password at most fifty character")
                   .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,"Password should include small and big letter and number and one special character"),
})

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;