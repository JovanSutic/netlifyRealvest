import { ButtonSizeType, ButtonVariantType } from "../../types/component.types";
import styles from "./styles.module.css";

const Button = ({
  onClick,
  text,
  variant = "primary",
  size = "medium",
}: {
  onClick: () => void;
  text: string;
  variant?: ButtonVariantType;
  size?: ButtonSizeType;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.root} ${styles[variant]} ${styles[size]}`}
    >
      {text}
    </button>
  );
};

export default Button;
