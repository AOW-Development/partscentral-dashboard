"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { MoreHorizontal } from "lucide-react";

const data = [
  { name: "Internet", value: 500, color: "#FFEB3B" }, // Yellow
  { name: "Email", value: 150, color: "#FFFFFF" }, // White
  { name: "Social Media", value: 100, color: "#FF5722" }, // Red
];

export default function CustomerCoverageCard() {
  return (
    <div className="w-full max-w-[350px] bg-secondary rounded-xl px-4 py-4 shadow-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-base font-semibold text-white">Customer Coverage</p>
        <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
      </div>

      {/* Main content: Chart left, legend right */}
      <div className="flex items-center justify-between md:gap-4 gap-2 md:mt-8 mt-4">
        {/* Pie Chart */}
        <div className="w-28 h-38 md:w-38">
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
        <div className="space-y-2 text-sm text-white">
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
