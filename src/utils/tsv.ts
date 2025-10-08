import type { Offer } from '../types/offer.js';
import type { Amenity, City, HousingType } from '../types/common.js';

export function parseTsvLine(line: string): Offer {
    const parts = line.split('\t');

    const [
        title,
        description,
        postDateStr,
        cityStr,
        previewImage,
        photosStr,
        isPremiumStr,
        isFavoriteStr,
        ratingStr,
        typeStr,
        bedroomsStr,
        maxAdultsStr,
        priceStr,
        amenitiesStr,
        authorName,
        authorEmail,
        authorTypeStr,
        authorAvatar,
        coordsStr
    ] = parts;

    const postDate = new Date((postDateStr || '').trim());
    const city = (cityStr || '').trim() as City;
    const photos = (photosStr || '').split(';').map(s => s.trim()).filter(Boolean);
    const isPremium = ((isPremiumStr || '').trim().toLowerCase() === 'true');
    const isFavorite = ((isFavoriteStr || '').trim().toLowerCase() === 'true');
    const rating = Number(ratingStr);
    const type = (typeStr || '').trim() as HousingType;
    const bedrooms = Number(bedroomsStr);
    const maxAdults = Number(maxAdultsStr);
    const price = Number(priceStr);
    const amenities = (amenitiesStr || '').split(';').map(s => s.trim()).filter(Boolean) as Amenity[];
    const [latStr, lonStr] = (coordsStr || '').split(';').map(s => s.trim());
    const latitude = Number(latStr);
    const longitude = Number(lonStr);

    return {
        title: (title || '').trim(),
        description: (description || '').trim(),
        postDate,
        city,
        previewImage: (previewImage || '').trim(),
        photos,
        isPremium,
        isFavorite,
        rating,
        type,
        bedrooms,
        maxAdults,
        price,
        amenities,
        author: {
            name: (authorName || '').trim(),
            email: (authorEmail || '').trim(),
            avatarUrl: (authorAvatar || '').trim() || undefined,
            type: ((authorTypeStr || '').trim() === 'pro') ? 'pro' : 'regular'
        },
        commentsCount: 0,
        coordinates: {
            latitude,
            longitude
        }
    };
}
