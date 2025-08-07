"use client";
import Image from "next/image";
import Sidebar from "./components/Sidebar";
import CustomerCoverageCard from "./components/CustomerCoverage";
import { MoreVertical, File, Globe, Calendar, ChevronDown } from "lucide-react";
import RecentSold from "./components/MainTable";
import SalesChart from "./components/SalesChart";
import TopProducts from "./components/TopProductCard";
import Header from "./components/Header";
import ProtectRoute from "./components/ProtectRoute";
import { URL } from "@/utils//imageUrl";
// import MainCalendar from "react-calendar";
import { useEffect, useState } from "react";
import CalendarMain from "./components/Calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const performanceCards = [
  {
    title: "Total Gross Profit",
    value: "$ 3,140.74",
    icon: "icons/bag.png",
    iconBg: "bg-blue-600",
  },
  {
    title: "Orders",
    value: "$ 42.040",
    icon: "icons/wallet.png",
    iconBg: "bg-white text-hover-secondary",
  },
  {
    title: "Revenue",
    value: "$ 501.074",
    icon: "icons/dollar.png",
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
  const [open, setOpen] = useState(false);
  const [value, onChange] = useState<Value>(new Date());
  console.log(onChange);

  // Extract month name, year, and date separately
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  useEffect(() => {
    if (window.onmouseenter) {
      setOpen(false);
    }
  }, [setOpen]);

  const monthName = value instanceof Date ? monthNames[value.getMonth()] : null;
  const year = value instanceof Date ? value.getFullYear() : null;
  const date = value instanceof Date ? value.getDate() : null;
  return (
    <ProtectRoute>
      <div className="md:min-h-screen bg-main text-white font-exo">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="min-h-screen flex flex-col md:ml-64">
          {/* Header */}
          <Header />
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-clip pt-1">
            <div className="space-y-4 w-full px-5 md:px-6 pt-30 md:pt-6">
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
                        className="bg-secondary rounded-xl p-5 flex flex-col gap-1 md:gap-4 flex-1 min-w-[170px] h-full"
                      >
                        <div className="flex justify-between items-start">
                          <div className={`${item.iconBg} p-2 rounded-full`}>
                            <Image
                              src={URL + item.icon}
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

                {/* Right Section: Date Button and Customer Coverage */}
                {/* <button
                  onClick={() => {
                    setOpen(!open);
                  }}
                > */}
                <div className="w-full lg:max-w-sm space-y-4">
                  {/* Date Button */}
                  <div
                    className="bg-secondary rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-secondary/90 transition-colors"
                    onClick={() => {
                      setOpen(!open);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 rounded-lg p-2">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-white flex flex-row gap-2">
                        <p className="text-sm font-medium">Today</p>
                        <p className="text-sm opacity-80">
                          {monthName} {date} • {year}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  </div>

                  {/* Customer Coverage Card */}
                  {/* <div className="bg-secondary rounded-xl p-5 w-full h-full"> */}
                  <CustomerCoverageCard />
                  {/* </div> */}
                </div>
                {open && <CalendarMain onClose={() => setOpen(false)} />}
                {/* </button> */}
              </div>
            </div>

            {/* Charts and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 mt-4 px-5 md:px-6">
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
            <div className=" px-5 md:px-6 mb-2 rounded-xl">
              <RecentSold />
            </div>
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
