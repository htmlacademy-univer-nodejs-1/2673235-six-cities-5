import chalk from 'chalk';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import { parseTsvLine } from '../utils/tsv.js';
import { container } from '../container/container.js';
import { TYPES } from '../container/types.js';
import { DatabaseService } from '../db/database.js';
import { IUserRepository, IOfferRepository } from '../db/repositories/interfaces.js';

function isHeader(line: string): boolean {
  const lower = line.trim().toLowerCase();
  return lower.startsWith('title\t') || lower.includes('\ttitle\t') || lower.endsWith('\ttitle');
}

function toNumberSafe(v: unknown, def = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(String(v ?? '').replace(',', '.').trim());
  return Number.isFinite(n) ? n : def;
}

function toDateSafe(v: unknown, def = new Date()): Date {
  if (v instanceof Date && !isNaN(v.valueOf())) return v;
  const d = new Date(String(v ?? ''));
  return isNaN(d.valueOf()) ? def : d;
}

function toBoolSafe(v: unknown, def = false): boolean {
  if (typeof v === 'boolean') return v;
  const s = String(v ?? '').toLowerCase().trim();
  if (s === 'true' || s === '1' || s === 'yes') return true;
  if (s === 'false' || s === '0' || s === 'no') return false;
  return def;
}

function toStringSafe(v: unknown, def = ''): string {
  const s = String(v ?? '').trim();
  return s.length ? s : def;
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).map((x) => x.trim()).filter(Boolean);
  const s = String(v ?? '');
  if (!s) return [];
  const sep = s.includes(';') ? ';' : s.includes(',') ? ',' : ' ';
  return s.split(sep).map((x) => x.trim()).filter(Boolean);
}

export async function importTsv(filePath: string, mongoUri: string): Promise<void> {
  const exists = await fs.access(filePath).then(() => true).catch(() => false);
  if (!exists) {
    console.error(chalk.red(`Файл не найден: ${filePath}`));
    process.exitCode = 1;
    return;
  }

  const db = container.get<DatabaseService>(TYPES.Database);
  const userRepo = container.get<IUserRepository>(TYPES.UserRepository);
  const offerRepo = container.get<IOfferRepository>(TYPES.OfferRepository);

  console.log(chalk.blueBright(`Подключение к БД: ${mongoUri}`));
  await db.connect(mongoUri);
  console.log(chalk.green('Подключено к MongoDB'));

  const rl = readline.createInterface({
    input: createReadStream(filePath),
    crlfDelay: Infinity
  });

  let imported = 0;

  console.log(chalk.blueBright(`Импорт из: ${filePath}\n`));

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    if (isHeader(trimmed)) continue;

    const raw = parseTsvLine(trimmed) as any;

    const userEmail = toStringSafe(raw.author?.email);
    const userName = toStringSafe(raw.author?.name, 'Anonymous');
    const userAvatar = toStringSafe(raw.author?.avatarUrl);
    const userType = toStringSafe(raw.author?.type, 'regular');

    let user = await userRepo.findByEmail(userEmail);
    if (!user) {
      user = await userRepo.create({
        name: userName,
        email: userEmail,
        avatarUrl: userAvatar || undefined,
        type: userType as any
      });
    }

    const title = toStringSafe(raw.title, 'Untitled offer');
    const description = toStringSafe(raw.description, 'No description');
    const postDate = toDateSafe(raw.postDate);
    const city = toStringSafe(raw.city, 'Paris');
    const previewImage = toStringSafe(raw.previewImage, 'http://example.com/preview.jpg');
    const photos = toStringArray(raw.photos);
    const isPremium = toBoolSafe(raw.isPremium, false);
    const isFavorite = toBoolSafe(raw.isFavorite, false);
    const rating = toNumberSafe(raw.rating, 0);
    const type = toStringSafe(raw.type, 'apartment');
    const bedrooms = toNumberSafe(raw.bedrooms, 1);
    const maxAdults = toNumberSafe(raw.maxAdults, 1);
    const price = toNumberSafe(raw.price, 100);
    const amenities = toStringArray(raw.amenities);
    const latitude = toNumberSafe(raw.coordinates?.latitude, 0);
    const longitude = toNumberSafe(raw.coordinates?.longitude, 0);

    try {
      await offerRepo.create({
        title,
        description,
        postDate,
        city: city as any,
        previewImage,
        photos,
        isPremium,
        isFavorite,
        rating,
        type: type as any,
        bedrooms,
        maxAdults,
        price,
        amenities: amenities as any,
        author: (user as any)._id,
        commentsCount: toNumberSafe(raw.commentsCount, 0),
        coordinates: { latitude, longitude }
      });
      imported += 1;
      console.log(`${chalk.bold(title)} ${chalk.gray(`[${city}]`)} ${chalk.yellow(`€${price}`)} ${chalk.gray(`(${type}, rating ${rating})`)}`);
    } catch (e) {
      console.error(chalk.red((e as Error).message));
    }
  }

  console.log(`\n${chalk.cyan.bold(`Импортировано: ${imported}`)}`);
  await db.disconnect();
  console.log(chalk.gray('Соединение с MongoDB закрыто'));
}
