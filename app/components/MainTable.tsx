// MainTable component
import { MoreVertical } from "lucide-react";

const soldItems = [
  {
    image: "/parts/airflow.png",
    name: "Air Flow Meter",
    category: "Engine",
    amount: "500$",
    date: "27-7-2025",
    customer: "Shiva",
    status: "Processing",
  },
  {
    image: "/parts/carburetor.png",
    name: "Carburetor",
    category: "Engine",
    amount: "500$",
    date: "27-7-2025",
    customer: "Ramjas",
    status: "Shipped",
  },
  {
    image: "/parts/fuelinject.png",
    name: "Fuel Injection Parts",
    category: "Engine",
    amount: "500$",
    date: "27-7-2025",
    customer: "Mani",
    status: "Paid",
  },
];

export default function RecentSold() {
  return (
    <div className="bg-gradient-to-br from-[#092139] to-[#071C2F] rounded-xl p-4 md:p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white font-semibold text-lg">Recent Sold</div>
        <div className="text-sm text-gray-400">Last 7 Days</div>
      </div>
      <div className="divide-y divide-[#1e2f45]">
        {soldItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-4">
            {/* Product + Category */}
            <div className="flex items-center gap-4 w-[200px]">
              <div className="relative w-10 h-10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain rounded-full bg-gradient-to-br from-blue-600 to-blue-900 p-1"
                />
              </div>
              <div>
                <div className="text-white text-sm font-medium">{item.name}</div>
                <div className="text-xs text-gray-400">{item.category}</div>
              </div>
            </div>

            {/* Amount */}
            <div className="text-sm text-white w-[80px]">{item.amount}</div>

            {/* Date */}
            <div className="text-sm text-white w-[100px]">{item.date}</div>

            {/* Customer */}
            <div className="text-sm text-white w-[100px]">{item.customer}</div>

            {/* Status Icon */}
            <div className="text-gray-400">
              <MoreVertical size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
