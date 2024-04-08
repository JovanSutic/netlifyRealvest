import { Box, Chip, Typography } from "@mui/material";

const Card = ({
  label,
  value,
  changeValue,
  isMobile,
}: {
  label: string;
  value: string;
  changeValue: number;
  isMobile: boolean;
}) => {
  const getColor = () => {
    if (changeValue > 0) return "#b1ffd0";
    if (changeValue < 0) return "#fdd0d0";

    return "#c8d4ff";
  };
  const getFontColor = () => {
    if (changeValue > 0) return "#107237";
    if (changeValue < 0) return "#f90000";

    return "#1a39ac";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: isMobile ? "100%" : "30%",
        height: "90px",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: " 0px 6px 10px -8px rgba(48,48,48,0.85)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "4px",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "12px",
                fontWeight: "300",
              }}
            >
              {label}
            </Typography>
            <Chip
              label={`${changeValue}%`}
              size="small"
              sx={{
                width: "50px",
                height: "auto",
                fontWeight: 500,
                fontSize: "12px",
                background: getColor(),
                color: getFontColor()
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
