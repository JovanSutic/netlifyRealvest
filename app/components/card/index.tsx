import { Box, Divider, Typography } from "@mui/material";
import Chip from "../chip";
import Loader from "../loader";

const Card = ({
  label,
  value,
  changeValue,
  isMobile,
  start,
  end,
  startDate,
  endDate,
  isLoading = false,
}: {
  label: string;
  value: string;
  changeValue: number;
  isMobile: boolean;
  start: string;
  end: string;
  startDate: string;
  endDate: string;
  isLoading?: boolean;
}) => {
  const getChipColor = (): "blue" | "green" | "red" => {
    if (changeValue > 0) return "green";
    if (changeValue < 0) return "red";

    return "blue";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        gap: "4px",
        width: isMobile ? "100%" : "31.5%",
        borderRadius: "8px",
        background: "#fff",
        padding: "12px",
        boxShadow: " 0px 6px 10px -8px rgba(48,48,48,0.85)",
      }}
    >
      <Loader open={isLoading} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: "4px",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "15px",
              fontStyle: "italic",
              marginBottom: "4px",
            }}
          >
            {label}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",

            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: "28px",
              fontWeight: "600",
              textAlign: "end",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 8px",
        }}
      >
        <Divider />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          paddingTop: "6px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "center",
                gap: "2px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: "9px",
                  fontWeight: "300",
                }}
              >
                {startDate}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                {start}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "center",
                gap: "2px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: "9px",
                  fontWeight: "300",
                }}
              >
                {endDate}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                {end}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "center",
              }}
            >
              <Chip
                label={`${changeValue}%`}
                isClose={false}
                color={getChipColor()}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
