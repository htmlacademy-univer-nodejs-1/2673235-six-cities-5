import { Router, type RequestHandler, type Response } from 'express';
import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { PinoLoggerService } from '../logger/logger.js';

export type HttpMethod = 'get' | 'post' | 'patch' | 'delete' | 'put';

export interface RouteConfig {
  method: HttpMethod;
  path: string;
  handlers: RequestHandler[];
}

@injectable()
export abstract class Controller {
  public readonly router: Router;
  public readonly basePath: string;
  protected readonly logger: PinoLoggerService;

  constructor(logger: PinoLoggerService, basePath: string) {
    this.logger = logger;
    this.router = Router();
    this.basePath = basePath;
  }

  protected addRoute(config: RouteConfig): void {
    const method = config.method;
    const handlers = config.handlers;
    if (!this.router[method]) {
      return;
    }
    this.router[method](config.path, ...handlers);
    this.logger.info(`Route registered: [${method.toUpperCase()}] ${this.basePath}${config.path}`);
  }

  protected ok<T>(res: Response, dto: T): void {
    res.status(StatusCodes.OK).json(dto);
  }

  protected created<T>(res: Response, dto: T): void {
    res.status(StatusCodes.CREATED).json(dto);
  }

  protected noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).end();
  }
}
