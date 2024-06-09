/* eslint-disable react/prop-types */
import { Line } from "@ant-design/charts";
import { memo } from "react";

const DemoLine = ({ data }) => {
  const config = {
    data,
    xField: "date",
    yField: "value",
    autoFit: true,
    point: {
      shapeField: "square",
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
    colorField: "device",
    selector: (data) => {
      console.log(data);
      if (data.length) {
        // 对于每个系列的数据，只保留索引等于 2 的标签
        return data.filter((d, index) => index === 2);
      }
      return data;
    },
  };
  return <Line {...config} />;
};

const LineChart = memo(DemoLine);

export default LineChart;
