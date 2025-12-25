import { GameState } from "../types/game";
import { Item } from "../types/item";
import { Dimension } from "../types/dimension";
import { getRandomItem, preloadImage } from "./items";

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
