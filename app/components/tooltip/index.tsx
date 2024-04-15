import styles from './styles.module.css'

const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: JSX.Element;
}) => {
  return (
    <div className={styles.tooltip}>
      {children}
      <span className={styles.tooltiptext}>{text}</span>
    </div>
  );
};

export default Tooltip;
