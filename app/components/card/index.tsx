import { Box, Typography } from "@mui/material";
import Chip from "../chip";

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

  const getChipColor = (): 'blue' | 'green' | 'red' => {
    if (changeValue > 0) return "green";
    if (changeValue < 0) return "red";

    return "blue";
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
              isClose={false}
              color={getChipColor()}
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
