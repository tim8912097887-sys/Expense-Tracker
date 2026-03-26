import { ErrorRequestHandler } from "express";
import { responseEnvelope } from "@/utils/responseEnvelope.js";
import { defaultLogger as logger } from "@/configs/logger/index.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    
    // Variables for data envelope
    const statusCode = err.statusCode || 500;
    const state = "error";
    const errorObject = {
        status: err.type || "ServerError",
        code: statusCode,
        detail: err.isOperational ? err.message : "An unexpected error occurred. Please try again later."
    }
    
    // Log the error for debugging
    logger.error(`Error: ${err.message}, Type: ${err.type || "Unknown"}, Stack: ${err.stack}`);
    // Send response with error envelope
    res.status(statusCode).json(responseEnvelope({
        state,
        error: errorObject
    }));
}  