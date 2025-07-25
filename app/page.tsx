import Image from "next/image";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-main text-white font-exo flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <input
            type="text"
            placeholder="Type here..."
            className="bg-secondary rounded-lg px-4 py-2 w-full md:w-1/3 text-white placeholder-gray-400 focus:outline-none"
          />
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="bg-hover-secondary p-2 rounded-full">
              <span>⚙️</span>
            </button>
            <Image
              src=""
              alt="User"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-secondary rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg font-bold">Used Parts</div>
            <div className="text-2xl mt-2">
              2,300 <span className="text-green-400 text-sm">+5%</span>
            </div>
          </div>
          <div className="bg-secondary rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg font-bold">New Parts</div>
            <div className="text-2xl mt-2">
              3,052 <span className="text-red-400 text-sm">-4%</span>
            </div>
          </div>
          <div className="bg-secondary rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg font-bold">Total Profit</div>
            <div className="text-2xl mt-2">₹3140.74</div>
          </div>
          <div className="bg-secondary rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg font-bold">Orders Per Day</div>
            <div className="text-2xl mt-2">₹42.040</div>
          </div>
        </div>

        {/* Charts and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Sales Chart Placeholder */}
          <div className="lg:col-span-2 bg-secondary rounded-xl p-4 md:p-6">
            <div className="font-bold mb-2">Sales</div>
            <div className="h-40 flex items-center justify-center text-gray-400">
              [Sales Chart]
            </div>
          </div>
          {/* Top Products */}
          <div className="bg-secondary rounded-xl p-4 md:p-6 mt-4 lg:mt-0">
            <div className="font-bold mb-2">Top Products</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left py-1">Products</th>
                  <th className="text-left py-1">Review</th>
                  <th className="text-left py-1">Sold</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Engine</td>
                  <td>⭐ 4.7</td>
                  <td>1,200</td>
                </tr>
                <tr>
                  <td>Transmission</td>
                  <td>⭐ 4.7</td>
                  <td>3,600</td>
                </tr>
                <tr>
                  <td>Axle Assembly</td>
                  <td>⭐ 4.7</td>
                  <td>180,000</td>
                </tr>
                <tr>
                  <td>Headlight</td>
                  <td>⭐ 4.7</td>
                  <td>1,200</td>
                </tr>
                <tr>
                  <td>Transfer Case</td>
                  <td>⭐ 4.7</td>
                  <td>3,600</td>
                </tr>
                <tr>
                  <td>Tail Light</td>
                  <td>⭐ 4.7</td>
                  <td>1,200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sold Table */}
        <div className="bg-secondary rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold">Recent Sold</div>
            <div className="text-sm text-gray-400">Last 7 Days</div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left py-1">Products</th>
                <th className="text-left py-1">Category</th>
                <th className="text-left py-1">Amount</th>
                <th className="text-left py-1">Date</th>
                <th className="text-left py-1">Customer</th>
                <th className="text-left py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Air Flow Meter</td>
                <td>Engine</td>
                <td>500$</td>
                <td>27-7-2025</td>
                <td>Shiva</td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-purple-500 text-white">
                    Processing
                  </span>
                </td>
              </tr>
              <tr>
                <td>Carburetor</td>
                <td>Engine</td>
                <td>500$</td>
                <td>27-7-2025</td>
                <td>Ramjas</td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-yellow-500 text-white">
                    Shipped
                  </span>
                </td>
              </tr>
              <tr>
                <td>Fuel Injection Parts</td>
                <td>Engine</td>
                <td>500$</td>
                <td>27-7-2025</td>
                <td>Mani</td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-green-500 text-white">
                    Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
