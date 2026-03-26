import { responseEnvelope } from "@/utils/responseEnvelope.js";
import { ERROR_CODE, ERROR_TYPE } from "@/customs/error/api.js";
import { RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (_req, res) => {
    res.status(404).json(responseEnvelope({
        state: "error",
        error: {
            status: ERROR_TYPE.NOT_FOUND,
            code: ERROR_CODE.NOT_FOUND,
            detail: "The requested resource was not found."
        }
    }))
}