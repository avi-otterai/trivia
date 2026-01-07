import React from "react";
import { animated, useSpring } from "react-spring";
import styles from "../styles/game-over.module.scss";
import Button from "./button";
import Score from "./score";
import {
  recordDailyResult,
  getDailyStreak,
  generateShareText,
  generatePlayEmojis,
  saveDailyResult,
  DailyStreak,
} from "../lib/daily-game";

interface Props {
  highscore: number;
  resetGame: () => void;
  score: number;
  isDailyMode?: boolean;
  dimensionName?: string;
  placements?: boolean[];
}

function getMedal(score: number): string {
  if (score >= 20) {
    return "🥇 ";
  } else if (score >= 10) {
    return "🥈 ";
  } else if (score >= 1) {
    return "🥉 ";
  }
  return "";
}

export default function GameOver(props: Props) {
  const { highscore, resetGame, score, isDailyMode, dimensionName, placements = [] } = props;

  const animProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const [copied, setCopied] = React.useState(false);
  const [dailyStreak, setDailyStreak] = React.useState<DailyStreak | null>(null);
  const [hasRecorded, setHasRecorded] = React.useState(false);

  // Record daily result when game ends
  React.useEffect(() => {
    if (isDailyMode && !hasRecorded && dimensionName) {
      // In daily mode, "winning" means getting a score > 0
      const won = score > 0;
      const streak = recordDailyResult(won, score, placements);
      setDailyStreak(streak);
      setHasRecorded(true);
      
      // Save the result so it can be viewed again later
      saveDailyResult(score, placements, dimensionName);
    }
  }, [isDailyMode, score, hasRecorded, placements, dimensionName]);

  // For non-daily mode, just get the existing streak
  React.useEffect(() => {
    if (!isDailyMode) {
      setDailyStreak(getDailyStreak());
    }
  }, [isDailyMode]);

  // Generate emoji string for this game
  const playEmojis = React.useMemo(() => {
    return generatePlayEmojis(placements);
  }, [placements]);

  const share = React.useCallback(async () => {
    let text: string;
    
    if (isDailyMode && dimensionName) {
      text = generateShareText(dimensionName, placements);
    } else {
      text = `🎮 avi-trivia.netlify.app\n\n${getMedal(
        score
      )}Streak: ${score}\n${getMedal(highscore)}Best Streak: ${highscore}`;
    }
    
    await navigator?.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [highscore, score, isDailyMode, dimensionName, placements]);

  return (
    <animated.div style={animProps} className={styles.gameOver}>
      {isDailyMode && dailyStreak && (
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
      )}
      
      <div className={styles.scoresWrapper}>
        <div className={styles.score}>
          <Score score={score} title="Streak" />
        </div>
        <div className={styles.score}>
          <Score score={highscore} title="Best streak" />
        </div>
      </div>
      <div className={styles.buttons}>
        <Button 
          onClick={resetGame} 
          text={isDailyMode ? "Back to Menu" : "Play again"} 
        />
        <Button onClick={share} text={copied ? "Copied!" : "Share"} minimal />
      </div>
    </animated.div>
  );
}
