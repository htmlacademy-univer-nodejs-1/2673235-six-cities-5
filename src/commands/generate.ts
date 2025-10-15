import axios from 'axios';
import { createWriteStream } from 'node:fs';
import { once } from 'node:events';
import type { OfferBaseDto } from '../types/mock.js';
import { randInt, randFloat, chance, pickOne } from '../utils/random.js';

function makeTsvLineFromBase(base: OfferBaseDto): string {
  const postDate = new Date(Date.now() - randInt(0, 30) * 24 * 60 * 60 * 1000).toISOString();
  const isPremium = chance(0.25);
  const isFavorite = false;
  const rating = randFloat(1, 5, 1);
  const bedrooms = randInt(1, 8);
  const maxAdults = randInt(1, 10);
  const price = randInt(100, 5000);

  const photos = [...base.photos];
  while (photos.length < 6) {
    photos.push(pickOne(base.photos));
  }
  const photosStr = photos.slice(0, 6).join(';');
  const amenitiesStr = base.amenities.join(';');

  const parts = [
    base.title,
    base.description,
    postDate,
    base.city,
    base.previewImage,
    photosStr,
    String(isPremium),
    String(isFavorite),
    String(rating),
    base.type,
    String(bedrooms),
    String(maxAdults),
    String(price),
    amenitiesStr,
    base.authorName,
    base.authorEmail,
    base.authorType,
    base.authorAvatar || '',
    base.coordinates
  ];

  return `${parts.join('\t')}\n`;
}

export async function generateTsv(n: number, filePath: string, url: string): Promise<void> {
  const baseUrl = url.replace(/\/+$/, '');
  const { data } = await axios.get<OfferBaseDto[]>(`${baseUrl}/offersBase`);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Сервис не вернул offersBase');
  }

  const ws = createWriteStream(filePath, { flags: 'w' });

  for (let i = 0; i < n; i += 1) {
    const base = pickOne(data);
    const line = makeTsvLineFromBase(base);
    const canWrite = ws.write(line, 'utf8');
    if (!canWrite) {
      await once(ws, 'drain');
    }
  }

  await new Promise<void>((resolve, reject) => {
    ws.end(() => resolve());
    ws.on('error', (e) => reject(e));
  });
}
