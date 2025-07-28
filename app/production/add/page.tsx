"use client";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import ProtectRoute from "@/app/components/ProtectRoute";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [engineType, setEngineType] = useState("All");
  const [stock, setStock] = useState("All");
  const [description, setDescription] = useState("");

  return (

      <div className="min-h-screen bg-[#031a32] text-white font-exo">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="pt-6 px-4 md:px-8 pb-12">
            <h2 className="text-2xl font-semibold mb-4">Production &gt; Add Product</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Panel */}
              <div className="md:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-base mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Enter title"
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
                    <input type="file" className="hidden" id="mediaUpload" />
                    <label htmlFor="mediaUpload" className="cursor-pointer">
                      Upload Files <br />
                      <span className="text-xs text-gray-400">Accepts images, videos, or 3D models</span>
                    </label>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-base mb-1">Category</label>
                  <select className="w-full text-base bg-[#0A2540] text-white rounded-lg px-4 py-3">
                    <option>Choose the product category</option>
                  </select>
                </div>

                {/* Pricing */}
                <div className="bg-[#0A2540] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-1">Pricing</label>
                      <input type="text" className="w-full bg-[#103245] px-4 py-2 rounded text-white" placeholder="$ 0.00" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Compare at price</label>
                      <input type="text" className="w-full bg-[#103245] px-4 py-2 rounded text-white" placeholder="$ 0.00" />
                    </div>
                  </div>
                  <label className="block text-sm mb-1">Cost per item</label>
                  <div className="flex items-center gap-4">
                    <input type="text" className="w-1/3 bg-[#103245] px-4 py-2 rounded text-white" placeholder="$ 0.00" />
                    <input type="text" className="w-1/3 bg-[#103245] px-4 py-2 rounded text-white" placeholder="Profit" />
                    <input type="text" className="w-1/3 bg-[#103245] px-4 py-2 rounded text-white" placeholder="Margin" />
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
                    <input type="text" className="w-full bg-[#103245] px-4 py-2 rounded text-white" placeholder="e.g. 500g" />
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-base mb-1">Status</label>
                  <select className="w-full bg-[#0A2540] text-white rounded-lg px-4 py-3">
                    <option>Processing</option>
                    <option>Completed</option>
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-base mb-1">Stocks</label>
                  <select className="w-full bg-[#0A2540] text-white rounded-lg px-4 py-3">
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
 
  );
}
