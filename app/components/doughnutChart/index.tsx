import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

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
  return (
    <Doughnut
      datasetIdKey={id}
      data={{
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: [
              "rgb(142, 179, 49)",
              "rgb(50, 160, 93)",
              "rgb(0, 133, 119)",
              "rgb(0, 102, 117)",
              "rgb(47, 72, 88)",
              "rgb(30, 37, 49)",
              "rgb(152, 176, 169)",
              "rgb(223, 224, 223)",
              "rgb(240, 185, 11)",
              "rgb(193, 86, 76)",
              "rgb(253, 138, 125)",
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
              label: function(context) {
                return `${context.formattedValue}%`;
              }
            }
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
