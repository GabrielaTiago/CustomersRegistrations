import { TServerErrorsTypes } from '../types/errorsTypes';

export interface IServerError {
    type: TServerErrorsTypes;
    message: string;
}
