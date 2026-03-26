import { CleanupFn } from "@/types/index.js";
const shudownLists: CleanupFn[] = [];

export const shutdown = async(): Promise<void> => {
    for (const cleanup of shudownLists) {
        await cleanup();
    }
}

export const subscribeShutdown = (cleanup: CleanupFn) => {
    shudownLists.push(cleanup);
}