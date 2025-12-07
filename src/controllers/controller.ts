import { Router, type RequestHandler, type Response } from 'express';
import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { PinoLoggerService } from '../logger/logger.js';
import type { Middleware } from '../middlewares/middleware.interface.js';

export type HttpMethod = 'get' | 'post' | 'patch' | 'delete' | 'put';

export interface RouteConfig {
  method: HttpMethod;
  path: string;
  handlers: RequestHandler[];
  middlewares?: Middleware[];
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
    const { method, path, handlers, middlewares } = config;

    if (!this.router[method]) {
      return;
    }

    const boundMiddlewares =
      middlewares?.map((m) => m.execute.bind(m)) ?? [];

    this.router[method](path, ...boundMiddlewares, ...handlers);
    this.logger.info(
      `Route registered: [${method.toUpperCase()}] ${this.basePath}${path}`
    );
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
