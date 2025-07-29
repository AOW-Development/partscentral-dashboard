"use client";

import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { Globe, File } from "lucide-react";
import CustomerCoverageCard from "./CustomerCoverage";
import { URL } from "@/utils//imageUrl";

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

const performanceCards = [
  {
    title: "Total Profit",
    value: "₹3140.74",
    icon: "icons/bag.png",
    iconBg: "bg-blue-600",
  },
  {
    title: "Orders Per Day",
    value: "₹42.040",
    icon: "icons/wallet.png",
    iconBg: "bg-white text-hover-secondary",
  },
  {
    title: "Income Per Day",
    value: "₹501.074",
    icon: "icons/dollar.png",
    iconBg: "bg-white text-hover-secondary",
  },
];

export default function MainCard() {
  return (
    <div className="space-y-4 w-full">
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
                <div className="bg-hover-secondary p-1 rounded-lg text-white ">
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
                className="bg-secondary rounded-xl p-5 flex flex-col justify-between flex-1 min-w-[170px] h-[150px]"
              >
                <div className="flex justify-between items-start">
                  <div className={`${item.iconBg} p-2 rounded-full`}>
                    <Image
                      src={URL + item.icon}
                      alt={item.title}
                      width={20}
                      height={15}
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

        {/* Right Section: Customer Coverage */}
        <div className="w-full lg:max-w-sm">
          <div className="bg-secondary rounded-xl p-5 w-full h-full">
            <CustomerCoverageCard />
          </div>
        </div>
      </div>
    </div>
  );
}
