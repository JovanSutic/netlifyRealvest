import { TooltipDirection } from "../../types/component.types";
import Tooltip from "../tooltip/Tooltip";
import styles from "./styles.module.css";

export const InfoIcon = () => {
  return (
    <div className={styles["icon-wrap"]}>
      <div className={styles.info}></div>
    </div>
  );
};

export const InfoTooltip = ({
  text,
  direction,
}: {
  text: string;
  direction: TooltipDirection;
}) => {
  return (
    <div className="relative flex self-start">
      <Tooltip text={text} direction={direction}>
        <InfoIcon />
      </Tooltip>
    </div>
  );
};
