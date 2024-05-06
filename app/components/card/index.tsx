import { Divider, Typography } from "@mui/material";
import Chip from "../chip";
import Loader from "../loader";

const Card = ({
  label,
  value,
  changeValue,
  start,
  end,
  startDate,
  endDate,
  isLoading = false,
}: {
  label: string;
  value: string;
  changeValue: number;
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
    <div className="col-span-12 lg:col-span-4">
      <div className="flex flex-col relative gap-1 w-full rounded-lg p-3 shadow-lg bg-white">
        <Loader open={isLoading} />
        <div className="flex flex-row w-full items-center gap-2">
          <div className="flex flex-row w-full gap-1">
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
          </div>
          <div className="flex flex-col w-full">
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
          </div>
        </div>

        <div className="flex flex-col px-2 py-0">
          <Divider />
        </div>

        <div className="flex flex-col w-full pt-1.5">
          <div className="flex flex-col">
            <div className="flex flex-row justify-around">
              <div className="flex flex-col self-center gap-0.5 text-center">
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
              </div>
              <div className="flex flex-col self-center gap-0.5 text-center">
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
              </div>
              <div className="flex flex-col self-center">
                <Chip
                  label={`${changeValue}%`}
                  isClose={false}
                  color={getChipColor()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
