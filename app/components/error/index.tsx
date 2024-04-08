import { Box, Typography, Button } from "@mui/material";
import { NavLink } from "@remix-run/react";

export const ErrorPage = ({
    title = "Error",
    subtitle = "The was an issue with your request, please click on the button bellow.",
    buttonText = "Go back to safety",
    link,
}: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    link: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: "20px",
        }}
      >
        <Typography variant="h3">{title}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2">{subtitle}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: "20px",
        }}
      >
        <Button
          sx={{
            background: "#f0b90b",
            "& a": {
              color: "#14182d",
              fontStyle: "none",
              textDecoration: "none",
            },
            "&:hover": {
              background: "#fcd535",
            },
          }}
        >
          <NavLink
            to={link}
            reloadDocument
          >
            {buttonText}
          </NavLink>
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
