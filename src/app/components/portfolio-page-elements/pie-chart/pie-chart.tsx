"use client";

// pie-chart.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./pie-chart.module.scss";

interface PieChartProps {
  tokenBalances: { symbol: string; valueInUSD: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28ED1"];

const PieChartComponent: React.FC<PieChartProps> = ({ tokenBalances }) => {
  const data = tokenBalances.map((token) => {
    const roundedValue = parseFloat(token.valueInUSD.toFixed(2));
    return {
      name: token.symbol,
      value: roundedValue,
    };
  });

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='black'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'
      >
        {`${data[index].name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={styles.container}>
      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={100}
            fill='#8884d8'
            label={renderCustomizedLabel}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;

// import React, { PureComponent } from "react";
// import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";

// const data01 = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
//   { name: "Group E", value: 278 },
//   { name: "Group F", value: 189 },
// ];

// const data02 = [
//   { name: "Group A", value: 2400 },
//   { name: "Group B", value: 4567 },
//   { name: "Group C", value: 1398 },
//   { name: "Group D", value: 9800 },
//   { name: "Group E", value: 3908 },
//   { name: "Group F", value: 4800 },
// ];

// export default class Example extends PureComponent {
//   static demoUrl = "https://codesandbox.io/s/two-simple-pie-chart-otx9h";

//   render() {
//     return (
//       // <ResponsiveContainer width='100%' height='100%'>
//       <PieChart width={400} height={400}>
//         <Pie
//           dataKey='value'
//           isAnimationActive={false}
//           data={data01}
//           cx='50%'
//           cy='50%'
//           outerRadius={80}
//           fill='#8884d8'
//           label
//         />
//         <Pie
//           dataKey='value'
//           data={data02}
//           cx={500}
//           cy={200}
//           innerRadius={40}
//           outerRadius={80}
//           fill='#82ca9d'
//         />
//         <Tooltip />
//       </PieChart>
//       // </ResponsiveContainer>
//     );
//   }
// }
