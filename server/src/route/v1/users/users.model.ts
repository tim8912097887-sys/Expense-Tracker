import { env } from "@/configs/env.js";
import { authLogger } from "@/configs/logger/index.js";
import { BadRequestError, ServerError } from "@/customs/error/httpErrors.js";
import { IUser, IUserMethods, UserModelType } from "@/types/index.js";
import { comparePassword, hashPassword } from "@/utils/password.js";
import mongoose from "mongoose";
import v from "validator";

const UserSchema = new mongoose.Schema<IUser,object,IUserMethods>({
    username: {
        type: String,
        required: [true,"Username required"],
        minLength: [2,"Username at least two character"],
        // Prevent large data
        maxLength: [60,"Username at most sixty character"],
        match: [/^[A-Za-z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
        trim: true,
        unique: true,
        toLowerCase: true,
        // Remove dangerous character 
        setter: (val: string) => {
            const stripedString = '\'`"\\\\/<>&';
            return v.blacklist(val,stripedString);
        },
        cast: '{VALUE} is not a string'
    },
    email: {
        type: String,
        required: [true,"Email required"],
        // Prevent large data
        maxLength: [60,"Email at most sixty character"],
        trim: true,
        unique: true,
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
    password: {
        type: String,
        minLength: [8,"Password at least eight character"],
        trim: true,
        required: [true,"Password required"],
        // Prevent accidentally select
        select: false,
        validate: {
           validator: (val: string) => {
               return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(val);
           },
           message: "Password should include small and big letter and number and one special character"
        },
        cast: '{VALUE} is not a string'
    },
    avatar: {
        type: String,
        trim: true,
        default: "https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
        validate: {
            validator: (val: string) => {
                return v.isURL(val);
            },
            message: "Invalid URL"
        },
        cast: '{VALUE} is not a string'
    },
    loginAttempts: {
        type: Number,
        min: [0,"Attempts time not allow negative"],
        max: [3,"Attempts time not greater than three"],
        default: 0,
        required: [true,"LoginAttempts required"],
        cast: '{VALUE} is not a number'
    },
    lockExpired: {
        type: Number,
        // Minus one for nothing
        default: -1,
        required: [true,"LockExpired required"],
        cast: '{VALUE} is not a number'
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: [true,"IsVerified required"],
        cast: '{VALUE} is not a boolean'
    },
    tokenVersion: {
        type: Number,
        default: 1,
        required: [true,"Token version required"],
        cast: '{VALUE} is not a number'
    }
},{
    timestamps: true
})

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const hashedPassword = await hashPassword(this.password,env.SALT_ROUNDS);
    this.password = hashedPassword;
    return;
})

// Instance method to compare password
UserSchema.methods.comparePassword = async function(password: string) {
    const isMatch = await comparePassword(password, this.password);
    return isMatch;
}
// Handle error after save, such as duplicate key and validation error
UserSchema.post('save', function(error: any, _doc: unknown, _next: unknown) {
    
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
    authLogger.error(`Error saving user: ${error.message}`);
    // Rethrow other errors to be handled by global error handler
    throw new ServerError("An unexpected error occurred while saving the user.");
});

export const UserModel = mongoose.model<IUser,UserModelType>("User",UserSchema);
