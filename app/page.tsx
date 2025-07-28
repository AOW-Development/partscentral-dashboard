import Image from "next/image";
import Sidebar from "./components/Sidebar";
import CustomerCoverageCard from "./components/CustomerCoverage";
import { Bell, MoreVertical,  Search, Settings, File, Globe, } from "lucide-react";
import RecentSold from "./components/MainTable";
import SalesChart from "./components/SalesChart";
import TopProducts from "./components/TopProductCard";
import MainCard from "./components/MainCards";


const performanceCards = [
  {
    title: 'Total Profit',
    value: '₹3140.74',
    icon: '/icons/bag.png',
    iconBg: 'bg-blue-600',
  },
  {
    title: 'Orders Per Day',
    value: '₹42.040',
    icon: '/icons/wallet.png',
    iconBg: 'bg-white text-hover-secondary',
  },
  {
    title: 'Income Per Day',
    value: '₹501.074',
    icon: '/icons/dollar.png',
    iconBg: 'bg-white text-hover-secondary',
  },
];
const summaryCards = [
  {
    title: 'Used Parts',
    value: '2,300',
    trend: '+5%',
    trendColor: 'text-green-400',
    icon: <Globe size={20} />,
  },
  {
    title: 'New Parts',
    value: '3,052',
    trend: '-14%',
    trendColor: 'text-red-400',
    icon: <File size={20} />,
  },
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
          <h2 className="text-white font-semibold md:text-[30px] text-[20px] font-audiowide ">
            Dashboard
          </h2>

    
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
              <Settings size={25} />
            </button>

            {/* Notification button */}
            <button className=" text-white p-2 rounded-full transition">
              <Bell size={25} />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <Image
                src="/admin-logo.jpg" // Replace with actual image path
                alt="User"
                width={25}
                height={30}
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
         <MainCard />


        {/* Charts and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 mt-4">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-secondary rounded-xl p-3 md:p-4 w-full h-full">
            <SalesChart />
          </div>


          {/* Top Products */}
          <div className="bg-secondary rounded-xl p-4 md:p-6 mt-4 lg:mt-0 w-full max-w-[960px] mx-auto">
              <TopProducts />
            </div>
        </div>

        {/* Recent Sold Table */}
        <div className="bg-secondary rounded-xl p-4 md:p-6">
          <RecentSold />
        </div>
      </main>
    </div>
  );
}
