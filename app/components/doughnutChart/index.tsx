import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";

const DoughnutChart = ({
  labels,
  ratio,
  id,
  data,
  label,
  mobile = false,
}: {
  labels: string[];
  data: number[] | string[];
  ratio: number;
  id: string;
  label: string;
  mobile?: boolean;
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
              "rgb(229 231 235)",
              "rgb(199 210 254)",
              "rgb(186 230 253)",
              "rgb(167 243 208)",
              "rgb(253 230 138)",
              "rgb(253 186 116)",
              "rgb(252 165 165)",
              "rgb(216 180 254)",
              "rgb(156 163 175)",
              "rgb(125 211 252)",
              "rgb(52 211 153)",
              "rgb(250 204 21)",
              "rgb(248 113 113)",
              "rgb(75 85 99)",
              "rgb(2 132 199)",
              "rgb(5 150 105)",
              "rgb(254 202 202)",
              "rgb(248 113 113)",
              "rgb(220 38 38)",
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
            display: !mobile,
            fullSize: true,
            align: "center",
            position: "left",
            labels: {
              boxPadding: 2,
              boxHeight: 10,
              padding: mobile ? 2 : 4,
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
