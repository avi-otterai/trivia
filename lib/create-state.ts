import { GameState } from "../types/game";
import { Item } from "../types/item";
import { Dimension } from "../types/dimension";
import { getRandomItem, getSeededRandomItem, preloadImage } from "./items";
import { SeededRandom } from "./seeded-random";

export default async function createState(
  deck: Item[],
  dimension: Dimension
): Promise<GameState> {
  // Create a working copy of the deck that we'll remove items from
  const workingDeck = [...deck];

  // Select initial played card and remove from deck
  const initialPlayed = getRandomItem(workingDeck, [], dimension);
  const played = [{ ...initialPlayed, played: { correct: true } }];
  const initialPlayedIndex = workingDeck.findIndex(
    (d) => d.id === initialPlayed.id
  );
  if (initialPlayedIndex !== -1) {
    workingDeck.splice(initialPlayedIndex, 1);
  }

  // Select next card and remove from deck
  const next = getRandomItem(workingDeck, played, dimension);
  const nextIndex = workingDeck.findIndex((d) => d.id === next.id);
  if (nextIndex !== -1) {
    workingDeck.splice(nextIndex, 1);
  }

  // Select nextButOne card and remove from deck
  const nextButOne = getRandomItem(workingDeck, [...played, next], dimension);
  const nextButOneIndex = workingDeck.findIndex((d) => d.id === nextButOne.id);
  if (nextButOneIndex !== -1) {
    workingDeck.splice(nextButOneIndex, 1);
  }

  const imageCache = [preloadImage(next.image), preloadImage(nextButOne.image)];

  return {
    badlyPlaced: null,
    deck: workingDeck, // Return the deck with items removed
    imageCache,
    lives: 3,
    next,
    nextButOne,
    played,
  };
}

/**
 * Creates a deterministic game state using seeded random for daily games.
 * This ensures everyone playing on the same day gets the same sequence of cards.
 * 
 * Key: Pre-generates ALL cards upfront so no random calls happen during gameplay.
 */
export async function createDailyState(
  deck: Item[],
  dimension: Dimension,
  seededRandom: SeededRandom
): Promise<GameState> {
  // Sort deck by ID first to ensure consistent ordering across all clients
  const sortedDeck = [...deck].sort((a, b) => a.id.localeCompare(b.id));
  
  // Shuffle the sorted deck deterministically
  const shuffledDeck = seededRandom.shuffle(sortedDeck);
  
  // Pre-generate ALL cards for the entire game (up to 50 cards)
  // This ensures determinism - no random calls during gameplay
  const cardQueue: Item[] = [];
  const usedIds = new Set<string>();
  const playedForFiltering: Item[] = [];
  
  // Generate cards until we have enough or run out
  const MAX_CARDS = 50;
  for (const card of shuffledDeck) {
    if (cardQueue.length >= MAX_CARDS) break;
    if (usedIds.has(card.id)) continue;
    
    // Check if card is too close to already selected cards
    const value = card.value ?? card.year ?? 0;
    let tooClose = false;
    
    for (const played of playedForFiltering) {
      const playedValue = played.value ?? played.year ?? 0;
      const distance = dimension.name === "price" 
        ? Math.abs(value * 0.05)  // 5% for price
        : 50;  // Absolute distance for others
      
      if (Math.abs(value - playedValue) < distance) {
        tooClose = true;
        break;
      }
    }
    
    if (!tooClose) {
      cardQueue.push(card);
      usedIds.add(card.id);
      playedForFiltering.push(card);
    }
  }
  
  // If we didn't get enough cards, add remaining cards without distance check
  if (cardQueue.length < MAX_CARDS) {
    for (const card of shuffledDeck) {
      if (cardQueue.length >= MAX_CARDS) break;
      if (!usedIds.has(card.id)) {
        cardQueue.push(card);
        usedIds.add(card.id);
      }
    }
  }
  
  // Take first 3 cards for initial state
  const [initialPlayed, next, nextButOne, ...remainingQueue] = cardQueue;
  
  const played = [{ ...initialPlayed, played: { correct: true } }];
  const imageCache = [preloadImage(next.image), preloadImage(nextButOne.image)];

  return {
    badlyPlaced: null,
    deck: shuffledDeck.filter(d => !usedIds.has(d.id) || remainingQueue.some(q => q.id === d.id)),
    imageCache,
    lives: 3,
    next,
    nextButOne,
    played,
    cardQueue: remainingQueue,  // Pre-generated cards for the rest of the game
  };
}
