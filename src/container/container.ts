import { Container } from 'inversify';
import { TYPES } from './types.js';
import { PinoLoggerService } from '../logger/logger.js';
import { ConfigService } from '../config/service.js';
import { Application } from '../app/application.js';
import { DatabaseService } from '../db/database.js';
import { UserModel } from '../db/models/user.js';
import { OfferModel } from '../db/models/offer.js';
import { UserRepository } from '../db/repositories/user.js';
import { OfferRepository } from '../db/repositories/offer.js';
import { IUserRepository, IOfferRepository } from '../db/repositories/interfaces.js';

export const container = new Container({
  defaultScope: 'Singleton'
});

container.bind<PinoLoggerService>(TYPES.Logger).to(PinoLoggerService);
container.bind<ConfigService>(TYPES.Config).to(ConfigService);
container.bind<Application>(TYPES.Application).to(Application);
container.bind<DatabaseService>(TYPES.Database).to(DatabaseService);
container.bind<IUserRepository>(TYPES.UserRepository).toDynamicValue(() => new UserRepository(UserModel));
container.bind<IOfferRepository>(TYPES.OfferRepository).toDynamicValue(() => new OfferRepository(OfferModel));
