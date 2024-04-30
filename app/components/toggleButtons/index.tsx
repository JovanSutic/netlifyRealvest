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
            borderColor: "rgb(165 180 252)",
            background: "rgb(224 231 255)",
            color: "#13182d",
            "&:hover": {
              background: "rgb(165 180 252)",
              color: "#13182d",
            },
            "&.Mui-selected": {
              color: " #fff",
              background: "rgb(49 46 129)",
              "&:hover": {
                color: " #fff",
                background: "rgb(79 70 229)",
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
