import 'reflect-metadata';
import { container } from './container/container.js';
import { TYPES } from './container/types.js';
import { Application } from './app/application.js';

async function bootstrap(): Promise<void> {
  const app = container.get<Application>(TYPES.Application);
  await app.init();
}

bootstrap().catch((e) => {
  console.error('Bootstrap error:', e);
  process.exit(1);
});
