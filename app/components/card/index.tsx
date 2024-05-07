import Chip from "../chip";
import Divider from "../divider";
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
            <p className="text-xs font-normal italic mb-1">
              {label}
            </p>
          </div>
          <div className="flex flex-col w-full">
            <h4 className="text-2xl font-semibold text-end">
              {value}
            </h4>
          </div>
        </div>

        <div className="flex flex-col">
          <Divider />
        </div>

        <div className="flex flex-col w-full pt-1.5">
          <div className="flex flex-col">
            <div className="flex flex-row justify-around">
              <div className="flex flex-col self-center gap-0.5 text-center">
                <p className="text-xs font-light font-sans">
                  {startDate}
                </p>
                <p className="text-lg font-medium">
                  {start}
                </p>
              </div>
              <div className="flex flex-col self-center gap-0.5 text-center">
                <p className="text-xs font-light font-sans">
                  {endDate}
                </p>
                <p className="text-lg font-medium">
                  {end}
                </p>
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
