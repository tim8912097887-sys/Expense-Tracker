import { Redis } from "ioredis";
import { env } from "./env.js";
import { redisLogger as logger } from "./logger/index.js";

        export const redisInstance = new Redis(env.REDIS_URL,{
               retryStrategy: (times: number) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
               },
               maxRetriesPerRequest: 5
        });

        // Event listeners for Redis connection
        redisInstance.on('connect', () => {
            logger.info('Connected to Redis');
        });

        redisInstance.on('error', (error: any) => {
            logger.error('Redis connection error:', error);
        });

        redisInstance.on('close', () => {
            logger.warn('Redis connection closed');
        });

        redisInstance.on('reconnecting', () => {
            logger.info('Reconnecting to Redis...');
        });

        redisInstance.on('ready', () => {
            logger.info('Redis client is ready');
        });

        redisInstance.on('end', () => {
            logger.info('Redis connection ended');
        });
    

    export const closeConnection = async() => {
            try {
              await redisInstance.quit();
              logger.info(`Redis Connection closed`);   
            } catch (error) {
              logger.error(`Redis Connection Error: ${error}`);  
            }
    }
