import React from "react";
import styles from "../styles/instructions.module.scss";
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
  dimension: Dimension | null;
  dimensionsConfig: DimensionsConfig | null;
  isLoading?: boolean;
  onDimensionSelect: (dimName: string) => void;
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
  const { highscore, dimension, dimensionsConfig, isLoading, onDimensionSelect } =
    props;

  return (
    <div className={styles.instructions}>
      <div className={styles.wrapper}>
        <h2>Place the cards in the correct order.</h2>
        <p className={styles.subtitle}>Click a category to start playing</p>
        
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
                  onClick={() => onDimensionSelect(dim.name)}
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
      </div>
    </div>
  );
}
