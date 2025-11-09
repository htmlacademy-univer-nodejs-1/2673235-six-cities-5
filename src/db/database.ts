import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { TYPES } from '../container/types.js';
import { PinoLoggerService } from '../logger/logger.js';

@injectable()
export class DatabaseService {
  constructor(@inject(TYPES.Logger) private readonly logger: PinoLoggerService) {}

  async connect(uri: string): Promise<void> {
    this.logger.info(`DB connect try: ${uri}`);
    await mongoose.connect(uri);
    this.logger.info('DB connected');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('DB disconnected');
  }
}
