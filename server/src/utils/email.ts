import { env } from "@/configs/env.js";
import { Resend } from 'resend'; 
import { ServerError } from "@/customs/error/httpErrors.js";
import { authLogger } from "@/configs/logger/index.js";

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
   try {
    const { data, error } = await resend.emails.send({
        from: `Support <onboarding@resend.dev>`, 
        to,
        subject: subject,
        html: html,
    });

    if (error) {
        authLogger.error("Resend API Error:", error);
        throw new ServerError(error.message);
    }

    authLogger.info(`Email sent to ${to} via Resend. ID: ${data?.id}`);
    return data;
    
  } catch (error: any) {
    authLogger.error("Error sending email:", error);
    throw new ServerError("Failed to send email via Resend");
  }
}