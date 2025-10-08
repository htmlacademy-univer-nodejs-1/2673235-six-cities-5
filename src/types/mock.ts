export interface OfferBaseDto {
  title: string;
  description: string;
  city: string;
  previewImage: string;
  photos: string[];
  type: 'apartment' | 'house' | 'room' | 'hotel';
  amenities: string[];
  authorName: string;
  authorEmail: string;
  authorType: 'regular' | 'pro';
  authorAvatar: string;
  coordinates: string;
}
