import crypto from "crypto";

export const generateOtp = () => {
    // Generates a cryptographically strong random number
    const num = crypto.randomInt(0, 1000000);
    return num.toString().padStart(6, '0');
}