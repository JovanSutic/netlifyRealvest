import styles from "./styles.module.css";

export const InfoIcon = () => {
  return (
    <div className={styles["icon-wrap"]}>
      <div className={styles.info}></div>
    </div>
  );
};

export const InfoTooltip = ({ text, direction }: { text: string; direction: 'left' | 'right' }) => {
  return (
    <div className={styles.tooltip}>
      <InfoIcon />
      <span className={`${styles.tooltiptext} ${styles[direction]}`}>{text}</span>
    </div>
  );
};
