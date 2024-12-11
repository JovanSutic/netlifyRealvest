import { LineDataset } from "../types/dashboard.types";
import { Line } from "react-chartjs-2";
import { useRef } from "react";
import "chart.js/auto";

const LineReport = ({ data }: { data: LineDataset }) => {
  const ref = useRef(null);

  return (
    <div>
      <div className="w-full">
        <Line
          ref={ref}
          data={data}
          options={{
            responsive: true,
            scales: {
              y: {
                ticks: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  callback: function (value: number) {
                    return `${value}€`;
                  },
                },
              },
              x: {
                grid: {
                  color: "rgba(0, 0, 0, 0)",
                },
              },
            },
            plugins: {
              legend: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                onClick: (e) => e.stopPropagation(),
              },
              tooltip: {
                displayColors: false,
                callbacks: {
                  label: function (context) {
                    return `${context.formattedValue}€`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default LineReport;
