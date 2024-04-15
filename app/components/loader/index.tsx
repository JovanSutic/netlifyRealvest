import styles from "./styles.module.css";

const Loader = ({ open }: { open: boolean }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
