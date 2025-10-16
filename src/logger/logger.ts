import { injectable } from 'inversify';
import pino, { Logger as PinoLogger } from 'pino';

@injectable()
export class PinoLoggerService {
  private logger: PinoLogger;

  constructor() {
    const isProd = process.env.NODE_ENV === 'production';
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      base: undefined,
      timestamp: pino.stdTimeFunctions.isoTime
    }, isProd ? undefined : undefined);
  }

  info(message: string, meta?: unknown): void {
    if (meta) {
      this.logger.info(meta, message);
      return;
    }
    this.logger.info(message);
  }

  warn(message: string, meta?: unknown): void {
    if (meta) {
      this.logger.warn(meta, message);
      return;
    }
    this.logger.warn(message);
  }

  error(message: string, meta?: unknown): void {
    if (meta) {
      this.logger.error(meta, message);
      return;
    }
    this.logger.error(message);
  }

  debug(message: string, meta?: unknown): void {
    if (meta) {
      this.logger.debug(meta, message);
      return;
    }
    this.logger.debug(message);
  }
}