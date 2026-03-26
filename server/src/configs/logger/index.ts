import { createServiceLogger } from "./createLogger.js";


const defaultLogger = createServiceLogger("Expense Tracker");

const dbLogger = createServiceLogger("MongoDb");

export {
    defaultLogger,
    dbLogger
}