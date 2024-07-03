import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";

const DoughnutChart = ({
  labels,
  ratio,
  id,
  data,
  label,
}: {
  labels: string[];
  data: number[] | string[];
  ratio: number;
  id: string;
  label: string;
}) => {
  const [currentId, setCurrentId] = useState<string>();
  useEffect(() => {
    if (currentId !== id) {
      setCurrentId(id);
    }
  }, [id]);
  return (
    <Doughnut
      redraw={currentId !== id}
      datasetIdKey={id}
      data={{
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: [
              "rgb(245 158 11)",
              "rgb(250 204 21)",
              "rgb(132 204 22)",
              "rgb(34 197 94)",
              "rgb(21 128 61)",
              "rgb(45 212 191)",
              "rgb(14 165 233)",
              "rgb(37 99 235)",
              "rgb(30 64 175)",
              "rgb(244 114 182)",
              "rgb(244 63 94)",
              "rgb(16 185 129)",
            ],
            hoverOffset: 4,
          },
        ],
      }}
      options={{
        aspectRatio: ratio,
        layout: {
          padding: {
            top: 1,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
        elements: {
          arc: {
            borderWidth: 0,
          },
        },
        plugins: {
          legend: {
            position: "left",
            labels: {
              boxPadding: 10,
              padding: 8,
            },
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: function (context) {
                return `${context.formattedValue}%`;
              },
            },
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
