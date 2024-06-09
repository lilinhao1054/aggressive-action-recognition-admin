/* eslint-disable react/prop-types */
import { Pie } from "@ant-design/charts";
import { memo } from "react";

const DemoPie = ({ data }) => {
  const config = {
    data,
    autoFit: true,
    angleField: "value",
    colorField: "device",
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
        color: "red",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };
  return <Pie {...config} />;
};

const PieChart = memo(DemoPie);

export default PieChart;
