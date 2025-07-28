"use client";
import { Bell, LogOut, Search, Settings } from "lucide-react";
import Image from "next/image";
import useAuthStore from "@/store/auth";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="w-full bg-secondary px-8 py-10 flex  md:flex-row md:items-center md:justify-start gap-65 z-10">
      {/* Left - Dashboard title */}
      <h2 className="text-white font-semibold md:text-[30px] text-[20px] font-audiowide ">
        Dashboard
      </h2>

      <div className="flex items-center justify-end gap-4 w-full md:w-[446px] md:h-[60px] ">
        {/* Search Bar */}
        <div className="relative w-full max-w-full md:max-w-xs ">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Type here..."
            className="w-full bg-secondary text-white placeholder-gray-400 border-2 border-gray-400 rounded-full
                      pl-9 pr-3 py-1.5 text-sm focus:outline-none
                      md:py-2 md:text-base"
          />
        </div>
      </div>

      {/* Right - Icons and User */}
      <div className="flex items-center justify-end gap-2 md:gap-4 w-full md:w-auto">
        {/* Settings button */}
        <button className=" text-white p-2 cursor-pointer rounded-full transition">
          <Settings size={25} />
        </button>

        {/* Notification button */}
        <button className=" text-white p-2 cursor-pointer rounded-full transition">
          <Bell size={25} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <Image
            src="/admin-logo.jpg" // Replace with actual image path
            alt="User"
            width={30}
            height={25}
            className="rounded-full"
          />
          <div className="text-white text-sm hidden sm:block">
            <p className="font-medium leading-tight">Admin</p>
            <p className="text-xs text-gray-300">{user?.email}</p>
          </div>
          {user && (
            <button
              onClick={() => useAuthStore.getState().logout()}
              className="text-white p-2 cursor-pointer rounded-full transition"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
