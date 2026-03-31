import { Response } from "express"
import { responseEnvelope } from "./responseEnvelope.js"

export const sendSuccessResponse = (res: Response, data: object, statusCode = 200) => {
    res.status(statusCode).json(responseEnvelope({
        state: 'success',
        data
    }))
}