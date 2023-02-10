import { IServerError } from '../interfaces/errorInterface';
import { TServerErrorsTypes } from '../types/errorsTypes';

export function isAppError(error: object): error is IServerError {
    return (error as IServerError).type !== undefined;
}

export function errorTypesStatusCode(type: TServerErrorsTypes) {
    if (type === 'unauthorized') return 401;
    if (type === 'forbidden') return 403;
    if (type === 'not_found') return 404;
    if (type === 'conflict') return 409;
    if (type === 'wrong_schema') return 422;
    return 400;
}

export function unauthorizedError(message?: string): IServerError {
    return { type: 'unauthorized', message: message ?? '' };
}

export function forbiddenError(message?: string): IServerError {
    return { type: 'forbidden', message: message ?? '' };
}

export function notFoundError(message?: string): IServerError {
    return { type: 'not_found', message: message ?? '' };
}

export function conflictError(message?: string): IServerError {
    return { type: 'conflict', message: message ?? '' };
}

export function wrongSchemaError(message?: string): IServerError {
    return { type: 'wrong_schema', message: message ?? '' };
}
