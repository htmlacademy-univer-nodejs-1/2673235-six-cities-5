export interface OfferCreateDto {
  title: string
  description: string
  city: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'
  previewImage: string
  photos: string[]
  isPremium: boolean
  isFavorite: boolean
  type: 'apartment' | 'house' | 'room' | 'hotel'
  bedrooms: number
  maxAdults: number
  price: number
  amenities: Array<'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge'>
  authorId: string
  coordinates: { latitude: number; longitude: number }
}

export interface OfferUpdateDto {
  title?: string
  description?: string
  city?: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'
  previewImage?: string
  photos?: string[]
  isPremium?: boolean
  isFavorite?: boolean
  type?: 'apartment' | 'house' | 'room' | 'hotel'
  bedrooms?: number
  maxAdults?: number
  price?: number
  amenities?: Array<'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge'>
  coordinates?: { latitude: number; longitude: number }
}
