import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http-error.js';
import type { Middleware } from './middleware.interface.js';

export interface EntityService<T> {
  getById(id: string): Promise<T | null>;
}

export class DocumentExistsMiddleware<T> implements Middleware {
  constructor(
    private readonly paramName: string,
    private readonly service: EntityService<T>,
    private readonly notFoundMessage = 'Document not found'
  ) {}

  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const id = req.params[this.paramName];

    if (!id) {
      return next(
        new HttpError(
          StatusCodes.BAD_REQUEST,
          `${this.paramName} route param is required`
        )
      );
    }

    try {
      const doc = await this.service.getById(id);

      if (!doc) {
        return next(
          new HttpError(StatusCodes.NOT_FOUND, this.notFoundMessage)
        );
      }

      return next();
    } catch (e) {
      return next(e as Error);
    }
  }
}
