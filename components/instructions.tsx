import React from "react";
import styles from "../styles/instructions.module.scss";
import Score from "./score";
import { Dimension } from "../types/dimension";
import { getDailyStreak, hasDailyBeenCompleted, isLocalhost, resetTodayDaily } from "../lib/daily-game";

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
  onDailySelect?: () => void;
  isDailyMode?: boolean;
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
  const { highscore, dimension, dimensionsConfig, isLoading, onDimensionSelect, onDailySelect, isDailyMode } =
    props;

  const [dailyStreak, setDailyStreak] = React.useState<number>(0);
  const [dailyCompleted, setDailyCompleted] = React.useState<boolean>(false);
  const [isDevMode, setIsDevMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    setDailyStreak(getDailyStreak().current);
    setDailyCompleted(hasDailyBeenCompleted());
    setIsDevMode(isLocalhost());
  }, []);

  const handleDevReset = React.useCallback(() => {
    resetTodayDaily();
    setDailyCompleted(false);
    // Trigger the daily game
    if (onDailySelect) {
      onDailySelect();
    }
  }, [onDailySelect]);

  return (
    <div className={styles.instructions}>
      <div className={styles.wrapper}>
        <h2>Place the cards in the correct order.</h2>
        <p className={styles.subtitle}>Click a category to start playing</p>
        
        {/* Daily Game Tile - Featured */}
        {onDailySelect && (
          <div className={styles.dailySection}>
            <button
              className={`${styles.dailyTile} ${isDailyMode ? styles.selected : ""} ${dailyCompleted ? styles.completed : ""}`}
              onClick={onDailySelect}
              disabled={isLoading && isDailyMode}
            >
              <div className={styles.dailyContent}>
                <span className={styles.dailyIcon}>🎯</span>
                <div className={styles.dailyText}>
                  <span className={styles.dailyTitle}>Daily Challenge</span>
                  <span className={styles.dailySubtitle}>
                    {dailyCompleted ? "Completed! Click to view results" : "Same puzzle for everyone today"}
                  </span>
                </div>
                {dailyStreak > 0 && (
                  <div className={styles.streakBadge}>
                    <span className={styles.streakIcon}>🔥</span>
                    <span className={styles.streakCount}>{dailyStreak}</span>
                  </div>
                )}
              </div>
              {isLoading && isDailyMode && (
                <span className={styles.loadingIndicator}></span>
              )}
            </button>
            {/* Dev mode reset button */}
            {isDevMode && dailyCompleted && (
              <button
                className={styles.devResetButton}
                onClick={handleDevReset}
              >
                🔄 Reset & Play Again (Dev)
              </button>
            )}
          </div>
        )}

        <p className={styles.orDivider}>— or pick a category —</p>
        
        {dimensionsConfig &&
          dimensionsConfig.dimensions.length > 1 &&
          dimension && (
            <div className={styles.dimensionGrid}>
              {dimensionsConfig.dimensions.map((dim, index) => (
                <button
                  key={dim.name}
                  className={`${styles.dimensionTile} ${
                    dimension.name === dim.name && !isDailyMode ? styles.selected : ""
                  } ${isLoading && dimension.name === dim.name && !isDailyMode ? styles.loading : ""}`}
                  onClick={() => onDimensionSelect(dim.name)}
                  style={{ animationDelay: `${index * 30}ms` }}
                  disabled={isLoading}
                >
                  <span className={styles.tileIcon}>
                    {dimensionIcons[dim.name] || "📊"}
                  </span>
                  <span className={styles.tileName}>{dim.displayName}</span>
                  {isLoading && dimension.name === dim.name && !isDailyMode && (
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
