import { DropdownOptions } from "../../types/component.types";
import styles from "./styles.module.css";

const Select = ({
  value,
  name,
  options,
  setValue,
  isFullWidth = false,
}: {
  value: string;
  name: string;
  options: DropdownOptions[];
  setValue: (value: string) => void;
  isFullWidth?: boolean;
}) => {
  return (
    <div className={`${styles.select} ${isFullWidth && styles.full}`}>
      <select name={name} className={`${styles.text} ${isFullWidth && styles.full}`} value={value} onChange={(event) => setValue(event.target.value)}>
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
