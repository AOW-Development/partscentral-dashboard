'use client';

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MoreHorizontal } from 'lucide-react'; // Changed to MoreHorizontal for the three dots icon

const data = [
  { name: 'Internet', value: 500, color: '#FFEB3B' }, // Yellow
  { name: 'Email', value: 150, color: '#FFFFFF' }, // White
  { name: 'Social Media', value: 100, color: '#FF5722' }, // Red
];

export default function CustomerCoverageCard() {
  return (
    // Changed background color to a darker blue/navy to match the image
    <div className=" rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        {/* Text color is white by default in this container */}
        <p className="text-xl font-semibold text-white">Customer Coverage</p>
        <MoreHorizontal size={24} className="text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={200}> 
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60} // Adjusted inner radius to match the image
            outerRadius={90} // Adjusted outer radius to match the image
            paddingAngle={3}
            cornerRadius={5} // Added cornerRadius for a slightly rounded look
            fill="#8884d8" // Default fill, overridden by Cell colors
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2 text-base text-white"> {/* Adjusted font size */}
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3"> {/* Increased gap */}
            <span
              className="inline-block w-4 h-4 rounded-full" // Increased size of color circles
              style={{ backgroundColor: item.color }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
