import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { TYPES } from '../container/types.js';
import { PinoLoggerService } from '../logger/logger.js';
import { HttpError } from './http-error.js';

export interface IExceptionFilter {
  catch(error: unknown, req: Request, res: Response, next: NextFunction): void;
}

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.Logger) private readonly logger: PinoLoggerService) {}

  catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) {
      next(error);
      return;
    }

    if (error instanceof HttpError) {
      this.logger.warn(error.message, {
        url: req.url,
        statusCode: error.statusCode,
        details: error.details
      });
      res.status(error.statusCode).json({
        error: error.message
      });
      return;
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    this.logger.error(message, { url: req.url });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    });
  }
}
