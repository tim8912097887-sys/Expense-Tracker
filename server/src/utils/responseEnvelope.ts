import { ERROR_CODE, ERROR_TYPE } from "@/customs/error/api.js";

type State = "success" | "error" | "redirect"

export type ErrorObject = {
      status: ERROR_TYPE
      code: ERROR_CODE
      detail: string
}

type Data = null | object

type Params = {
    state: State
    data?: Data
    error?: ErrorObject
}
type ResponseStructure = {
    state: State
    error: ErrorObject | null
    data: Data
    meta: {
        timestamp: string
    }
}

export const responseEnvelope = (params: Params) => {
    
    const baseResponse: ResponseStructure = {
        state: params.state,
        error: null,
        data: null,
        meta: {
            timestamp: new Date().toISOString()
        }
    }
    // Only include error or data when they exist to reduce response size
    if (params.error) {
        baseResponse.error = params.error;
    }   
    if (params.data) {
        baseResponse.data = params.data;
    }

    return baseResponse;
}