import styles from "./styles.module.css";

const Loader = ({ open }: { open: boolean }) => {
  if (!open) return null;
  return (
    <div
      className={`fixed bg-white inset-0 flex items-center justify-center z-50 ${
        open ? "bg-opacity-50" : "bg-opacity-0"
      } transition-opacity`}
    >
      <div className="flex items-center justify-center space-x-4">
        <div className={styles.loader}></div>
      </div>
    </div>
  );
};

export default Loader;
