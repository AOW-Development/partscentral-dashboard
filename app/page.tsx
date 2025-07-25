import Image from "next/image";
import Sidebar from "./components/Sidebar";
import CustomerCoverageCard from "./components/CustomerCoverage";
import { Bell, DollarSign, File, Globe, MoreVertical, Package, Search, Settings, ShoppingBag, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import RecentSold from "./components/MainTable";

const data = [
  { name: 'Engine', value: 400 ,color: '#FF6384'},
  { name: 'Transmission', value: 300,color: '#FF6384' },
  { name: 'Auto-Parts', value: 300,color: '#FF6384' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-main text-white font-exo flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-5 md:px-6 ">
        {/* Top Bar */}
      <div className=" px-4 py-6  rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left - Dashboard title */}
      <h2 className="text-white font-semibold md:text-[32px] text-[20px] font-audiowide px-6">Dashboard</h2>

      {/* Middle - Search bar */}
       <div className="flex items-center justify-end gap-3 w-full md:w-[446px] md:h-[60px] ml-auto">
    {/* Search Bar */}
        <div className="relative w-full max-w-full md:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Type here..."
            className="w-full bg-secondary text-white placeholder-gray-400 rounded-full
                      pl-9 pr-3 py-1.5 text-sm focus:outline-none
                      md:py-2 md:text-base"
          />
        </div>
        </div>

      {/* Right - Icons and User */}
      <div className="flex items-center gap-3">
        {/* Settings button */}
        <button className=" text-white p-2 rounded-full transition">
          <Settings size={40} />
        </button>

        {/* Notification button */}
        <button className=" text-white p-2 rounded-full transition">
          <Bell size={40} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <Image
            src="/admin-logo.jpg" // Replace with actual image path
            alt="User"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="text-white text-sm hidden sm:block">
            <p className="font-medium leading-tight">Ashray</p>
            <p className="text-xs text-gray-300">ashray@company.com</p>
          </div>
        </div>
      </div>
    </div>

        {/* Stats Cards */}
        <div className="space-y-4">
      
        <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Section */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Row 1: Used Parts & New Parts */}
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <div className="bg-secondary rounded-xl p-4 flex justify-between items-center w-full sm:w-[300px] h-[80px]">
              <div>
                <p className="text-sm text-gray-300">Used Parts</p>
                <h3 className="text-lg font-semibold text-white">
                  2,300 <span className="text-green-400 text-sm">+5%</span>
                </h3>
              </div>
              <div className="bg-hover-secondary p-2 rounded-lg text-white">
                <Globe size={20} />
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-4 flex justify-between items-center w-full sm:w-[300px] h-[80px]">
              <div>
                <p className="text-sm text-gray-300">New Parts</p>
                <h3 className="text-lg font-semibold text-white">
                  3,052 <span className="text-red-400 text-sm">-14%</span>
                </h3>
              </div>
              <div className="bg-hover-secondary p-2 rounded-lg text-white">
                <File size={20} />
              </div>
            </div>
          </div>

          {/* Row 2: Profit, Orders, Income */}
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <div className="bg-secondary rounded-xl p-5 flex flex-col justify-between w-full sm:w-[200px] h-[180px]">
              <div className="flex justify-between items-start">
                <div className="bg-blue-600 p-2 rounded-full text-white">
                  <Wallet size={18} />
                </div>
                <MoreVertical size={16} className="text-gray-400" />
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-300">Total Profit</p>
                <h3 className="text-xl font-semibold text-white mt-1">₹3140.74</h3>
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-5 flex flex-col justify-between w-full sm:w-[200px] h-[180px]">
              <div className="flex justify-between items-start">
                <div className="bg-white p-2 rounded-full text-hover-secondary">
                  <ShoppingBag size={18} />
                </div>
                <MoreVertical size={16} className="text-gray-400" />
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-300">Orders Per Day</p>
                <h3 className="text-xl font-semibold text-white mt-1">₹42.040</h3>
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-5 flex flex-col justify-between w-full sm:w-[200px] h-[180px]">
              <div className="flex justify-between items-start">
                <div className="bg-white p-2 rounded-full text-hover-secondary">
                  <DollarSign size={18} />
                </div>
                <MoreVertical size={16} className="text-gray-400" />
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-300">Income Per Day</p>
                <h3 className="text-xl font-semibold text-white mt-1">₹501.074</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Customer Coverage */}
        <div className="w-full lg:w-[390px] h-auto lg:h-[280px] md:mb-4">
          <div className="bg-secondary rounded-xl p-5 w-full h-full">
            <CustomerCoverageCard />
          </div>
        </div>
      </div>
      </div>

        {/* Charts and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 mt-4">
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
          <RecentSold/>
        </div>
      </main>
    </div>
  );
}
