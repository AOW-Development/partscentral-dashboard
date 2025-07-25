'use client';

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MoreVertical } from 'lucide-react';

const data = [
  { name: 'Engine', value: 400, color: '#FF6384' },
  { name: 'Transmission', value: 300, color: '#36A2EB' },
];

export default function CustomerCoverageCard() {
  return (
    <div className="bg-secondary rounded-xl p-1">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-white">Customer Coverage</p>
        <MoreVertical size={16} className="text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-1 space-y-2 text-sm text-white">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
