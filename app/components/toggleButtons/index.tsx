import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ButtonSizeType, DropdownOptions } from "../../types/component.types";

const ToggleButtons = ({
  options,
  onChange,
  value,
  size = 'medium'
}: {
  options: DropdownOptions[];
  onChange: (value: string) => void;
  value: string;
  size?: ButtonSizeType
}) => {
  const sizeMap: Record<ButtonSizeType, {padding:string; fontSize: string}> = {
    small: {
      padding: "2px 6px",
      fontSize: "12px"
    },
    medium: {
      padding: "4px 8px",
      fontSize: "14px"
    },
    big: {
      padding: "6px 12px",
      fontSize: "14px"
    },
  };
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(event, value) => {
        onChange(value);
      }}
      aria-label="Platform"
      sx={{
        padding: "4px 0px",
      }}
    >
      {options.map((option) => (
        <ToggleButton
          disableRipple={true}
          key={option.value}
          value={option.value}
          sx={{
            padding: sizeMap[size].padding,
            fontSize: sizeMap[size].fontSize,
            background: "#eeeeee",
            color: "#13182d",
            "&:hover": {
              background: "#cfcfcf",
              color: "#13182d",
            },
            "&.Mui-selected": {
              color: " #13182d",
              background: "#f0b90b",
              "&:hover": {
                color: " #13182d",
                background: "#fcd535",
              },
            },
          }}
        >
          {option.text}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleButtons;
