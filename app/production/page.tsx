"use client";

import Header from "../components/Header";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
// import { useState } from "react";
import ProtectRoute from "../components/ProtectRoute";
import { URL } from "@/utils//imageUrl";
import { Pencil } from "lucide-react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, Product } from "@/utils/productApi";

export default function ProductionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [engineType, setEngineType] = useState("All");
  const [stock, setStock] = useState("All");
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [part, setPart] = useState("");
  const [specification, setSpecification] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          make,
          model,
          year,
          part,
          search,
        };
        const response = await getAllProducts(currentPage, 50, filters);
        setProducts(response.products);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, make, model, year, part, search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [make, model, year, part, search]);

  // Fetch all unique values for dropdowns (unfiltered)
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAllForDropdowns = async () => {
      try {
        // Fetch first 1000 products to get unique values for dropdowns
        const response = await getAllProducts(1, 1000);
        setAllProducts(response.products);
      } catch (error) {
        console.error("Error fetching products for dropdowns:", error);
      }
    };
    fetchAllForDropdowns();
  }, []);

  // Get unique values for select options from all products
  const uniqueMakes = Array.from(
    new Set(allProducts.map((p) => p.make))
  ).sort();
  const uniqueModels = Array.from(
    new Set(allProducts.map((p) => p.model))
  ).sort();
  const uniqueYears = Array.from(new Set(allProducts.map((p) => p.year)))
    .sort()
    .reverse();
  const uniqueParts = Array.from(
    new Set(allProducts.map((p) => p.part))
  ).sort();

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
            <div className="flex flex-col md:flex-row items-start md:items-center gap-10 mb-8 mt-20 md:mt-0">
              {/* Left Side - Search Input */}
              <div className="w-full md:w-auto md:flex-shrink-0">
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
                    className="bg-[#091e36] rounded-lg pl-10 pr-4 w-full md:w-[300px] h-full text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Right Side - Grid of Selects */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Make Select */}
                  <div className="w-full h-[60px] relative">
                    <select
                      className="bg-[#091e36] appearance-none cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none pr-10"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                    >
                      <option>Select Make</option>
                      {uniqueMakes.map((makeName) => (
                        <option key={makeName} value={makeName}>
                          {makeName}
                        </option>
                      ))}
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

                  {/* Model Select */}
                  <div className="w-full h-[60px] relative">
                    <select
                      className="bg-[#091e36] appearance-none cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none pr-10"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    >
                      <option>Select Model</option>
                      {uniqueModels.map((modelName) => (
                        <option key={modelName} value={modelName}>
                          {modelName}
                        </option>
                      ))}
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

                  {/* Year Select */}
                  <div className="w-full h-[60px] relative">
                    <select
                      className="bg-[#091e36] appearance-none cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none pr-10"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option>Select Year</option>
                      {uniqueYears.map((yearValue) => (
                        <option key={yearValue} value={yearValue}>
                          {yearValue}
                        </option>
                      ))}
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

                  {/* Part Select */}
                  <div className="w-full h-[60px] relative">
                    <select
                      className="bg-[#091e36] appearance-none cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none pr-10"
                      value={part}
                      onChange={(e) => setPart(e.target.value)}
                    >
                      <option>Select Part</option>
                      {uniqueParts.map((partName) => (
                        <option key={partName} value={partName}>
                          {partName}
                        </option>
                      ))}
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

                  {/* Specification Select */}
                  {/* <div className="w-full h-[60px] relative">
                    <select
                      className="bg-[#091e36] appearance-none cursor-pointer rounded-lg px-4 py-2 w-full h-full text-white focus:outline-none pr-10"
                      value={specification}
                      onChange={(e) => setSpecification(e.target.value)}
                    >
                      <option>Select Specification</option>
                      <option>4.9L</option>
                      <option>5.0L</option>
                      <option>5.1L</option>
                      <option>5.2L</option>
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
                  </div> */}

                  {/* Add Button */}
                  <div className="w-full h-[60px]">
                    <Link href={"/production/add"}>
                      <button className="flex cursor-pointer items-center justify-center bg-[#091e36] rounded-lg w-full h-full text-white hover:bg-[#0a2644] transition-colors">
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
                      {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        ID
                      </th> */}
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
                      {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Status
                      </th> */}
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-700">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-white"
                        >
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                          </div>
                          <p className="mt-4">Loading products...</p>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-white"
                        >
                          No products found
                        </td>
                      </tr>
                    ) : (
                      products.map((product, idx) => (
                        <tr
                          key={product.id}
                          className="hover:bg-[#0a1f3a] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-600 bg-[#091e36] text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          {/* <td className="px-6 py-4 text-sm text-white">
                            {product.id}
                          </td> */}
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
                          {/* <td className="px-6 py-4 text-sm text-white">
                            {product.amount}
                          </td> */}
                          {/* <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                product.status === "Outstock"
                                  ? "bg-red-500 text-white"
                                  : "bg-green-500 text-white"
                              }`}
                            >
                              {product.status}
                            </span> */}
                          {/* </td> */}
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
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  type="button"
                                >
                                  Remove Product
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pb-6">
              {/* Your content here */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
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
