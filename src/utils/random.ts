export function randInt(min: number, max: number): number {
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function randFloat(min: number, max: number, digits = 1): number {
  const n = Math.random() * (max - min) + min;
  const p = Math.pow(10, digits);
  return Math.round(n * p) / p;
}

export function pickOne<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function chance(p = 0.5): boolean {
  return Math.random() < p;
}
