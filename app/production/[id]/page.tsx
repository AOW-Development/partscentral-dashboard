"use client";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import ProtectRoute from "@/app/components/ProtectRoute";
import { URL } from "@/utils//imageUrl";

export default function EngineProductDetailsPage() {
  return (
    <ProtectRoute>
      <div className="min-h-screen bg-main text-white font-exo">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="pt-6 px-4 md:px-8 pb-12">
            {/* Search and Add */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-6">
              <div className="flex-1 min-w-[220px] sm:min-w-[300px]">
                <div className="relative h-[60px] mt-6">
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
                    className="bg-[#091e36] rounded-lg pl-10 pr-4 w-[50%] h-full text-white placeholder-gray-400 focus:outline-none cursor-text"
                  />
                </div>
              </div>
              <div className="flex-shrink-0 w-full sm:w-[200px] h-[60px] mt-6">
                <Link href="/production/add">
                  <button className="flex items-center justify-center bg-[#091e36] rounded-lg w-full h-full text-white font-semibold cursor-pointer">
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

            {/* Breadcrumb */}
            <nav className="font-medium mb-6 space-x-1">
              <span className="font-normal text-white/60">Production</span>
              <span>&gt;</span>
              <span className="font-normal text-white/60">Product Details</span>
              <span>&gt;</span>
              <span className="text-white font-semibold">Engines</span>
            </nav>

            {/* Card Container */}
            <div className="bg-[#091e36] rounded-xl p-4 sm:p-6 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Card */}
                <div className="border border-white/30 rounded-lg p-6 w-full max-w-[483px] h-[500px] flex flex-col justify-between">
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-white font-bold text-xl uppercase tracking-wide mb-2">
                      Name Engine Assembly
                    </h3>
                    <p className="text-white text-sm font-bold mb-6 leading-relaxed">
                      <span className="text-white/70">Option:</span> 4.9L | from
                      2/3/91 (AIR inner manifold) | E4OD transmission
                    </p>

                    {/* Engine Image with white shadow */}
                    <div
                      className="relative w-full max-w-[360px] h-[300px] mb-6 mx-auto before:absolute before:inset-0 before:rounded-xl
                        before:bg-gradient-to-br before:from-white/20 before:via-white/10 before:to-transparent before:blur-lg"
                    >
                      <Image
                        src={`${URL}axle.png`}
                        alt="Engine"
                        fill
                        className="object-contain cursor-pointer relative"
                      />
                    </div>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <span className="text-3xl font-bold mr-2 mb-8">100$</span>
                      <span className="mb-8 line-through text-white/50 font-bold text-lg">
                        100$
                      </span>
                    </div>
                    <div className="text-lg mb-4 font-bold">
                      2 parts in stock
                    </div>
                  </div>
                </div>

                {/* Right Card */}
                <div className="rounded-lg p-6 flex-1 min-h-[500px] flex flex-col justify-between shadow-lg shadow-white/10">
                  <div>
                    {/* Product Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block mb-1 text-white text-[16px] font-semibold">
                          Product Name
                        </label>
                        <input
                          className="w-full bg-[#091e36] border border-white/20 rounded px-3 py-2 text-white font-semibold cursor-text"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-white text-[16px] font-semibold">
                          Model
                        </label>
                        <input
                          className="w-full bg-[#091e36] border border-white/20 rounded px-3 py-2 text-white font-semibold cursor-text"
                          placeholder="Enter model"
                        />
                      </div>
                    </div>

                    {/* Description Table */}
                    <h4 className="text-white text-base font-semibold mb-3">
                      Description
                    </h4>
                    <div className="text-[16px]">
                      {[
                        ["Make", "Volvo"],
                        ["Years", "2018"],
                        ["Part", "Engine Assembly"],
                        ["Miles", "80K"],
                        ["Genuine", "Genuine Dodge Part"],
                        ["Condition", "Excellent Condition"],
                        ["Warranty", "60 Days Warranty"],
                      ].map(([label, value], idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between py-3 px-4 ${
                            idx % 2 === 0 ? "bg-[#0F2D5A]" : "bg-[#000000]"
                          }`}
                        >
                          <span className="w-1/2 text-white font-bold">
                            {label}
                          </span>
                          <span className="w-1/2 text-right text-white font-bold">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warranty Section */}
              <div className="mt-10">
                <h4 className="text-white md:text-2xl text-xl font-semibold mb-3">
                  Warranty
                </h4>
                <p className="text-[#E8F3FF] md:text-xl text-sm font-normal leading-relaxed mb-6">
                  You may return any item in its original condition for a full
                  refund within 30 days of receipt of your shipment, less
                  shipping charges. It typically takes us approximately 3–5
                  business days to process a credit back to your account and 2–3
                  business days for the credit to appear on your account.
                </p>

                {/* Buttons */}
                <div className="flex md:gap-4 gap-2 justify-end flex-wrap">
                  <button className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded cursor-pointer">
                    Remove Product
                  </button>
                  <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded cursor-pointer">
                    Update
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2 rounded cursor-pointer">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
