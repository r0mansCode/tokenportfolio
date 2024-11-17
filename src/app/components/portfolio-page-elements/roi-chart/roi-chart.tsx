import React from "react";
import styles from "./roi-chart.module.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const RoiChart = ({ rawData }: any) => {
  const data = Object.keys(rawData).map((key) => ({
    name: key,
    roi: rawData[key],
  }));
  return (
    <div className={styles.container}>
      <h2>ROI Chart</h2>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='roi'>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.roi < 0 ? "#ff4d4f" : "#8884d8"} // Red for negative, blue for positive
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoiChart;
