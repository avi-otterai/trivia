import {
  SeededRandom,
  dateToSeed,
  getTodayDateString,
  formatTimeUntilNextDaily,
} from "./seeded-random";

export { formatTimeUntilNextDaily };

const DAILY_STREAK_KEY = "dailyStreak";
const DAILY_HISTORY_KEY = "dailyHistory";
const DAILY_LAST_PLAYED_KEY = "dailyLastPlayed";
const DAILY_COMPLETED_KEY = "dailyCompleted";
const DAILY_SAVED_RESULT_KEY = "dailySavedResult";

export interface SavedDailyResult {
  date: string;
  score: number;
  placements: boolean[];
  dimensionName: string;
}

export interface DailyResult {
  date: string;
  score: number;
  placements: boolean[]; // true = correct, false = incorrect
}

export interface DailyStreak {
  current: number;
  history: DailyResult[];
}

/**
 * Check if running on localhost (dev mode)
 */
export function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

/**
 * Gets the seeded random instance for today's daily game
 */
export function getDailyRandom(): SeededRandom {
  return new SeededRandom(dateToSeed(new Date()));
}

/**
 * Selects a dimension for today's daily game
 */
export function getDailyDimensionName(
  dimensionNames: string[],
  random: SeededRandom
): string {
  return random.pick(dimensionNames);
}

/**
 * Gets the current daily streak from localStorage
 */
export function getDailyStreak(): DailyStreak {
  if (typeof window === "undefined") {
    return { current: 0, history: [] };
  }

  const current = parseInt(localStorage.getItem(DAILY_STREAK_KEY) || "0", 10);
  const historyStr = localStorage.getItem(DAILY_HISTORY_KEY);
  const history: DailyResult[] = historyStr ? JSON.parse(historyStr) : [];

  return { current, history };
}

/**
 * Checks if today's daily game has been completed
 */
export function hasDailyBeenCompleted(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const lastCompleted = localStorage.getItem(DAILY_COMPLETED_KEY);
  const today = getTodayDateString();
  return lastCompleted === today;
}

/**
 * Resets today's daily progress (for dev mode only)
 */
export function resetTodayDaily(): void {
  if (typeof window === "undefined") return;
  
  const today = getTodayDateString();
  const { history } = getDailyStreak();
  
  // Remove today's entry from history if exists
  const filteredHistory = history.filter((h) => h.date !== today);
  localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(filteredHistory));
  
  // Clear completed flag for today
  const lastCompleted = localStorage.getItem(DAILY_COMPLETED_KEY);
  if (lastCompleted === today) {
    localStorage.removeItem(DAILY_COMPLETED_KEY);
  }
  
  // Clear saved result
  localStorage.removeItem(DAILY_SAVED_RESULT_KEY);
}

/**
 * Saves the daily result for later viewing
 */
export function saveDailyResult(
  score: number,
  placements: boolean[],
  dimensionName: string
): void {
  if (typeof window === "undefined") return;
  
  const today = getTodayDateString();
  const savedResult: SavedDailyResult = {
    date: today,
    score,
    placements,
    dimensionName,
  };
  
  localStorage.setItem(DAILY_SAVED_RESULT_KEY, JSON.stringify(savedResult));
}

/**
 * Gets the saved daily result for today (if exists)
 */
export function getSavedDailyResult(): SavedDailyResult | null {
  if (typeof window === "undefined") return null;
  
  const savedStr = localStorage.getItem(DAILY_SAVED_RESULT_KEY);
  if (!savedStr) return null;
  
  try {
    const saved: SavedDailyResult = JSON.parse(savedStr);
    const today = getTodayDateString();
    
    // Only return if it's from today
    if (saved.date === today) {
      return saved;
    }
    
    // Clear old saved result
    localStorage.removeItem(DAILY_SAVED_RESULT_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * Records the result of today's daily game
 * Only stores ONE result per day - updates if already exists
 *
 * The streak counts days *attempted*, not days won. It previously keyed off
 * `won = score > 0`, which was always true because the free pre-placed card
 * made the score at least 1 — so the streak could never break on a bad game,
 * only on a missed day. Counting attempts makes that explicit and honest.
 */
export function recordDailyResult(
  score: number,
  placements: boolean[]
): DailyStreak {
  if (typeof window === "undefined") {
    return { current: 0, history: [] };
  }

  const today = getTodayDateString();
  const lastPlayed = localStorage.getItem(DAILY_LAST_PLAYED_KEY);
  const { current, history } = getDailyStreak();

  // Remove any existing entry for today (replace, don't append)
  const historyWithoutToday = history.filter((h) => h.date !== today);

  // Playing today always extends the streak; only a missed day resets it.
  let newStreak: number;
  if (lastPlayed === today) {
    // Already counted today (dev-mode replay) - don't double-count
    newStreak = Math.max(current, 1);
  } else if (lastPlayed) {
    const daysDiff = Math.round(
      (Date.parse(`${today}T00:00:00Z`) -
        Date.parse(`${lastPlayed}T00:00:00Z`)) /
        86400000
    );
    newStreak = daysDiff === 1 ? current + 1 : 1;
  } else {
    // First time playing
    newStreak = 1;
  }

  // Create result for today
  const result: DailyResult = {
    date: today,
    score,
    placements,
  };

  // Add today's result (keep last 30 days)
  const newHistory = [...historyWithoutToday, result].slice(-30);

  // Save to localStorage
  localStorage.setItem(DAILY_STREAK_KEY, String(newStreak));
  localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(newHistory));
  localStorage.setItem(DAILY_LAST_PLAYED_KEY, today);
  localStorage.setItem(DAILY_COMPLETED_KEY, today);

  return { current: newStreak, history: newHistory };
}

/**
 * Generates the emoji representation for today's gameplay
 * ✅ for correct placements, ❤️ for incorrect placements
 */
export function generatePlayEmojis(placements: boolean[]): string {
  return placements
    .map((correct) => (correct ? "✅" : "❤️"))
    .join("");
}

/**
 * Generates the emoji representation of recent daily game history (for share text)
 * Shows the placements from the most recent game
 */
export function generateHistoryEmojis(history: DailyResult[]): string {
  // Get today's result for display
  const todayResult = history[history.length - 1];
  if (!todayResult || !todayResult.placements) {
    return "";
  }
  
  return generatePlayEmojis(todayResult.placements);
}

/**
 * Gets the emoji for a dimension
 */
export function getDimensionEmoji(dimensionName: string): string {
  const emojiMap: { [key: string]: string } = {
    year: "📅",
    price: "💰",
    speed: "⚡",
    height: "📏",
    population: "👥",
    weight: "⚖️",
    lifespan: "💓",
    distance: "🗺️",
    temperature: "🌡️",
    area: "📐",
    depth: "🌊",
    calories: "🍔",
    duration: "⏱️",
    boxoffice: "🎬",
    albumsales: "💿",
    networth: "💎",
    gamesales: "🎮",
    followers: "👤",
    stadiums: "🏟️",
    horsepower: "🏎️",
    elevation: "🏔️",
    founded: "🏛️",
    oscars: "🏆",
    streams: "🎵",
    preptime: "🍳",
  };
  return emojiMap[dimensionName] || "📊";
}

/**
 * Generates share text for daily game result (simplified format)
 */
export function generateShareText(
  dimensionName: string,
  placements: boolean[]
): string {
  const today = getTodayDateString();
  const playEmojis = generatePlayEmojis(placements);
  const dimensionEmoji = getDimensionEmoji(dimensionName);
  
  return `📅 ${today}\n${dimensionEmoji} ${capitalizeFirst(dimensionName)}\n${playEmojis}\nhttps://avi-trivia.netlify.app`;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

