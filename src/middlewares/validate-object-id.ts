import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http-error.js';
import type { Middleware } from './middleware.interface.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private readonly paramName: string) {}

  execute(req: Request, _res: Response, next: NextFunction): void {
    const id = req.params[this.paramName];

    if (!id || !Types.ObjectId.isValid(id)) {
      next(
        new HttpError(
          StatusCodes.BAD_REQUEST,
          `${this.paramName} must be a valid Mongo ObjectId`
        )
      );
      return;
    }

    next();
  }
}
