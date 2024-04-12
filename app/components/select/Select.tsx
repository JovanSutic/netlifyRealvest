import { DropdownOptions } from "~/types/component.types";
import styles from "./styles.module.css";

const Select = ({
  value,
  options,
  setValue,
  isFullWidth = false,
}: {
  value: string;
  options: DropdownOptions[];
  setValue: (value: string) => void;
  isFullWidth?: boolean;
}) => {
  return (
    <div className={styles.select}>
      <select className={`${styles.text} ${isFullWidth && styles.full}`} value={value} onChange={(event) => setValue(event.target.value)}>
        {options.map((item) => (
          <option value={item.value} key={item.value}>
            {item.text}
          </option>
        ))}
      </select>
      {/* <label className={styles.label}>Select</label> */}
    </div>
  );
};

export default Select;
