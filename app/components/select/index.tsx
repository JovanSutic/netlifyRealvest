import {
  MenuItem,
  FormControl,
  Select as MuiSelect,
  SelectChangeEvent,
} from "@mui/material";
import { DropdownOptions } from "../../types/component.types";

export default function Select({
  value,
  options,
  setValue,
  minWidth = 120
}: {
  value: string;
  options: DropdownOptions[];
  setValue: (value: string) => void;
  minWidth?: number;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <FormControl
      sx={{
        margin: "2px",
        verticalAlign: "super",
        minWidth: minWidth,
      }}
      size="small"
    >
      <MuiSelect
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        variant="outlined"
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.text}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
