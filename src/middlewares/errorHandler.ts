import { NextFunction, Request, Response } from 'express';
import { errorTypesStatusCode, isAppError } from '../errors/serverErrors';
import { IServerError } from '../interfaces/errorInterface';

export function errorHandler(err: Error | IServerError, req: Request, res: Response, next: NextFunction) {
    if (isAppError(err)) {
        return res.status(errorTypesStatusCode(err.type)).send(err.message);
    }
    console.error(err);
    return res.sendStatus(500);
}
