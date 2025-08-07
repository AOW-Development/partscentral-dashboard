"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { MoreHorizontal } from "lucide-react";

const data = [
  { name: "Facebook", value: 500, color: "#FFEB3B" }, // Yellow
  { name: "Google", value: 150, color: "#FFFFFF" }, // White
  { name: "Others", value: 100, color: "#FF5722" }, // Red
];

export default function CustomerCoverageCard() {
  return (
    <div className="w-full max-w-[380px] bg-secondary rounded-xl px-4 py-4 shadow-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-base font-audiowide font-semibold text-white">
          Customer Coverage
        </p>
        <MoreHorizontal size={18} className="text-gray-400" />
      </div>

      {/* Main content: Chart left, legend right */}
      <div className="flex items-center justify-between md:gap-2 gap-2 md:mt-2 mt-4">
        {/* Pie Chart */}
        <div className="w-42 h-48 md:w-35 md:h-35 ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e2f45", border: "none" }} //use a darker background
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
              />
              <Pie
                data={data}
                dataKey="value"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={3}
                cornerRadius={5}
                stroke="#1e2f45"
                strokeWidth={2}
                fill="#8884d8"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Labels */}
        <div className="space-y-2 text-sm text-white mr-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
