"use client";
import { useState } from "react";
import {
  Home,
  Package,
  Factory,
  Users,
  Settings,
  Shield,
  MessageCircle,
  Palette,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "@/store/auth";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const user = useAuthStore((state) => state.user);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className={`${
          open && "hidden"
        } md:hidden fixed top-4 left-4 z-50 bg-secondary p-2 rounded-lg`}
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      {/* Sidebar for desktop */}
      <aside className="hidden fixed z-20 md:flex w-64 bg-secondary flex-col justify-between py-8 px-4 min-h-screen">
        {/* ...existing code... */}
        <div>
          <div className="flex items-center mb-10 border-b border-gray-700 pb-3">
            <Link href="/">
              <Image
                src="/header-3.png"
                alt="Logo"
                width={200}
                height={60}
                className="w-[160px] h-[28px] md:w-[200px] md:h-[30px]"
              />
            </Link>
          </div>
          <nav className="space-y-2 transition-all">
            <Link
              href="/"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-[#00466f] ${
                isActive("/") ? "bg-hover" : ""
              }`}
            >
              <Home className="mr-2 w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/orders"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-[#00466f] ${
                isActive("/orders") ? "bg-hover" : ""
              }`}
            >
              <Package className="mr-2 w-5 h-5" />
              Orders
            </Link>
            <Link
              href="/production"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-[#00466f] ${
                isActive("/production") ? "bg-hover" : ""
              }`}
            >
              <Factory className="mr-2 w-5 h-5" />
              Production
            </Link>
            <Link
              href="/in-clients"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-[#00466f] ${
                isActive("/in-clients") ? "bg-hover" : ""
              }`}
            >
              <Users className="mr-2 w-5 h-5" />
              In Clients
            </Link>
          </nav>
        </div>
        <div>
          <div className="mb-4">
            <span className="text-xs text-gray-400">PREFERENCES</span>
            <nav className="space-y-2 mt-2">
              <Link
                href="/settings"
                className={`flex items-center px-4 py-2 rounded-lg hover:bg-[#00466f] ${
                  isActive("/settings") ? "bg-hover" : ""
                }`}
              >
                <Settings className="mr-2 w-5 h-5" />
                Settings
              </Link>
              <Link
                href="/security"
                className={`flex items-center px-4 py-2 rounded-lg hover:bg-[#00466f] ${
                  isActive("/security") ? "bg-hover" : ""
                }`}
              >
                <Shield className="mr-2 w-5 h-5" />
                Security
              </Link>
              <Link
                href="/support"
                className={`flex items-center px-4 py-2 rounded-lg hover:bg-[#00466f] ${
                  isActive("/support") ? "bg-hover" : ""
                }`}
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Support
              </Link>
              <Link
                href="/theme"
                className={`flex items-center px-4 py-2 rounded-lg hover:bg-[#00466f] ${
                  isActive("/theme") ? "bg-hover" : ""
                }`}
              >
                <Palette className="mr-2 w-5 h-5" />
                Theme
              </Link>
            </nav>
          </div>
          <div className="flex items-center mt-6">
            <Image
              src="/admin-logo.jpg"
              alt="User"
              width={30}
              height={30}
              className="rounded-full mr-2"
            />
            <div>
              <div className="font-bold">Admin</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar for mobile */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-secondary flex-col justify-between py-8 px-4 z-40 transition-transform duration-300 ${
          open ? "flex" : "hidden"
        } md:hidden`}
      >
        <button
          className="absolute top-7 right-4 text-white text-2xl"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          &times;
        </button>
        <div>
          <div className="flex items-center mb-10">
            <Link href="/">
              <Image
                src="/header-3.png"
                alt="Logo"
                width={200}
                height={60}
                className="w-[160px] h-[28px] md:w-[200px] md:h-[30px]"
              />
            </Link>
          </div>
          <nav className="space-y-2">
            <Link
              href="/"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-[#00466f] ${
                isActive("/") ? "bg-hover" : ""
              }`}
            >
              <Home className="mr-2 w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/orders"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-[#00466f] ${
                isActive("/orders") ? "bg-hover" : ""
              }`}
            >
              <Package className="mr-2 w-5 h-5" />
              Orders
            </Link>
            <Link
              href="/production"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-[#00466f] ${
                isActive("/production") ? "bg-hover" : ""
              }`}
            >
              <Factory className="mr-2 w-5 h-5" />
              Production
            </Link>
            <Link
              href="/in-clients"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-[#00466f] ${
                isActive("/in-clients") ? "bg-hover" : ""
              }`}
            >
              <Users className="mr-2 w-5 h-5" />
              In Clients
            </Link>
          </nav>
        </div>
        <div>
          <div className="mb-4">
            <span className="text-xs text-gray-400">PREFERENCES</span>
            <nav className="space-y-2 mt-2">
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 rounded-lg hover:bg-hover-secondary"
              >
                <Settings className="mr-2 w-5 h-5" />
                Settings
              </Link>
              <Link
                href="/security"
                className="flex items-center px-4 py-2 rounded-lg hover:bg-hover-secondary"
              >
                <Shield className="mr-2 w-5 h-5" />
                Security
              </Link>
              <Link
                href="/support"
                className="flex items-center px-4 py-2 rounded-lg hover:bg-hover-secondary"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Support
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-2 rounded-lg hover:bg-hover-secondary"
              >
                <Palette className="mr-2 w-5 h-5" />
                Theme
              </Link>
            </nav>
          </div>
          <div className="flex items-center mt-6">
            <Image
              src="/admin-logo.jpg"
              alt="User"
              width={30}
              height={30}
              className="rounded-full mr-2"
            />
            <div>
              <div className="font-bold">Adhitya</div>
              <div className="text-xs text-gray-400">adhityaj@gmail.com</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
