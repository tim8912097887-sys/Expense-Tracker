export enum ERROR_CODE {
   BAD_REQUEST = 400,
   NOT_FOUND = 404,
   UNAUTHORIZED = 401,
   FORBIDDEN = 403,
   SERVER_ERROR = 500,
   SERVER_CONFLICT = 409,
   TOO_MANY_REQUEST = 429,
   SERVER_UNAVAILABLE = 503
}

export enum ERROR_TYPE {
   BAD_REQUEST = 'BadRequest',
   NOT_FOUND = 'NotFound',
   UNAUTHORIZED = 'Unauthorized',
   FORBIDDEN = 'Forbidden',
   SERVER_ERROR = 'ServerError',
   SERVER_CONFLICT = 'ServerConflict',
   TOO_MANY_REQUEST = 'TooManyRequest',
   SERVER_UNAVAILABLE = 'ServerUnavailable'
}

export class ApiError extends Error {

    public type: ERROR_TYPE;
    public statusCode:  ERROR_CODE;
    public isOperational: boolean;

    constructor(errorCode: ERROR_CODE,errorType: ERROR_TYPE,message: string,isOperational = false) {
        super(message);
        this.statusCode = errorCode;
        this.type = errorType;
        this.isOperational = isOperational;
        // Retain the property and instance name of the ApiError
        Object.setPrototypeOf(this, new.target.prototype);
        // Capture the stack trace, excluding the constructor from the trace
        Error.captureStackTrace(this, this.constructor);
    }
}