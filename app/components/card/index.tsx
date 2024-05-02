import { Box, Divider, Typography } from "@mui/material";
import Chip from "../chip";
import { InfoTooltip } from "../icons";

const Card = ({
  label,
  tooltip,
  value,
  changeValue,
  isMobile,
  start,
  end,
  startDate,
  endDate,
}: {
  label: string;
  value: string;
  tooltip: string;
  changeValue: number;
  isMobile: boolean;
  start: string;
  end: string;
  startDate: string;
  endDate: string;
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
        gap: "4px",
        width: isMobile ? "100%" : "31.5%",
        height: "120px",
        borderRadius: "8px",
        background: "#fff",
        padding: "8px 4px",
        boxShadow: " 0px 6px 10px -8px rgba(48,48,48,0.85)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            gap: "4px"
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {label}
          </Typography>
          <InfoTooltip text={tooltip} direction="top" />
        </Box>
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
            fontSize: "20px",
            fontWeight: "400",
            textAlign: "center"
          }}
        >
          {value}
        </Typography>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        padding: "0px 8px"
      }}>
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
              textAlign: "center"
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: "10px",
                fontWeight: "300",
              }}
            >
              {startDate}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: "16px",
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
              textAlign: "center"
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: "10px",
                fontWeight: "300",
              }}
            >
              {endDate}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: "16px",
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
  );
};

export default Card;
