import * as React from "react";
import { Button, Menu, MenuItem, Fade, Box } from "@mui/material";
import { DropdownOptions } from "../../types/component.types";

function Dropdown({
  name,
  options,
  onChange,
}: {
  name: string;
  options: DropdownOptions[];
  onChange: (value: string) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{
      display: 'flex',
    }}>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          color: '#f0b90b'
        }}
      >
        {name}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              onChange(option.value);
              handleClose();
            }}
          >
            {option.text}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default Dropdown;
