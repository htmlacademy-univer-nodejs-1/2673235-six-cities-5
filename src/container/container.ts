import { Container } from 'inversify';
import { TYPES } from './types.js';
import { PinoLoggerService } from '../logger/logger.js';
import { ConfigService } from '../config/service.js';
import { Application } from '../app/application.js';

export const container = new Container({ 
    defaultScope: 'Singleton', 
});

container.bind<PinoLoggerService>(TYPES.Logger).to(PinoLoggerService);
container.bind<ConfigService>(TYPES.Config).to(ConfigService);
container.bind<Application>(TYPES.Application).to(Application);