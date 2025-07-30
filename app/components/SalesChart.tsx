'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { month: 'Jan', current: 500, previous: 200 },
  { month: 'Feb', current: 120, previous: 220 },
  { month: 'Mar', current: 200, previous: 280 },
  { month: 'Apr', current: 250, previous: 260 },
  { month: 'May', current: 300, previous: 300 },
  { month: 'Jun', current: 400, previous: 280 },
  { month: 'Jul', current: 320, previous: 290 },
  { month: 'Aug', current: 280, previous: 270 },
  { month: 'Sep', current: 310, previous: 200 },
  { month: 'Oct', current: 220, previous: 260 },
  { month: 'Nov', current: 400, previous: 280 },
  { month: 'Dec', current: 450, previous: 240 },
];

export default function SalesChart() {
  return (
    <div className="bg-secondary rounded-xl w-full px-2 sm:px-4 md:px-6 pt-4 pb-6">
      <div className="text-white font-bold font-audiowide text-base md:text-lg mb-1">Sales</div>
      <p className="text-green-400 text-sm mb-4">(+5%) more in 2025</p>

      <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00bfff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00bfff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66e0ff" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#66e0ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="#ccc"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#ccc"
              fontSize={12}
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
              width={30}
              axisLine={false}
              tickLine={false}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                fontSize: '13px',
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#ccc' }}
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#66e0ff"
              fillOpacity={1}
              fill="url(#colorPrevious)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#00bfff"
              fillOpacity={1}
              fill="url(#colorCurrent)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
