import Image from "next/image";
import Sidebar from "./components/Sidebar";
import CustomerCoverageCard from "./components/CustomerCoverage";
import { MoreVertical, File, Globe } from "lucide-react";
import RecentSold from "./components/MainTable";
import SalesChart from "./components/SalesChart";
import TopProducts from "./components/TopProductCard";
<<<<<<< HEAD
import MainCard from "./components/MainCards";


const performanceCards = [
  {
    title: 'Total Profit',
    value: '₹3140.74',
    icon: '/icons/bag.png',
    iconBg: 'bg-blue-600',
=======
import Header from "./components/Header";

const performanceCards = [
  {
    title: "Total Profit",
    value: "₹3,140.74",
    icon: "/icons/bag.png",
    iconBg: "bg-blue-600",
>>>>>>> 4307a6d261a8b1acc308495d8ac102788caabdd6
  },
  {
    title: "Orders Per Day",
    value: "₹42.040",
    icon: "/icons/wallet.png",
    iconBg: "bg-white text-hover-secondary",
  },
  {
    title: "Income Per Day",
    value: "₹501.074",
    icon: "/icons/dollar.png",
    iconBg: "bg-white text-hover-secondary",
  },
];
const summaryCards = [
  {
    title: "Used Parts",
    value: "2,300",
    trend: "+5%",
    trendColor: "text-green-400",
    icon: <Globe size={20} />,
  },
  {
    title: "New Parts",
    value: "3,052",
    trend: "-14%",
    trendColor: "text-red-400",
    icon: <File size={20} />,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-main text-white font-exo">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <Header />
        {/* Scrollable Content */}
        <main className="pt-[80px] h-[calc(100vh-0px)] overflow-y-auto">
          <div className="space-y-4 w-full px-5 md:px-6 pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left Section */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Row 1: Used & New Parts */}
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  {summaryCards.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-secondary rounded-xl p-4 flex justify-between items-center w-full sm:flex-1 min-w-[210px] h-[100px]"
                    >
                      <div>
                        <p className="text-sm text-gray-300">{item.title}</p>
                        <h3 className="text-lg font-semibold text-white">
                          {item.value}{" "}
                          <span className={`${item.trendColor} text-sm`}>
                            {item.trend}
                          </span>
                        </h3>
                      </div>
                      <div className="bg-hover-secondary p-2 rounded-lg text-white">
                        {item.icon}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 2: Profit, Orders, Income */}
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  {performanceCards.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-secondary rounded-xl p-5 flex flex-col justify-between flex-1 min-w-[170px] h-[200px]"
                    >
                      <div className="flex justify-between items-start">
                        <div className={`${item.iconBg} p-2 rounded-full`}>
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        </div>
                        <MoreVertical size={16} className="text-gray-400" />
                      </div>
                      <div className="mt-6">
                        <p className="text-sm text-gray-300">{item.title}</p>
                        <h3 className="text-xl font-semibold text-white mt-1">
                          {item.value}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

<<<<<<< HEAD
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
=======
              {/* Right Section: Customer Coverage */}
              <div className="w-full lg:max-w-sm">
                <div className="bg-secondary rounded-xl p-5 w-full h-full">
                  <CustomerCoverageCard />
                </div>
>>>>>>> 4307a6d261a8b1acc308495d8ac102788caabdd6
              </div>
            </div>
          </div>

<<<<<<< HEAD
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
=======
          {/* Charts and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 mt-4 px-5 md:px-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-secondary rounded-xl p-3 md:p-4 w-full h-full">
              <SalesChart />
            </div>

            {/* Top Products */}
            <div className="bg-secondary rounded-xl p-4 md:p-6 mt-4 lg:mt-0 w-full max-w-[960px] mx-auto">
>>>>>>> 4307a6d261a8b1acc308495d8ac102788caabdd6
              <TopProducts />
            </div>
          </div>

          {/* Recent Sold Table */}
          <div className=" px-5 md:px-6 mb-2 rounded-xl">
            <RecentSold />
          </div>
        </main>
      </div>
    </div>
  );
}
