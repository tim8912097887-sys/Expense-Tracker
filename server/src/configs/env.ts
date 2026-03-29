import z from "zod";

const EnvSchema = z.object({
    // NODE_ENV Validation
  NODE_ENV: z
    .enum(['development', 'test', 'production'], {
      error: "NODE_ENV must be 'development', 'test', or 'production'",
    })
    .default('development'),

  // PORT Validation
  PORT: z.coerce
    .number({
      error: "PORT must be a number",
    })
    .int()
    .positive("PORT must be a positive integer")
    .max(65535, "PORT cannot exceed 65535")
    .default(3000),
  LOG_LEVEL: z.enum(['error','warn','info','debug'],{ error: "Log level must be 'error','warn','info','debug'" }),
  MONGO_URI: z
    .string()
    .refine(
      (url) => url.startsWith("mongodb://") || url.startsWith("mongodb+srv://"),
      "URL must begin with mongodb:// or mongodb+srv://"
    )
    .regex(
      /^mongodb(?:\+srv)?:\/\/(?:([^:]+)(?::([^@]+))?@)?([^/?]+)(?:\/([^?]+))?(?:\?(.+))?$/,
      "String is not a valid MongoDB connection URI"
    ),
  SALT_ROUNDS: z.coerce.number({
      error: "Salt must be a number",
    })
    .int()
    .positive("Salt must be a positive integer")
    .default(10),
  ATTEMPT_TIME: z.coerce.number({
      error: "Attemp time must be a number",
    })
    .int()
    .positive("Attempt time must be a positive integer")
    .default(3),
  ACCOUNT_LOCK_TIME: z.coerce.number({
      error: "Account lock time must be a number",
    })
    .int()
    .positive("Account lock time must be a positive integer")
    .default(30000),
  SECRET_CURRENT: z.string("Current Secret should be a string").min(32,"Current Secret should be at least 32 charaters"),
  SECRET_PREVIOUS: z.string("Previous Secret should be a string").min(32,"Previous Secret should be at least 32 charaters"),
  TOKEN_VERSION: z.coerce.number({
      error: "Token version must be a number",
    })
    .int()
    .positive("Token version must be a positive integer")
    .default(1),
  TOKEN_EXPIRED: z.coerce.number({
      error: "Token expired must be a number",
    })
    .int()
    .positive("Token expired must be a positive integer")
    .default(86400),
  RESEND_API_KEY: z.string("Resend api key must be string"),
  OTP_EXPIRED: z.coerce.number({
      error: "Otp expired time must be a number",
    })
    .int()
    .positive("Otp expired time must be a positive integer")
    .default(30000),
    REDIS_URL: z.string("Redis url must be string")
              .regex(/^redis:\/\//,"Redis must start with redis://"),
})

const result = EnvSchema.safeParse(process.env);
// Stop the application by throw error
if(!result.success) {
     const errorMessage = result.error.issues
    .map((issue) => `- ${issue.path.join('.')} : ${issue.message}`).join('\n');
    console.error(`Environment variables Error: ${errorMessage}`);
    // Should exit when env not available
    process.exit(1);
} 
// Validated data
export const env = result.data;