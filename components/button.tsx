import React from "react";
import classNames from "classnames";
import styles from "../styles/button.module.scss";

interface Props {
  minimal?: boolean;
  onClick: () => void;
  text: string;
  disabled?: boolean;
}

export default function Button(props: Props) {
  const { minimal = false, onClick, text, disabled = false } = props;

  return (
    <button
      onClick={onClick}
      className={classNames(styles.button, { [styles.minimal]: minimal, [styles.disabled]: disabled })}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
