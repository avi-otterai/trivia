import { Item, PlayedItem } from "../types/item";
import { Dimension } from "../types/dimension";
import { createWikimediaImage } from "./image";
import { SeededRandom } from "./seeded-random";

/**
 * Random number provider interface for flexibility
 */
interface RandomProvider {
  next(): number;
  nextBoolean(probability?: number): boolean;
}

/**
 * Default random provider using Math.random
 */
const defaultRandom: RandomProvider = {
  next: () => Math.random(),
  nextBoolean: (probability = 0.5) => Math.random() > probability,
};

export function getRandomItem(
  deck: Item[],
  played: Item[],
  dimension: Dimension,
  random: RandomProvider = defaultRandom
): Item {
  const periods = dimension.periods || [
    [-100000, 1000],
    [1000, 1800],
    [1800, 2020],
  ];
  const [fromValue, toValue] =
    periods[Math.floor(random.next() * periods.length)];
  const avoidPeople = random.nextBoolean(0.5);
  const candidates = deck.filter((candidate) => {
    if (avoidPeople && candidate.instance_of.includes("human")) {
      return false;
    }
    const value = candidate.value ?? candidate.year ?? 0;
    if (value < fromValue || value > toValue) {
      return false;
    }
    if (tooClose(candidate, played, dimension)) {
      return false;
    }
    return true;
  });

  if (candidates.length > 0) {
    return candidates[Math.floor(random.next() * candidates.length)];
  }
  return deck[Math.floor(random.next() * deck.length)];
}

/**
 * Seeded version of getRandomItem for deterministic daily games
 */
export function getSeededRandomItem(
  deck: Item[],
  played: Item[],
  dimension: Dimension,
  seededRandom: SeededRandom
): Item {
  return getRandomItem(deck, played, dimension, seededRandom);
}

function tooClose(item: Item, played: Item[], dimension: Dimension) {
  const itemValue = item.value ?? item.year ?? 0;
  
  if (dimension.name === "price") {
    // For price, use percentage-based distance (e.g., 5% of value)
    let percentage = played.length < 40 ? 0.05 : 0.01;
    if (played.length < 11) {
      percentage = Math.max(0.01, (110 - 10 * played.length) / 1000);
    }
    const distance = Math.abs(itemValue * percentage);
    return played.some((p) => {
      const playedValue = p.value ?? p.year ?? 0;
      return Math.abs(itemValue - playedValue) < distance;
    });
  } else {
    // For year, use absolute distance
    let distance = played.length < 40 ? 5 : 1;
    if (played.length < 11) {
      distance = 110 - 10 * played.length;
    }
    return played.some((p) => {
      const playedValue = p.value ?? p.year ?? 0;
      return Math.abs(itemValue - playedValue) < distance;
    });
  }
}

export function checkCorrect(
  played: PlayedItem[],
  item: Item,
  index: number,
  dimension: Dimension
): { correct: boolean; delta: number } {
  const sorted = [...played, item].sort((a, b) => {
    const aValue = a.value ?? a.year ?? 0;
    const bValue = b.value ?? b.year ?? 0;
    return dimension.compare(aValue, bValue);
  });
  const correctIndex = sorted.findIndex((i) => {
    return i.id === item.id;
  });

  if (index !== correctIndex) {
    return { correct: false, delta: correctIndex - index };
  }

  return { correct: true, delta: 0 };
}

export function preloadImage(url: string): HTMLImageElement {
  const img = new Image();
  img.src = createWikimediaImage(url);
  return img;
}
