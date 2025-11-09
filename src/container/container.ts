import { Container } from 'inversify';
import { TYPES } from './types.js';
import { PinoLoggerService } from '../logger/logger.js';
import { ConfigService } from '../config/service.js';
import { Application } from '../app/application.js';
import { DatabaseService } from '../db/database.js';
import { UserModel } from '../db/models/user.js';
import { OfferModel } from '../db/models/offer.js';
import { CommentModel } from '../db/models/comment.js';
import { FavoriteModel } from '../db/models/favorite.js';
import { UserRepository } from '../db/repositories/user.js';
import { OfferRepository } from '../db/repositories/offer.js';
import { CommentRepository } from '../db/repositories/comment.js';
import { FavoriteRepository } from '../db/repositories/favorite.js';
import { IUserRepository, IOfferRepository, ICommentRepository, IFavoriteRepository } from '../db/repositories/interfaces.js';
import { OfferService } from '../services/offer.js';
import { CommentService } from '../services/comment.js';
import { FavoriteService } from '../services/favorite.js';

export const container = new Container({ defaultScope: 'Singleton' });

container.bind<PinoLoggerService>(TYPES.Logger).to(PinoLoggerService);
container.bind<ConfigService>(TYPES.Config).to(ConfigService);
container.bind<Application>(TYPES.Application).to(Application);
container.bind<DatabaseService>(TYPES.Database).to(DatabaseService);

container.bind<IUserRepository>(TYPES.UserRepository).toDynamicValue(() => new UserRepository(UserModel));
container.bind<IOfferRepository>(TYPES.OfferRepository).toDynamicValue(() => new OfferRepository(OfferModel));
container.bind<ICommentRepository>(TYPES.CommentRepository).toDynamicValue(() => new CommentRepository(CommentModel));
container.bind<IFavoriteRepository>(TYPES.FavoriteRepository).toDynamicValue(() => new FavoriteRepository(FavoriteModel));

container.bind<OfferService>(TYPES.OfferService).to(OfferService);
container.bind<CommentService>(TYPES.CommentService).to(CommentService);
container.bind<FavoriteService>(TYPES.FavoriteService).to(FavoriteService);
