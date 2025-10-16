import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types.js';
import { PinoLoggerService } from '../logger/logger.js';
import { ConfigService } from '../config/service.js';

@injectable()
export class Application {
  constructor(
    @inject(TYPES.Logger) private readonly logger: PinoLoggerService,
    @inject(TYPES.Config) private readonly config: ConfigService
  ) {}

  async init(): Promise<void> {
    this.logger.info('App runs');
    const port = this.config.getPort();
    this.logger.info(`Port: ${port}`);
  }
}