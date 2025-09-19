"use client";

import Header from "../components/Header";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
// import { useState } from "react";
import ProtectRoute from "../components/ProtectRoute";
import { URL } from "@/utils//imageUrl";
import { Pencil } from "lucide-react";

import { useState } from "react";
import Link from "next/link";

export default function ProductionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [engineType, setEngineType] = useState("All");
  const [stock, setStock] = useState("All");
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);

  // Demo data for filtering
  const products = [
    {
      id: 1,
      make: "Ford",
      model: "Aspire",
      year: "2019",
      part: "Engine",
      specification:
        "4.9L | from 2/3/91 (AIR inner manifold) | E4OD transmission",
      amount: 500,
      status: "Instock",

      // image: "engine1.png",
    },
    {
      id: 2,

      make: "Ford",
      model: "Aspire",
      year: "2019",
      part: "Engine",
      specification:
        "4.9L | from 2/3/91 (AIR inner manifold) | E4OD transmission",
      amount: 500,
      status: "Instock",

      // image: "engine1.png",
    },
    {
      id: 3,
      make: "Ford",
      model: "Aspire",
      year: "2019",
      part: "Engine",
      specification:
        "4.9L | from 2/3/91 (AIR inner manifold) | E4OD transmission",
      amount: 500,
      status: "Instock",

      // image: "engine1.png",
    },
    {
      id: 4,
      make: "Ford",
      model: "Aspire",
      year: "2019",
      part: "Engine",
      specification:
        "4.9L | from 2/3/91 (AIR inner manifold) | E4OD transmission",
      amount: 500,
      status: "Outstock",

      // image: "engine1.png",
    },
    {
      id: 5,
      make: "Ford",
      model: "Aspire",
      year: "2019",
      part: "Trasmission",
      specification:
        "4.9L | from 2/3/91 (AIR inner manifold) | E4OD transmission",
      amount: 500,
      status: "Outstock",

      // image: "engine1.png",
    },
    {
      id: 6,
      make: "Ford",
      model: "Aspire",
      year: "2019",
      part: "Transmission",
      specification:
        "4.9L | from 2/3/91 (AIR inner manifold) | E4OD transmission",
      amount: 500,
      status: "Instock",

      // image: "engine1.png",
    },
  ];
  const startIndex = (currentPage - 1) * 50;
  const endIndex = startIndex + 50;
  const filtered = products.slice(startIndex, endIndex);

  const filteredProducts = filtered.filter((p) => {
    // Show all if default selected
    const engineMatch =
      engineType === "" || engineType === "All" || p.make === engineType;
    const stockMatch = stock === "" || stock === "All" || p.status === stock;
    const searchMatch = p.part.toLowerCase().includes(search.toLowerCase());
    return engineMatch && stockMatch && searchMatch;
  });

  // Handle delete product
  const handleDeleteProduct = async (productId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // Add your delete product API call here
      // await deleteProduct(productId);
      console.log("Deleting product:", productId);
      setOpenActionMenu(null);
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

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
          <main className="pt-[40px] min-h-screen px-4 md:px-8">
            {/* Filters Row */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-8">
              {/* Search Input: 368x73 base */}
              <div className="flex-1 min-w-[220px] sm:min-w-[300px]">
                <div className="relative h-[60px] mt-20 md:mt-0">
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
                    className="bg-[#091e36] rounded-lg pl-10 pr-4 w-full md:w-[50%] h-full text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Engines Dropdown: 248x73 */}
              <div className="flex-shrink-0 w-full sm:w-[200px] h-[60px] relative">
                <select
                  className="bg-[#091e36] appearance-none cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none"
                  value={engineType}
                  onChange={(e) => setEngineType(e.target.value)}
                >
                  <option>All</option>
                  <option>Engines</option>
                  <option>Transmission</option>
                  {/* <option>Brakes</option> */}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Stock Dropdown: 248x73 */}
              <div className="flex-shrink-0 w-full sm:w-[200px] h-[60px] relative">
                <select
                  className="bg-[#091e36] appearance-none cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none pr-10"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                >
                  <option>All</option>
                  <option>Instock</option>
                  <option>Outstock</option>
                </select>

                {/* Custom arrow on the right */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
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

            <h1 className="text-2xl font-audiowide font-bold mb-8">Products</h1>
            <div className="bg-[#091e36] rounded-xl overflow-hidden">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Table Header */}
                  <thead className="bg-[#0a1f3a]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        <input
                          type="checkbox"
                          className="rounded border-gray-600 bg-[#091e36] text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Make
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Model
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Year
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Part
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Specification
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-700">
                    {filteredProducts.map((product, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#0a1f3a] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-600 bg-[#091e36] text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {product.make}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {product.model}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {product.year}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {product.part}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {product.specification}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {product.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              product.status === "Outstock"
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 relative">
                          <button
                            className="text-white hover:text-blue-400"
                            onClick={() =>
                              setOpenActionMenu(
                                openActionMenu === idx ? null : idx
                              )
                            }
                            type="button"
                          >
                            <Pencil className="w-5 h-4 ml-3 cursor-pointer" />
                          </button>
                          {openActionMenu === idx && (
                            <div
                              className="absolute right-8 top-1 z-50 bg-gray-300 rounded-lg shadow-lg border-2 border-blue-300 min-w-[160px] p-2 flex flex-col animate-fadeIn"
                              style={{
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              }}
                            >
                              <Link
                                href={`/production/${product.id}`}
                                className="text-black text-base px-2 py-1 text-left rounded hover:bg-gray-200"
                                onClick={() => setOpenActionMenu(null)}
                                type="button"
                              >
                                Details
                              </Link>
                              <button
                                className="text-red-600 text-base px-2 py-1 text-left rounded hover:bg-red-100"
                                // onClick={() => handleDeleteProduct(product.id)}
                                type="button"
                              >
                                Update Product
                              </button>
                              <button
                                className="text-red-600 text-base px-2 py-1 text-left rounded hover:bg-red-100"
                                onClick={() => handleDeleteProduct(product.id)}
                                type="button"
                              >
                                Remove Product
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
