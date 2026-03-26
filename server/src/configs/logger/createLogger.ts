import winston,{ format,transports } from "winston"
import { env } from "../env.js"

const { combine,timestamp,errors,printf } = format;

const devFormat = printf(({ level, message, service, timestamp }) => {
  return `${timestamp} ${service} [${level}]: ${message}`;
});

export const createServiceLogger = (service: string) => {
    const logger = winston.createLogger({
        level: env.LOG_LEVEL,
        defaultMeta: { service },
        format: combine(
            timestamp(),
            errors({ stack: true }),
            devFormat),
        transports: [
            new transports.Console(),
            new transports.File({
                level: "error",
                filename: "src/logs/error.log"
            }),
            new transports.File({
                level: "info",
                filename: "src/logs/combine.log"
            }),
        ],
        exceptionHandlers: [
            new transports.File({
                filename: "src/logs/exception.log"
            })
        ],
        rejectionHandlers: [
            new transports.File({
                filename: "src/logs/rejection.log"
            })
        ]
    })

    // Handle logger error
    logger.on("error",(err: unknown) => {
          console.error(`Logging Error: ${err}`);
    })
    return logger;
}