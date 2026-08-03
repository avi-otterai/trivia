/**
 * Seeded random number generator using mulberry32 algorithm.
 * Creates deterministic random numbers from a seed value.
 */
export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  /**
   * Returns a random float between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    // mulberry32 algorithm - fast and good quality PRNG
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Returns a random boolean with given probability of true
   */
  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Selects a random element from an array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }

  /**
   * Shuffles an array in place using Fisher-Yates algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Creates a seed value from a date string (YYYY-MM-DD format)
 */
export function dateToSeed(date: Date): number {
  // UTC, so every player worldwide gets the same puzzle at the same instant.
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  // Create a unique number for each day
  return year * 10000 + month * 100 + day;
}

/**
 * Gets today's date string in UTC, so the daily rolls over simultaneously
 * everywhere rather than 24 different times depending on the player.
 */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Milliseconds until the next daily puzzle (00:00 UTC).
 */
export function msUntilNextDaily(now: Date = new Date()): number {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  );
  return next - now.getTime();
}

/**
 * Human-readable time until the next puzzle, e.g. "6 hrs left", "45 min left".
 */
export function formatTimeUntilNextDaily(now: Date = new Date()): string {
  const totalMinutes = Math.max(0, Math.floor(msUntilNextDaily(now) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  if (hours >= 1) {
    return `${hours} hr${hours === 1 ? "" : "s"} left`;
  }
  const minutes = totalMinutes % 60;
  if (minutes >= 1) {
    return `${minutes} min left`;
  }
  return "new puzzle any moment";
}

/**
 * Gets a seeded random instance for today's date
 */
export function getTodayRandom(): SeededRandom {
  return new SeededRandom(dateToSeed(new Date()));
}

