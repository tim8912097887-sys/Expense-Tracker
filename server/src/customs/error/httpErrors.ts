import {
  ApiError,
  ERROR_CODE,
  ERROR_TYPE,
} from './api.js';

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(ERROR_CODE.BAD_REQUEST, ERROR_TYPE.BAD_REQUEST, message, true);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(ERROR_CODE.FORBIDDEN, ERROR_TYPE.FORBIDDEN, message, true);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(ERROR_CODE.NOT_FOUND, ERROR_TYPE.NOT_FOUND, message, true);
  }
}

export class ServerError extends ApiError {
  constructor(message: string) {
    super(ERROR_CODE.SERVER_ERROR, ERROR_TYPE.SERVER_ERROR, message, true);
  }
}

export class ServerConflictError extends ApiError {
  constructor(message: string) {
    super(ERROR_CODE.SERVER_CONFLICT, ERROR_TYPE.SERVER_CONFLICT, message, true);
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(message: string) {
    super(ERROR_CODE.TOO_MANY_REQUEST, ERROR_TYPE.TOO_MANY_REQUEST, message, true);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(ERROR_CODE.UNAUTHORIZED, ERROR_TYPE.UNAUTHORIZED, message, true);
  }
}

export class ServerUnavailableError extends ApiError {
  constructor(message: string) {
    super(ERROR_CODE.SERVER_UNAVAILABLE, ERROR_TYPE.SERVER_UNAVAILABLE, message, true);
  }
}