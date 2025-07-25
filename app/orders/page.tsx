import { Pencil } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Orders() {
  return (
    <div className="min-h-screen bg-main text-white font-exo flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="search"
                className="bg-[#091e36] rounded-lg pl-10 pr-4 py-2 w-full text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <select className="bg-[#091e36] rounded-lg px-4 py-2 text-white focus:outline-none">
              <option>Order Status</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Paid</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div>
            <div className="flex items-center bg-[#091e36] rounded-lg px-4 py-2 text-white">
              <span className="mr-2">20Jun25 -30Jun25</span>
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
          </div>
          <div>
            <button className="flex items-center bg-[#091e36] rounded-lg px-4 py-2 text-white">
              Filter
              <svg
                className="ml-2"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16M6 8v8m12-8v8M8 16h8" />
              </svg>
            </button>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <p className="text-gray-400 mb-6">This is the orders page.</p>
        <div className="overflow-x-auto rounded-lg shadow-lg bg-[#0a1e36]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#091627] text-gray-300">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Buyer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Sum</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-100">
              {[
                {
                  id: "022705",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
                {
                  id: "022731",
                  name: "Trasmission",
                  buyer: "Ramjas",
                  date: "30Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Shipped",
                },
                {
                  id: "022732",
                  name: "Engine-DIESEL",
                  buyer: "Mani",
                  date: "22Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Paid",
                },
                {
                  id: "022732",
                  name: "Engine-DIESEL",
                  buyer: "Mani",
                  date: "22Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Cancelled",
                },
                {
                  id: "022705",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
                {
                  id: "0227318",
                  name: "Trasmission",
                  buyer: "Ramjas",
                  date: "30Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Shipped",
                },
                {
                  id: "0227057",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
                {
                  id: "0227056",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
                {
                  id: "0227055",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
                {
                  id: "0227054",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
                {
                  id: "0227053",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
                {
                  id: "0227052",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
                {
                  id: "0227051",
                  name: "Engine-GASOLINE",
                  buyer: "Shiva Kumar",
                  date: "27Jun25",
                  qty: 2,
                  sum: "$1,200",
                  status: "Processing",
                },
              ].map((order, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#1a2b44] last:border-0"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" />
                  </td>
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.name}</td>
                  <td className="px-4 py-3">{order.buyer}</td>
                  <td className="px-4 py-3">{order.date}</td>
                  <td className="px-4 py-3">{order.qty}</td>
                  <td className="px-4 py-3">{order.sum}</td>
                  <td className="px-4 py-3">
                    {order.status === "Processing" && (
                      <span className="bg-[#8b88f9] text-white px-3 py-1 rounded-full text-xs">
                        Processing
                      </span>
                    )}
                    {order.status === "Shipped" && (
                      <span className="bg-[#f6c244] text-white px-3 py-1 rounded-full text-xs">
                        Shipped
                      </span>
                    )}
                    {order.status === "Paid" && (
                      <span className="bg-[#1ecb4f] text-white px-3 py-1 rounded-full text-xs">
                        Paid
                      </span>
                    )}
                    {order.status === "Cancelled" && (
                      <span className="bg-[#f64e4e] text-white px-3 py-1 rounded-full text-xs">
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-white hover:text-blue-400">
                      <Pencil className="w-5 h-4 ml-3 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
