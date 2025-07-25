"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CalorieRing = ({ consumed, target }) => {
  const remaining = Math.max(0, target - consumed);
  const data = [
    { name: "Consumed", value: consumed },
    { name: "Remaining", value: remaining },
  ];
  const COLORS = ["#4f46e5", "#374151"]; // Indigo-600, Gray-700

  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-3xl sm:text-4xl font-bold">{consumed}</span>
        <span className="text-sm text-gray-400">/ {target} kcal</span>
      </div>
    </div>
  );
};

export default CalorieRing;
