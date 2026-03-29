import { createServiceLogger } from "./createLogger.js";


const defaultLogger = createServiceLogger("Expense Tracker");

const dbLogger = createServiceLogger("MongoDb");

const authLogger = createServiceLogger("Auth Service");

const redisLogger = createServiceLogger("Redis Service");

export {
    defaultLogger,
    dbLogger,
    authLogger,
    redisLogger
}