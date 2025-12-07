import type { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http-error.js';
import type { Middleware } from './middleware.interface.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private readonly dtoClass: new () => object) {}

  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const instance = plainToInstance(this.dtoClass, req.body);
      const errors = await validate(instance, {
        whitelist: true,
        forbidUnknownValues: true
      });

      if (errors.length > 0) {
        const messages = errors.flatMap((error) =>
          error.constraints ? Object.values(error.constraints) : []
        );

        return next(
          new HttpError(StatusCodes.BAD_REQUEST, 'Validation error', messages)
        );
      }

      req.body = instance;
      return next();
    } catch (e) {
      return next(e as Error);
    }
  }
}
