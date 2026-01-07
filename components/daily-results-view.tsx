import React from "react";
import { animated, useSpring } from "react-spring";
import styles from "../styles/game-over.module.scss";
import Button from "./button";
import Score from "./score";
import {
  getDailyStreak,
  generateShareText,
  generatePlayEmojis,
  SavedDailyResult,
} from "../lib/daily-game";

interface Props {
  savedResult: SavedDailyResult;
  highscore: number;
  onBack: () => void;
}

export default function DailyResultsView(props: Props) {
  const { savedResult, highscore, onBack } = props;
  const { score, placements, dimensionName } = savedResult;

  const animProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const [copied, setCopied] = React.useState(false);
  const dailyStreak = React.useMemo(() => getDailyStreak(), []);

  const playEmojis = React.useMemo(() => {
    return generatePlayEmojis(placements);
  }, [placements]);

  const share = React.useCallback(async () => {
    const text = generateShareText(dimensionName, placements);
    await navigator?.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [dimensionName, placements]);

  return (
    <div className={styles.resultsViewWrapper}>
      <animated.div style={animProps} className={styles.gameOver}>
        <div className={styles.dailyResults}>
          <div className={styles.dailyHeader}>
            <span className={styles.dailyIcon}>🎯</span>
            <span className={styles.dailyLabel}>Daily Challenge</span>
            <button className={styles.shareIcon} onClick={share} title="Share">
              {copied ? "✓" : "📋"}
            </button>
          </div>
          <div className={styles.streakDisplay}>
            <span className={styles.streakIcon}>🔥</span>
            <span className={styles.streakNumber}>{dailyStreak.current}</span>
            <span className={styles.streakLabel}>day streak</span>
          </div>
          {placements.length > 0 && (
            <div className={styles.historyEmojis}>
              {playEmojis}
            </div>
          )}
        </div>
        
        <div className={styles.scoresWrapper}>
          <div className={styles.score}>
            <Score score={score} title="Streak" />
          </div>
          <div className={styles.score}>
            <Score score={highscore} title="Best streak" />
          </div>
        </div>
        <div className={styles.buttons}>
          <Button onClick={onBack} text="Back to Menu" />
          <Button onClick={share} text={copied ? "Copied!" : "Share"} minimal />
        </div>
      </animated.div>
    </div>
  );
}

