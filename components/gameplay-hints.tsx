import React from "react";
import styles from "../styles/gameplay-hints.module.scss";

interface GameplayHintsProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function GameplayHints({ visible, onDismiss }: GameplayHintsProps) {
  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Left hint - pointing to the card */}
      <div className={styles.hintLeft}>
        <div className={styles.hintContent}>
          <span className={styles.hintText}>Drag this card</span>
          <span className={styles.arrow}>→</span>
        </div>
      </div>

      {/* Right hint - pointing up to timeline */}
      <div className={styles.hintRight}>
        <div className={styles.hintContent}>
          <span className={styles.arrow}>↑</span>
          <span className={styles.hintText}>Drop where it fits on the timeline</span>
        </div>
        <button 
          className={styles.dismissButton} 
          onClick={onDismiss}
          title="Hide hints"
        >
          Got it
        </button>
      </div>
    </>
  );
}

