import { authLogger } from "@/configs/logger/index.js";
import { BadRequestError, ServerError } from "@/customs/error/httpErrors.js";
import { ITotp, AuthModelType } from "@/types/index.js";
import mongoose from "mongoose";
import v from "validator";

const AuthSchema = new mongoose.Schema<ITotp,object,object>({
    
    email: {
        type: String,
        required: [true,"Email required"],
        // Prevent large data
        maxLength: [60,"Email at most sixty character"],
        trim: true,
        // Prevent duplicate email
        lowercase: true,
        validate: {
           validator: (val: string) => {
               return v.isEmail(val);
           },
           message: "Invalid Email"
        },
        cast: '{VALUE} is not a string'
    },
    otp: {
        type: String,
        required: [true, "OTP is required"],
        trim: true,
        // Enforce exact length
        minLength: [6, "OTP must be exactly 6 digits"],
        maxLength: [6, "OTP must be exactly 6 digits"],
        validate: {
            validator: (val: string) => {
                // Regex: ^ (start), \d{6} (exactly six digits), $ (end)
                return /^\d{6}$/.test(val);
            },
            message: "OTP must contain only digits (0-9)"
        },
        cast: '{VALUE} is not a valid string'
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    expiredAt: {
        type: Date,
        required: [true, "Expiration time is required"],
        // The 'expires: 0' means: delete exactly at the timestamp stored in this field
        index: { expires: 0 }
    }
},{
    timestamps: true
})

// Handle error after save, such as duplicate key and validation error
AuthSchema.post('save', function(error: any, _doc: unknown, _next: unknown) {
    
    // Handle Duplicate Key (Conflict)
    if (error.name === "MongoServerError" && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        authLogger.warn(`Duplicate key error on field: ${field}
                         ${field.charAt(0).toUpperCase() + field.slice(1)} already exists.
        `);
        throw new ServerError("Something went wrong");
    }
    // Handle Validation Error
    if (error.name === "ValidationError") {
       // Extract the first validation message found
        const firstErrorField = Object.keys(error.errors)[0];
        const message = error.errors[firstErrorField].message;
        authLogger.warn(`Validation error on field: ${firstErrorField} - ${message}`);
        throw new BadRequestError(
            message
        );
    }
    // Handle Cast Error
    if(error.name === "CastError") {
        authLogger.warn(`Cast error on field: ${error.path} - Invalid value: ${error.value}`);
        throw new BadRequestError(
            `Invalid ${error.path}: ${error.value}`
        );
    }
    // Log other errors for debugging
    authLogger.error(`Error saving totp: ${error.message}`);
    // Rethrow other errors to be handled by global error handler
    throw new ServerError("An unexpected error occurred while saving the totp.");
});

export const AuthModel = mongoose.model<ITotp,AuthModelType>("Totp",AuthSchema);