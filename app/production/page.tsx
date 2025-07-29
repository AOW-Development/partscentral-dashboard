"use client";

import Header from "../components/Header";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
// import { useState } from "react";
import ProtectRoute from "../components/ProtectRoute";

import { useState } from "react";
import Link from "next/link";

export default function ProductionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [engineType, setEngineType] = useState("All");
  const [stock, setStock] = useState("All");

  // Demo data for filtering
  const products = [
    {
      id:1,
      type: "Engines",
      stock: "Instock",
      name: "GASOLINE",
      image: "/engine1.png",
    },
    {
      id:2,

      type: "Engines",
      stock: "Instock",
      name: "DIESEL",
      image: "/engine1.png",
    },
    {

      id:3,
      type: "Transmission",
      stock: "Instock",
      name: "AUTO",
      image: "/engine1.png",
    },
    {
      id:4,
      type: "Brakes",
      stock: "Outstock",
      name: "BRAKE KIT",
      image: "/engine1.png",
    },
    {
      id:5,
      type: "Engines",
      stock: "Outstock",
      name: "GASOLINE",
      image: "/engine1.png",
    },
    {
      id:6,
      type: "Transmission",
      stock: "Instock",
      name: "MANUAL",
      image: "/engine1.png",
    },
  ];

  const filteredProducts = products.filter((p) => {
    // Show all if default selected
    const engineMatch =
      engineType === "" || engineType === "All" || p.type === engineType;
    const stockMatch = stock === "" || stock === "All" || p.stock === stock;
    const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
    return engineMatch && stockMatch && searchMatch;
  });

  return (
    <ProtectRoute>
      <div className="min-h-screen bg-main text-white font-exo">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="md:pl-64">
          {/* Header */}
          <Header />
          {/* Scrollable Content */}
          <main className="pt-[40px] h-[calc(100vh-0px)] overflow-y-auto px-4 md:px-8">
            {/* Filters Row */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-8">
              {/* Search Input: 368x73 base */}
              <div className="flex-1 min-w-[220px] sm:min-w-[300px]">
                <div className="relative h-[60px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#091e36] rounded-lg pl-10 pr-4 w-[50%] h-full text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Engines Dropdown: 248x73 */}
              <div className="flex-shrink-0 w-full sm:w-[200px] h-[60px]">
                <select
                  className="bg-[#091e36] cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none"
                  value={engineType}
                  onChange={(e) => setEngineType(e.target.value)}
                >
                  <option>All</option>
                  <option>Engines</option>
                  <option>Transmission</option>
                  <option>Brakes</option>
                </select>
              </div>

              {/* Stock Dropdown: 248x73 */}
              <div className="flex-shrink-0 w-full sm:w-[200px] h-[60px]">
                <select
                  className="bg-[#091e36] cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                >
                  <option>All</option>
                  <option>Instock</option>
                  <option>Outstock</option>
                </select>
              </div>

              {/* Add Button: 248x73 */}
              <div className="flex-shrink-0 w-full sm:w-[200px] h-[60px]">
                <Link href={"/production/add"}>
                  <button className="flex cursor-pointer items-center justify-center bg-[#091e36] rounded-lg w-full h-full text-white">
                    Add
                    <svg
                      className="ml-2"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-[#091e36] rounded-xl p-4 sm:p-6 lg:p-10">
              <h1 className="text-2xl font-bold mb-8">Production</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredProducts.map((product, idx) => (
                 <Link href={`production/${product.id}`} >
                  
                  <div
                    key={idx}
                    className="w-full cursor-pointer max-w-[437px] h-auto bg-gradient-to-br bg-main rounded-xl p-4 sm:p-6 flex flex-col shadow-lg relative border border-white hover:shadow-xl hover:scale-[1.01] transition duration-200 mx-auto"
                  >
                    {/* Status badge */}
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        product.stock === "Outstock"
                          ? "bg-[#f64e4e]"
                          : "bg-[#1ecb4f]"
                      }`}
                    >
                      {product.stock}
                    </span>

                    {/* More icon */}
                    <span className="absolute top-4 right-4 text-gray-400 cursor-pointer">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </span>

                    {/* Top section: Image + Info side-by-side (or stacked on small screens) */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start mb-4 mt-6">
                      {/* Image with white glow gradient and larger width */}
                      <div className="relative w-full sm:w-[280px] h-[149px] rounded-xl
                       flex items-center justify-center before:absolute before:inset-0 before:rounded-xl
                        before:bg-gradient-to-br before:from-white/20 before:via-white/10 before:to-transparent before:blur-lg ">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={280}
                          height={149}
                          className="object-contain relative "
                        />
                      </div>

                      {/* Info beside image */}
                      <div className="flex flex-col justify-start mt-6 text-white">
                        <div className="text-lg font-bold tracking-wide">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                          {product.type}
                        </div>
                        <div className="text-xl font-semibold tracking-tight">
                          100<span className="text-white text-lg gap-1">$</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="text-sm text-white mb-6 leading-relaxed">
                      Get your favorite products delivered automatically, enjoy
                      exclusive discounts, skip or cancel anytime. Convenience
                      and savings in one click.
                    </div>

                    {/* Separator line - full bleed */}
                    <div className="h-px bg-white/20 -mx-6 mb-4"></div>

                    {/* Sales and Quantity */}
                    <div className="flex items-center justify-between text-sm mb-2 text-white">
                      <span>Sales</span>
                      <span className="flex items-center gap-1 text-green-400 font-semibold">
                        220
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 15l6-6 6 6" />
                        </svg>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white">
                      <span>Quantity</span>
                      <div className="flex-1 h-2 bg-[#1a2b44] rounded-full overflow-hidden">
                        <div className="h-2 bg-[#1ecb4f] w-3/4"></div>
                      </div>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="pb-6">
              {/* Your content here */}
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>
            {/* </div> */}
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
