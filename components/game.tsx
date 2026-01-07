import React, { useState } from "react";
import axios from "axios";
import { GameState } from "../types/game";
import { Item } from "../types/item";
import { Dimension } from "../types/dimension";
import createState, { createDailyState } from "../lib/create-state";
import { getDimension } from "../lib/dimensions";
import Board from "./board";
import Loading from "./loading";
import Instructions from "./instructions";
import DailyResultsView from "./daily-results-view";
import badCards from "../lib/bad-cards";
import { getDailyRandom, getDailyDimensionName, hasDailyBeenCompleted, getSavedDailyResult, SavedDailyResult } from "../lib/daily-game";

interface DimensionMetadata {
  name: string;
  displayName: string;
  dataFile: string;
}

interface DimensionsConfig {
  dimensions: DimensionMetadata[];
  default: string;
}

export default function Game() {
  const [state, setState] = useState<GameState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [dimensionsConfig, setDimensionsConfig] =
    useState<DimensionsConfig | null>(null);
  const [isDailyMode, setIsDailyMode] = useState(false);
  const [savedDailyResult, setSavedDailyResult] = useState<SavedDailyResult | null>(null);

  React.useEffect(() => {
    const fetchDimensionsConfig = async () => {
      try {
        const res = await axios.get<DimensionsConfig>("/dimensions.json");
        setDimensionsConfig(res.data);
        // Set default dimension
        const defaultDimension = getDimension(res.data.default);
        setDimension(defaultDimension);
      } catch (error) {
        console.error("Failed to load dimensions config:", error);
        // Fallback to year dimension
        const defaultDimension = getDimension("year");
        setDimension(defaultDimension);
        setDimensionsConfig({
          dimensions: [
            { name: "year", displayName: "Year", dataFile: "items.json" },
          ],
          default: "year",
        });
      }
    };

    fetchDimensionsConfig();
  }, []);

  React.useEffect(() => {
    const fetchGameData = async () => {
      if (!dimension || !dimensionsConfig) return;

      try {
        const dimensionMeta = dimensionsConfig.dimensions.find(
          (d) => d.name === dimension.name
        );
        if (!dimensionMeta) return;

        const res = await axios.get<string>(`/${dimensionMeta.dataFile}`);
        let items: Item[] = res.data
          .trim()
          .split("\n")
          .map((line) => {
            const item = JSON.parse(line);
            // Normalize: ensure value field exists (use year if value not present)
            if (!item.value && item.year !== undefined) {
              item.value = item.year;
            }
            return item;
          })
          // Filter out questions which give away their answers
          .filter((item) => {
            const value = item.value ?? item.year;
            return !item.label.includes(String(value));
          })
          .filter((item) => {
            const value = item.value ?? item.year;
            return !item.description.includes(String(value));
          })
          .filter((item) => !/(?:th|st|nd)[ -]century/i.test(item.description))
          // Filter cards which have bad data as submitted in https://github.com/tom-james-watson/wikitrivia/discussions/2
          .filter((item) => !(item.id in badCards));

        // Filter out items with duplicate displayed values
        const displayedValues = new Set<string>();
        items = items.filter((item) => {
          const value = item.value ?? item.year ?? 0;
          const displayed = dimension.displayFormat(value);
          if (displayedValues.has(displayed)) {
            return false; // Duplicate displayed value, filter it out
          }
          displayedValues.add(displayed);
          return true;
        });

        setItems(items);
      } catch (error) {
        console.error("Failed to load game data:", error);
      }
    };

    fetchGameData();
  }, [dimension, dimensionsConfig]);

  React.useEffect(() => {
    (async () => {
      if (items !== null && dimension !== null) {
        if (isDailyMode) {
          // Create a fresh seeded random for daily state creation
          // We use a copy of the seed to ensure consistent gameplay
          const dailyRandom = getDailyRandom();
          // Advance the random state past the dimension selection
          dailyRandom.next();
          setState(await createDailyState(items, dimension, dailyRandom));
        } else {
          setState(await createState(items, dimension));
        }
        setLoaded(true);
      }
    })();
  }, [items, dimension, isDailyMode]);

  // Auto-start the game when loading completes if autoStart is set
  React.useEffect(() => {
    if (autoStart && loaded && state !== null) {
      setStarted(true);
      setAutoStart(false);
    }
  }, [autoStart, loaded, state]);

  const resetGame = React.useCallback(() => {
    (async () => {
      if (isDailyMode) {
        // For daily mode, just go back to instructions (can't replay)
        setStarted(false);
        setIsDailyMode(false);
        return;
      }
      if (items !== null && dimension !== null) {
        setState(await createState(items, dimension));
      }
      setStarted(false);
    })();
  }, [items, dimension, isDailyMode]);

  const [highscore, setHighscore] = React.useState<number>(
    Number(localStorage.getItem("highscore") ?? "0")
  );

  const updateHighscore = React.useCallback((score: number) => {
    localStorage.setItem("highscore", String(score));
    setHighscore(score);
  }, []);

  const handleDailySelect = React.useCallback(() => {
    if (!dimensionsConfig) return;
    
    // Check if daily already completed - show saved result instead of starting new game
    if (hasDailyBeenCompleted()) {
      const saved = getSavedDailyResult();
      if (saved) {
        setSavedDailyResult(saved);
        setIsDailyMode(true);
        setStarted(true);
        return;
      }
    }
    
    // Get the daily dimension using seeded random
    const dailyRandom = getDailyRandom();
    const dimensionNames = dimensionsConfig.dimensions.map((d) => d.name);
    const dailyDimName = getDailyDimensionName(dimensionNames, dailyRandom);
    
    setIsDailyMode(true);
    setSavedDailyResult(null);
    
    // If the daily dimension is already loaded, just start
    if (dimension && dimension.name === dailyDimName && loaded && state !== null) {
      setStarted(true);
      return;
    }
    
    // Otherwise, load the dimension
    setDimension(getDimension(dailyDimName));
    setItems(null);
    setLoaded(false);
    setAutoStart(true);
  }, [dimensionsConfig, dimension, loaded, state]);

  if (!started) {
    // Show instructions even while loading a new dimension
    // Only show loading if we don't have dimensionsConfig yet
    if (!dimensionsConfig || !dimension) {
      return <Loading />;
    }
    
    return (
      <Instructions
        highscore={highscore}
        dimension={dimension}
        dimensionsConfig={dimensionsConfig}
        isLoading={!loaded || state === null}
        isDailyMode={isDailyMode}
        onDailySelect={handleDailySelect}
        onDimensionSelect={(dimName: string) => {
          // Clear daily mode when selecting a regular dimension
          setIsDailyMode(false);
          
          // If same dimension is already loaded, just start the game
          if (dimension && dimension.name === dimName && loaded && state !== null) {
            setStarted(true);
            return;
          }
          // Otherwise, load the dimension and start when ready
          if (dimension && dimension.name !== dimName) {
            setDimension(getDimension(dimName));
            setItems(null);
            setLoaded(false);
          }
          // Set a flag to auto-start when loading completes
          setAutoStart(true);
        }}
      />
    );
  }

  // Show saved daily result if viewing completed daily
  if (savedDailyResult && isDailyMode) {
    return (
      <DailyResultsView
        savedResult={savedDailyResult}
        highscore={highscore}
        onBack={() => {
          setStarted(false);
          setIsDailyMode(false);
          setSavedDailyResult(null);
        }}
      />
    );
  }

  if (!loaded || state === null) {
    return <Loading />;
  }

  if (!dimension) {
    return <Loading />;
  }

  return (
    <Board
      highscore={highscore}
      state={state}
      setState={setState}
      resetGame={resetGame}
      updateHighscore={updateHighscore}
      dimension={dimension}
      isDailyMode={isDailyMode}
    />
  );
}
