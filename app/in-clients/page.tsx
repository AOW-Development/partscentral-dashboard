"use client";
import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import ProtectRoute from "../components/ProtectRoute";
import Link from "next/link";

export default function Clients() {
  const [currentPage, setCurrentPage] = useState(1);
  // const [value, onChange] = useState<Value>(new Date());
  //i need dumy  customers data
  const initialClients = [
    {
      id: "12345",
      name: "Shiva",
      date: "2025-06-22",
      qty: 1,
      sum: "$500",
      payment: "MasterCard",
      status: "active",
    },
    {
      id: "23456",
      name: "Ramjas",
      date: "2025-07-01",
      qty: 2,
      sum: "$1000",
      payment: "Visa",
      status: "Inactive",
    },
    {
      id: "34567",
      name: "Mani",
      date: "2025-07-15",
      qty: 3,
      sum: "$1500",
      payment: "PayPal",
      status: "active",
    },
    {
      id: "45678",
      name: "Aditya",
      date: "2025-07-20",
      qty: 1,
      sum: "$500",
      payment: "MasterCard",
      status: "Inactive",
    },
    {
      id: "56789",
      name: "Priya",
      date: "2025-07-25",
      qty: 4,
      sum: "$2000",
      payment: "Visa",
      status: "active",
    },
    {
      id: "567801",
      name: "Abhi",
      date: "2025-07-25",
      qty: 4,
      sum: "$2000",
      payment: "Visa",
      status: "active",
    },
    {
      id: "56700",
      name: "Rahul",
      date: "2025-07-25",
      qty: 4,
      sum: "$2000",
      payment: "Visa",
      status: "active",
    },
  ];

  // State for filters
  const [clients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [filteredClients, setFilteredClients] = useState(initialClients);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterPanelRef = useRef<HTMLDivElement | null>(null);

  // State for action menu
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);

  // Close panel when clicking outside
  useEffect(() => {
    if (!showFilterModal) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(target) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(target)
      ) {
        setShowFilterModal(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showFilterModal]);

  // Close action menu on outside click
  useEffect(() => {
    if (openActionMenu === null) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      // If the click is not on a menu or pencil button, close
      if (
        !(target as HTMLElement).closest(".order-action-menu") &&
        !(target as HTMLElement).closest(".order-action-pen")
      ) {
        setOpenActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openActionMenu]);

  // Filtering logic (now in useEffect)
  useEffect(() => {
    let filtered = [...clients];
    if (search.trim()) {
      filtered = filtered.filter(
        (client) =>
          client.id.toLowerCase().includes(search.toLowerCase()) ||
          client.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Dropdown Status
    if (status) {
      filtered = filtered.filter(
        (client) => client.status.toLowerCase() === status.toLowerCase()
      );
    }
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    filtered = filtered.slice(startIndex, endIndex);
    setFilteredClients(filtered);
  }, [search, status, currentPage, clients]);

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
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative mt-20 md:mt-0">
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
                    className="bg-[#091e36] rounded-lg  pl-10 pr-4 py-4  w-full md:w-[50%] text-white placeholder-gray-400 focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative w-full md:w-auto">
                <select
                  className="appearance-none bg-[#091e36] rounded-lg px-4 py-4 text-white focus:outline-none w-full md:w-auto pr-10"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Status</option>
                  <option>Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                {/* Right-aligned custom arrow, after the text */}
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
            </div>
            <div className="bg-[#091e36] rounded-lg p-6 sm:p-6 lg:p-10 mb-6">
              <h1 className="text-2xl font-audiowide font-bold mb-6">
                Clients
              </h1>
              {/* <p className="text-gray-400 mb-6">This is the orders page.</p> */}

              <div className="overflow-x-auto rounded-lg shadow-lg ">
                <table className="min-w-full text-lg text-left">
                  <thead className=" text-gray-300">
                    <tr>
                      <th className="px-4 py-6 font-semibold">
                        <input type="checkbox" />
                      </th>
                      <th className="px-4 py-3 font-semibold">ID</th>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Qty</th>
                      <th className="px-4 py-3 font-semibold">Sum</th>
                      <th className="px-4 py-3 font-semibold">
                        Payment System
                      </th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-100">
                    {filteredClients.map((client, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-700 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <input type="checkbox" />
                        </td>
                        <td className="px-4 py-6">{client.id}</td>
                        <td className="px-4 py-6">{client.name}</td>
                        <td className="px-4 py-6">{client.date}</td>
                        <td className="px-4 py-6">{client.qty}</td>
                        <td className="px-4 py-6">{client.sum}</td>
                        <td className="px-4 py-6">{client.payment}</td>
                        <td className="px-4 py-6">
                          {client.status === "active" && (
                            <span className="bg-[#f6c244] text-white px-5 py-3 rounded-full text-xs">
                              Active
                            </span>
                          )}

                          {client.status === "Inactive" && (
                            <span className="bg-[#f64e4e] text-white px-5 py-3 rounded-full text-xs">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 relative">
                          <button
                            className="text-white hover:text-blue-400 order-action-pen"
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
                              className="order-action-menu absolute right-8 top-1 z-50 bg-gray-300 rounded-lg shadow-lg border-2 border-blue-300 min-w-[160px] p-2 flex flex-col animate-fadeIn"
                              style={{
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              }}
                            >
                              <Link href={`/in-clients/${client.id}`}>
                                <button
                                  className="text-black text-base px-2 py-1 text-left rounded hover:bg-gray-200 w-full cursor-pointer"
                                  onClick={() => setOpenActionMenu(null)}
                                  type="button"
                                >
                                  Details
                                </button>
                              </Link>

                              <button
                                className="text-red-600 text-base px-2 py-1 text-left rounded hover:bg-red-100 cursor-pointer"
                                onClick={() => setOpenActionMenu(null)}
                                type="button"
                              >
                                Remove Client
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
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
