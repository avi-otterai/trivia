import React from "react";
import GitHubButton from "react-github-btn";
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
  onDimensionChange: (dimName: string) => void;
}

export default function Instructions(props: Props) {
  const { highscore, start, dimension, dimensionsConfig, onDimensionChange } =
    props;

  return (
    <div className={styles.instructions}>
      <div className={styles.wrapper}>
        <h2>Place the cards on the timeline in the correct order.</h2>
        {dimensionsConfig &&
          dimensionsConfig.dimensions.length > 1 &&
          dimension && (
            <div className={styles.dimensionSelector}>
              <label htmlFor="dimension-select">Choose dimension:</label>
              <select
                id="dimension-select"
                value={dimension.name || dimensionsConfig.default}
                onChange={(e) => onDimensionChange(e.target.value)}
              >
                {dimensionsConfig.dimensions.map((dim) => (
                  <option key={dim.name} value={dim.name}>
                    {dim.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}
        {highscore !== 0 && (
          <div className={styles.highscoreWrapper}>
            <Score score={highscore} title="Best streak" />
          </div>
        )}
        <Button onClick={start} text="Start game" />
        <div className={styles.about}>
          <div>
            All data sourced from{" "}
            <a
              href="https://www.wikidata.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikidata
            </a>{" "}
            and{" "}
            <a
              href="https://www.wikipedia.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia
            </a>
            .
          </div>
          <div>
            Have feedback? Please report it on{" "}
            <a
              href="https://github.com/tom-james-watson/wikitrivia/issues/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </div>
          <GitHubButton
            href="https://github.com/tom-james-watson/wikitrivia"
            data-size="large"
            data-show-count="true"
            aria-label="Star tom-james-watson/wikitrivia on GitHub"
          >
            Star
          </GitHubButton>
        </div>
      </div>
    </div>
  );
}
