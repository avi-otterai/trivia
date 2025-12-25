import React, { useState } from "react";
import axios from "axios";
import { GameState } from "../types/game";
import { Item } from "../types/item";
import { Dimension } from "../types/dimension";
import createState from "../lib/create-state";
import { getDimension } from "../lib/dimensions";
import Board from "./board";
import Loading from "./loading";
import Instructions from "./instructions";
import badCards from "../lib/bad-cards";

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
  const [items, setItems] = useState<Item[] | null>(null);
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [dimensionsConfig, setDimensionsConfig] =
    useState<DimensionsConfig | null>(null);

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
        setState(await createState(items, dimension));
        setLoaded(true);
      }
    })();
  }, [items, dimension]);

  const resetGame = React.useCallback(() => {
    (async () => {
      if (items !== null && dimension !== null) {
        setState(await createState(items, dimension));
      }
      setStarted(false);
    })();
  }, [items, dimension]);

  const [highscore, setHighscore] = React.useState<number>(
    Number(localStorage.getItem("highscore") ?? "0")
  );

  const updateHighscore = React.useCallback((score: number) => {
    localStorage.setItem("highscore", String(score));
    setHighscore(score);
  }, []);

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
        onDimensionChange={(dimName: string) => {
          // Don't reload if same dimension is selected
          if (dimension && dimension.name === dimName) {
            return;
          }
          setDimension(getDimension(dimName));
          setItems(null);
          setLoaded(false);
        }}
        start={() => setStarted(true)}
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
    />
  );
}
