import type { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { TYPES } from '../container/types.js';
import { Controller } from './controller.js';
import { PinoLoggerService } from '../logger/logger.js';
import type { IUserRepository, WithId } from '../db/repositories/interfaces.js';
import type { UserDB } from '../db/models/user.js';
import { UserRegisterDto, LoginDto } from '../dto/user.js';
import type { UserPublicDto, AuthTokenDto } from '../dto/user.js';
import { HttpError } from '../errors/http-error.js';
import { ValidateDtoMiddleware } from '../middlewares/validate-dto.js';
import { ValidateObjectIdMiddleware } from '../middlewares/validate-object-id.js';
import { UploadFileMiddleware } from '../middlewares/upload-file.js';
import { ConfigService } from '../config/service.js';

@injectable()
export class AuthController extends Controller {
  constructor(
    @inject(TYPES.Logger) logger: PinoLoggerService,
    @inject(TYPES.UserRepository) private readonly users: IUserRepository,
    @inject(TYPES.Config) private readonly config: ConfigService
  ) {
    super(logger, '/auth');

    this.addRoute({
      method: 'post',
      path: '/register',
      middlewares: [new ValidateDtoMiddleware(UserRegisterDto)],
      handlers: [asyncHandler(this.create.bind(this))]
    });

    this.addRoute({
      method: 'post',
      path: '/login',
      middlewares: [new ValidateDtoMiddleware(LoginDto)],
      handlers: [asyncHandler(this.login.bind(this))]
    });

    this.addRoute({
      method: 'get',
      path: '/status',
      handlers: [asyncHandler(this.status.bind(this))]
    });

    this.addRoute({
      method: 'post',
      path: '/:userId/avatar',
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware('avatar', this.config.getUploadDir())
      ],
      handlers: [asyncHandler(this.uploadAvatar.bind(this))]
    });
  }

  private async create(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const payload = req.body as UserRegisterDto;

    const existing = await this.users.findByEmail(payload.email);
    if (existing) {
      throw new HttpError(StatusCodes.CONFLICT, 'User with this email already exists');
    }

    const data: Partial<UserDB> = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      type: payload.type
    };

    const created = await this.users.create(data);
    const dto: UserPublicDto = this.toUserPublicDto(created);
    this.created(res, dto);
  }

  private async login(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const payload = req.body as LoginDto;

    const user = await this.users.findByEmail(payload.email);
    if (!user || !user.password || user.password !== payload.password) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    const tokenDto: AuthTokenDto = {
      token: user.email
    };

    this.ok(res, tokenDto);
  }

  private async status(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization header is missing');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Token is missing');
    }

    const user = await this.users.findByEmail(token);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'User not found for this token');
    }

    const dto = this.toUserPublicDto(user);
    this.ok(res, dto);
  }

  private async uploadAvatar(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { userId } = req.params;

    if (!req.file) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Avatar file is required');
    }

    const avatarUrl = `/static/${req.file.filename}`;

    const updated = await this.users.updateAvatar(userId, avatarUrl);
    if (!updated) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const dto = this.toUserPublicDto(updated);
    this.ok(res, dto);
  }

  private toUserPublicDto(user: WithId<UserDB>): UserPublicDto {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      type: user.type
    };
  }
}
