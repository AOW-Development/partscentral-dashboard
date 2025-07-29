"use client";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import ProtectRoute from "@/app/components/ProtectRoute";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [title, setTitle] = useState("");
  const [engineType, setEngineType] = useState("All");
  const [files, setFiles] = useState<FileList | null>(null);
  const [stock, setStock] = useState("All");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Processing");
  const [price, setPrice] = useState("");

  return (
    <ProtectRoute>
      <div className="min-h-screen bg-main text-white font-exo">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="pt-6 px-4 md:px-8 pb-12">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-[220px] sm:min-w-[300px]">
              <div className="relative h-[60px] mt-6">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                  <svg className="ml-2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
            <span className="font-semibold text-white">Add Product</span>
            
          </nav>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Panel */}
              <div className="md:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-base mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Enter title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-base bg-[#0A2540] text-white rounded-lg px-4 py-3"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-base mb-1">Description</label>

                  {/* Toolbar UI */}

                  <textarea
                    rows={6}
                    className="w-full text-base bg-[#0A2540] text-white rounded-lg px-4 py-3"
                    placeholder="Write description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  {/* Upload Files Button */}
                </div>

                {/* Media */}
                <div>
                  <label className="block text-base mb-1">Media</label>
                  <div className="bg-[#0A2540] text-white rounded-lg px-4 py-6 text-center border border-dashed border-gray-600">
                    <input
                      type="file"
                      className="hidden"
                      id="mediaUpload"
                      onChange={(e) => {
                        setFiles(e.target.files);
                      }}
                      accept="image/*,video/*,model/*"
                      multiple
                    />
                    <label htmlFor="mediaUpload" className="cursor-pointer">
                      Upload Files <br />
                      <span className="text-xs text-gray-400">
                        Accepts images, videos, or 3D models
                      </span>
                    </label>
                    {files && files.length > 0 && (
                      <div className="mt-4 text-left">
                        <div className="text-xs text-gray-300 mb-1">
                          Selected files:
                        </div>
                        <ul className="text-xs text-white list-disc pl-4">
                          {Array.from(files).map((file, idx) => (
                            <li key={idx}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-base mb-1">Category</label>
                  <select
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    className="w-full text-base bg-[#0A2540] text-white rounded-lg px-4 py-3"
                  >
                    <option>Choose the product category</option>
                    <option>Engine</option>
                    <option>Transmission</option>
                  </select>
                </div>

                {/* Pricing */}
                <div className="bg-[#0A2540] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-1">Pricing</label>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-[#103245] px-4 py-2 rounded text-white"
                        placeholder="$ 0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Compare at price
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#103245] px-4 py-2 rounded text-white"
                        placeholder="$ 0.00"
                      />
                    </div>
                  </div>
                  <label className="block text-sm mb-1">Cost per item</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      className="w-1/3 bg-[#103245] px-4 py-2 rounded text-white"
                      placeholder="$ 0.00"
                    />
                    <input
                      type="text"
                      className="w-1/3 bg-[#103245] px-4 py-2 rounded text-white"
                      placeholder="Profit"
                    />
                    <input
                      type="text"
                      className="w-1/3 bg-[#103245] px-4 py-2 rounded text-white"
                      placeholder="Margin"
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-[#0A2540] p-4 rounded-lg">
                  <h1 className="text-lg font-semibold">Shipping</h1>
                  <label className="flex items-center space-x-2 mb-4">
                    <input type="checkbox" className="form-checkbox" />
                    <span>This is a physical product</span>
                  </label>
                  <div>
                    <label className="block text-sm mb-1">Weight</label>
                    <input
                      type="text"
                      className="w-full bg-[#103245] px-4 py-2 rounded text-white"
                      placeholder="e.g. 500g"
                    />
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-base mb-1">Status</label>
                  <select
                    className="w-full bg-[#0A2540] text-white rounded-lg px-4 py-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Paid</option>
                    <option>Cancelled</option>
                    {/* <option>Completed</option> */}
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-base mb-1">Stocks</label>
                  <select
                    className="w-full bg-[#0A2540] text-white rounded-lg px-4 py-3"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  >
                    <option>Instock</option>
                    <option>Outstock</option>
                  </select>
                </div>

                {/* Organization Fields */}
                <div className="bg-[#0A2540] p-4 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Make</label>
                    <select className="w-full bg-[#103245] text-white rounded px-4 py-2">
                      <option>Ford</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Model</label>
                    <select className="w-full bg-[#103245] text-white rounded px-4 py-2">
                      <option>Aspire</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Year</label>
                    <select className="w-full bg-[#103245] text-white rounded px-4 py-2">
                      <option>2004</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Parts</label>
                    <select className="w-full bg-[#103245] text-white rounded px-4 py-2">
                      <option>Engine</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white text-base rounded-lg">
                Save
              </button>
            </div>
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
