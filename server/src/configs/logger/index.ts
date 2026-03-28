import { createServiceLogger } from "./createLogger.js";


const defaultLogger = createServiceLogger("Expense Tracker");

const dbLogger = createServiceLogger("MongoDb");

const authLogger = createServiceLogger("Auth Service");

export {
    defaultLogger,
    dbLogger,
    authLogger
}