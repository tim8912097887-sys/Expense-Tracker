import mongoose from "mongoose"
import { dbLogger } from "@/configs/logger/index.js"
import { env } from "@/configs/env.js"
import { subscribeShutdown } from "@/utils/shutdown.js";

export const dbConnection = async() => {
    // Handle database event
    mongoose.connection.on("error",(error) => {
      dbLogger.error(`Database Connection Error: ${error.message}`);
    });
    mongoose.connection.on("connected",() => dbLogger.info(`Database Connected`));
    mongoose.connection.on("disconnecting",() => dbLogger.info(`Database is disconnecting`));
    mongoose.connection.on("reconnected",() => dbLogger.info(`Database is reconnected`));
    const start = Date.now();
    try {
        await mongoose.connect(env.MONGO_URI,{
            // Fail fast to try next server
            connectTimeoutMS: 5000,
            // Handle high traffic
            maxPoolSize: 20,
            // Prevent sudden burst of traffic
            minPoolSize: 5,
            // Speed up connection time by not search IP6
            family: 4,
            // Fail fast to reconnect
            serverSelectionTimeoutMS: 10000,
            // Prevent not connected socket be use
            maxIdleTimeMS: 60000,
            // General waiting time
            socketTimeoutMS: 45000,
            // Enhance initialize speed in production
            autoIndex: env.NODE_ENV === 'development',
            // Detect failure fast
            heartbeatFrequencyMS: 5000
        })
        // Subscribe to shutdown lists
        subscribeShutdown(dbDisconnection);
        dbLogger.info(`Database connection: Successfully register shutdown list`);
    } catch (error: unknown) {
        const duration = Date.now() - start;
        dbLogger.error(`Database connection failed after ${duration}ms`);
        // Rethrow error handle by shutdown function
        dbLogger.error(`Database Connection Error: ${error}`);
        throw error;
    }
} 

const dbDisconnection = async() => {
    await mongoose.connection.close();
}

