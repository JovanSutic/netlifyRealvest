import { createTheme, colors } from "@mui/material";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0b0e11",
    },
    secondary: {
      main: "#f0b90b",
    },
    error: {
      main: colors.red.A400,
    },
  },
});

export default theme;