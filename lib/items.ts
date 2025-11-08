import { Item, PlayedItem } from "../types/item";
import { Dimension } from "../types/dimension";
import { createWikimediaImage } from "./image";

export function getRandomItem(
  deck: Item[],
  played: Item[],
  dimension: Dimension
): Item {
  const periods = dimension.periods || [
    [-100000, 1000],
    [1000, 1800],
    [1800, 2020],
  ];
  const [fromValue, toValue] =
    periods[Math.floor(Math.random() * periods.length)];
  const avoidPeople = Math.random() > 0.5;
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
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  return deck[Math.floor(Math.random() * deck.length)];
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
