export type City =
    | 'Paris'
    | 'Cologne'
    | 'Brussels'
    | 'Amsterdam'
    | 'Hamburg'
    | 'Dusseldorf';

export type HousingType = 'apartment' | 'house' | 'room' | 'hotel';

export type Amenity =
    | 'Breakfast'
    | 'Air conditioning'
    | 'Laptop friendly workspace'
    | 'Baby seat'
    | 'Washer'
    | 'Towels'
    | 'Fridge';

export interface Coordinates {
    latitude: number;
    longitude: number;
}
