import { Box, Typography } from "@mui/material";

const EmptyChart = ({
  height,
  title,
  subtitle,
}: {
  height: number;
  title: string;
  subtitle: string;
}) => {
  return (
    <Box
      sx={{
        height: `${height}px`,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        component="h6"
        variant="subtitle1"
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          marginBottom: "16px",
          fontWeight: "500",
        }}
      >
        {title}
      </Typography>
      <Typography
        component="h6"
        variant="subtitle2"
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          fontWeight: "400",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default EmptyChart;
