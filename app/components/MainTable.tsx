"use client";

import Image from "next/image";
import { ChevronDown, MoreVertical } from "lucide-react";
import React from "react";

type SoldItem = {
  image: string;
  category: string;
  amount: string;
  date: string;
  customer: string;
  status: string;
};

const soldItems: SoldItem[] = [
  {
    image: "/recent-sold/air-flow.png",
    category: "Air Flow Meter",
    amount: "500$",
    date: "27-7-2025",
    customer: "Shiva",
    status: "Processing",
  },
  {
    image: "/recent-sold/carbourater.png",
    category: "Carburetor",
    amount: "500$",
    date: "27-7-2025",
    customer: "Ramjas",
    status: "Shipped",
  },
  {
    image: "/recent-sold/fuel-inject.png",
    category: "Fuel Injection Parts",
    amount: "500$",
    date: "27-7-2025",
    customer: "Mani",
    status: "Paid",
  },
];

export default function RecentSold() {
  return (
    <div className="bg-gradient-to-br from-[#07182C] to-[#03101E] rounded-xl p-4 md:p-6 w-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Sold</h2>
        <div className="flex items-center gap-1 text-sm text-gray-300 cursor-pointer">
          Last 7 Days
          <ChevronDown className="w-4 h-4 mt-[1px]" />
        </div>
      </div>

      {/* Table Header (desktop only) */}
      <div className="hidden md:grid grid-cols-6 gap-4 text-sm text-gray-400 border-b border-[#1e2f45] pb-2">
        <div>Products</div>
        <div>Category</div>
        <div>Amount</div>
        <div>Date</div>
        <div>Customer</div>
        <div className="text-right">Status</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-[#1e2f45]">
        {soldItems.map((item, index) => {
          const { image, category, amount, date, customer } = item;

          return (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-4"
            >
              {/* Product Image */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A3FF] to-[#006299] p-[3px]">
                  <Image
                    src={image}
                    alt={category}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Category title */}
              <div>
                <div className="text-sm font-medium">{category}</div>
              </div>

              {/* Amount */}
              <div className="text-sm">{amount}</div>

              {/* Date */}
              <div className="text-sm">{date}</div>

              {/* Customer */}
              <div className="text-sm">{customer}</div>

              {/* Status */}
              <div className="flex justify-end">
                <MoreVertical className="text-gray-400 w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
