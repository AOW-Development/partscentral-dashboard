"use client";
import { Bell, LogOut, Search, Settings } from "lucide-react";
import Image from "next/image";
import useAuthStore from "@/store/auth";

export default function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-full bg-secondary px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-start gap-4 md:gap-65 z-10">
      {/* Top - Dashboard title */}
      <div className="flex justify-between items-center md:justify-start">
        <h2 className="text-white font-semibold text-[20px] ml-5 pl-10 md:ml-0 md:text-[30px] font-audiowide">
          Dashboard
        </h2>

        {/* Mobile-only logout icon */}
        <div className="md:hidden flex items-center gap-2">
          <button className="text-white p-2">
            <Settings size={20} />
          </button>
          <button className="text-white p-2">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Middle - Search */}
      <div className="w-full md:w-[446px]">
        <div className="relative w-full">
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

      {/* Bottom / Right - User & Icons */}
      <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4 w-full">
        {/* Desktop-only settings & bell */}
        <div className="hidden md:flex items-center gap-2">
          <button className="text-white p-2">
            <Settings size={25} />
          </button>
          <button className="text-white p-2">
            <Bell size={25} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Image
            src="/admin-logo.jpg"
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
              className="text-white p-2"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
