import React from "react";
import styles from "../styles/instructions.module.scss";
import Button from "./button";
import Score from "./score";
import { Dimension } from "../types/dimension";

interface DimensionMetadata {
  name: string;
  displayName: string;
  dataFile: string;
}

interface DimensionsConfig {
  dimensions: DimensionMetadata[];
  default: string;
}

interface Props {
  highscore: number;
  start: () => void;
  dimension: Dimension | null;
  dimensionsConfig: DimensionsConfig | null;
  isLoading?: boolean;
  onDimensionChange: (dimName: string) => void;
}

// Icon mapping for each dimension
const dimensionIcons: { [key: string]: string } = {
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

export default function Instructions(props: Props) {
  const { highscore, start, dimension, dimensionsConfig, isLoading, onDimensionChange } =
    props;

  return (
    <div className={styles.instructions}>
      <div className={styles.wrapper}>
        <h2>Place the cards in the correct order.</h2>
        <p className={styles.subtitle}>Select a category to begin</p>
        
        {dimensionsConfig &&
          dimensionsConfig.dimensions.length > 1 &&
          dimension && (
            <div className={styles.dimensionGrid}>
              {dimensionsConfig.dimensions.map((dim, index) => (
                <button
                  key={dim.name}
                  className={`${styles.dimensionTile} ${
                    dimension.name === dim.name ? styles.selected : ""
                  } ${isLoading && dimension.name === dim.name ? styles.loading : ""}`}
                  onClick={() => onDimensionChange(dim.name)}
                  style={{ animationDelay: `${index * 30}ms` }}
                  disabled={isLoading}
                >
                  <span className={styles.tileIcon}>
                    {dimensionIcons[dim.name] || "📊"}
                  </span>
                  <span className={styles.tileName}>{dim.displayName}</span>
                  {isLoading && dimension.name === dim.name && (
                    <span className={styles.loadingIndicator}></span>
                  )}
                </button>
              ))}
            </div>
          )}
        
        {highscore !== 0 && (
          <div className={styles.highscoreWrapper}>
            <Score score={highscore} title="Best streak" />
          </div>
        )}
        
        <Button onClick={start} text="Start game" disabled={isLoading} />
      </div>
    </div>
  );
}
