"use client";
import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import ProtectRoute from "../components/ProtectRoute";
import Calendar from "react-calendar";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [value, onChange] = useState<Value>(new Date());
  // Order data
  const initialOrders = [
    {
      id: "022705",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Processing",
    },
    {
      id: "022731",
      name: "Trasmission",
      buyer: "Ramjas",
      date: "30Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Shipped",
    },
    {
      id: "022732",
      name: "Engine-DIESEL",
      buyer: "Mani",
      date: "22Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Paid",
    },
    {
      id: "022732",
      name: "Engine-DIESEL",
      buyer: "Mani",
      date: "22Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Cancelled",
    },
    {
      id: "022705",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Processing",
    },
    {
      id: "0227318",
      name: "Trasmission",
      buyer: "Ramjas",
      date: "30Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Shipped",
    },
    {
      id: "0227057",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Processing",
    },
    {
      id: "0227056",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Processing",
    },
    {
      id: "0227055",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Processing",
    },
    {
      id: "0227054",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 2,
      sum: "$1,200",
      status: "Processing",
    },
    {
      id: "0227053",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 2,
      sum: "$1,500",
      status: "Processing",
    },
    {
      id: "0227052",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 1,
      sum: "$1,200",
      status: "Processing",
    },
    {
      id: "0227051",
      name: "Engine-GASOLINE",
      buyer: "Shiva Kumar",
      date: "27Jun25",
      qty: 1,
      sum: "$1,300",
      status: "Processing",
    },
  ];

  // State for filters
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterPanelRef = useRef<HTMLDivElement | null>(null);

  // Add state for dropdown filters
  const [dropdownStatus, setDropdownStatus] = useState<string | null>(null);
  const [dropdownQty, setDropdownQty] = useState<string | null>(null);
  const [dropdownPart, setDropdownPart] = useState<string | null>(null);

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
    let filtered = [...orders];
    if (search.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.name.toLowerCase().includes(search.toLowerCase()) ||
          order.buyer.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status && status !== "Order Status") {
      filtered = filtered.filter((order) => order.status === status);
    }
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(
        (order) => order.date >= dateRange.from && order.date <= dateRange.to
      );
    }
    // Dropdown Status
    if (dropdownStatus) {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === dropdownStatus.toLowerCase()
      );
    }
    // Dropdown Qty
    if (dropdownQty) {
      if (dropdownQty === "1" || dropdownQty === "2") {
        filtered = filtered.filter(
          (order) => order.qty === Number(dropdownQty)
        );
      } else if (dropdownQty === "more than 2") {
        filtered = filtered.filter((order) => order.qty > 2);
      }
    }
    // Dropdown Part
    if (dropdownPart) {
      if (dropdownPart === "Engines") {
        filtered = filtered.filter((order) =>
          order.name.toLowerCase().includes("engine")
        );
      } else if (dropdownPart === "Transmission") {
        filtered = filtered.filter((order) =>
          order.name.toLowerCase().includes("transmission")
        );
      }
    }
    setFilteredOrders(filtered);
  }, [
    search,
    status,
    dateRange,
    orders,
    dropdownStatus,
    dropdownQty,
    dropdownPart,
  ]);

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
          <main className="pt-[20px] h-[calc(100vh-0px)] overflow-y-auto px-4 md:px-8">
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
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
                    className="bg-[#091e36] rounded-lg pl-10 pr-4 py-4 w-full text-white placeholder-gray-400 focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="bg-[#091e36] rounded-lg px-4 py-5 text-white focus:outline-none w-full md:w-auto"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Order Status</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Paid</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                {/* Date range selector placeholder */}
                <div className="flex items-center bg-[#091e36] rounded-lg px-4 py-2 text-white w-full md:w-auto gap-2">
                  <Calendar onChange={onChange} value={value} />
                  {/* <input
                    type="text"
                    placeholder="From (e.g. 22Jun25)"
                    className="bg-transparent border-b border-gray-500 px-2 py-2 w-24 text-xs"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                  />
                  <span>-</span>
                  <input
                    type="text"
                    placeholder="To (e.g. 30Jun25)"
                    className="bg-transparent border-b border-gray-500 px-2 py-3 w-24 text-xs"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                  /> */}
                </div>
              </div>
              <div className="relative">
                <button
                  ref={filterBtnRef}
                  className="flex items-center cursor-pointer bg-[#091e36] rounded-lg px-4 py-4 text-white w-full md:w-auto justify-center"
                  type="button"
                  onClick={() => setShowFilterModal((v) => !v)}
                >
                  Filter
                  <svg
                    className="ml-2"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16M6 8v8m12-8v8M8 16h8" />
                  </svg>
                </button>
                {/* Filter Dropdown Panel */}
                {showFilterModal && (
                  <div
                    ref={filterPanelRef}
                    className="absolute z-50 mt-2 right-2  w-80 max-w-full bg-[#0a1e36] rounded-xl shadow-lg p-0 animate-fadeIn"
                    style={{ minWidth: "340px" }}
                  >
                    <div className="px-6 py-4 rounded-b-xl">
                      {/* Status pills */}
                      <div className="mb-4">
                        <div className="text-lg font-bold mb-2">Status</div>
                        <div className="flex gap-3 mb-2">
                          {["Paid", "Pending", "Cancelled"].map((s) => (
                            <button
                              key={s}
                              className={`px-5 py-2 rounded-full cursor-pointer hover:bg-[#091627] font-semibold focus:outline-none shadow-md transition-colors ${
                                dropdownStatus === s
                                  ? "bg-[#091627] text-white"
                                  : "bg-transparent text-white"
                              }`}
                              onClick={() =>
                                setDropdownStatus(
                                  dropdownStatus === s ? null : s
                                )
                              }
                              type="button"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <hr className="border-blue-300/40" />
                      </div>
                      {/* Qty pills */}
                      <div className="mb-4">
                        <div className="text-lg font-bold mb-2">Qty</div>
                        <div className="flex gap-3 mb-2">
                          {["1", "2", "more than 2"].map((q) => (
                            <button
                              key={q}
                              className={`px-4 py-2 rounded-full cursor-pointer hover:bg-[#091627] font-semibold focus:outline-none shadow-md transition-colors ${
                                dropdownQty === q
                                  ? "bg-[#091627] text-white"
                                  : "bg-transparent text-white"
                              }`}
                              onClick={() =>
                                setDropdownQty(dropdownQty === q ? null : q)
                              }
                              type="button"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                        <hr className="border-blue-300/40" />
                      </div>
                      {/* Parts pills */}
                      <div className="mb-2">
                        <div className="text-lg font-bold mb-2">Parts</div>
                        <div className="flex gap-3 mb-2">
                          {["Engines", "Transmission"].map((p) => (
                            <button
                              key={p}
                              className={`px-6 py-2 cursor-pointer hover:bg-[#091627] rounded-full font-semibold focus:outline-none shadow-md transition-colors ${
                                dropdownPart === p
                                  ? "bg-[#091627] text-white"
                                  : "bg-transparent text-white"
                              }`}
                              onClick={() =>
                                setDropdownPart(dropdownPart === p ? null : p)
                              }
                              type="button"
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#091e36] rounded-lg p-6 sm:p-6 lg:p-10 mb-6">
              <h1 className="text-2xl font-bold mb-6">Orders</h1>
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
                      <th className="px-4 py-3 font-semibold">Buyer</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Qty</th>
                      <th className="px-4 py-3 font-semibold">Sum</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-100">
                    {filteredOrders.map((order, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-700 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <input type="checkbox" />
                        </td>
                        <td className="px-4 py-6">{order.id}</td>
                        <td className="px-4 py-6">{order.name}</td>
                        <td className="px-4 py-6">{order.buyer}</td>
                        <td className="px-4 py-6">{order.date}</td>
                        <td className="px-4 py-6">{order.qty}</td>
                        <td className="px-4 py-6">{order.sum}</td>
                        <td className="px-4 py-6">
                          {order.status === "Processing" && (
                            <span className="bg-[#8b88f9] text-white px-5 py-3 rounded-full text-xs">
                              Processing
                            </span>
                          )}
                          {order.status === "Shipped" && (
                            <span className="bg-[#f6c244] text-white px-5 py-3 rounded-full text-xs">
                              Shipped
                            </span>
                          )}
                          {order.status === "Paid" && (
                            <span className="bg-[#1ecb4f] text-white px-5 py-3 rounded-full text-xs">
                              Paid
                            </span>
                          )}
                          {order.status === "Cancelled" && (
                            <span className="bg-[#f64e4e] text-white px-5 py-3 rounded-full text-xs">
                              Cancelled
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
                              <button
                                className="text-black text-base px-2 py-1 text-left rounded hover:bg-gray-200"
                                onClick={() => setOpenActionMenu(null)}
                                type="button"
                              >
                                Details
                              </button>
                              <button
                                className="text-black text-base px-2 py-1 text-left rounded hover:bg-gray-200"
                                onClick={() => setOpenActionMenu(null)}
                                type="button"
                              >
                                Change Status
                              </button>
                              <button
                                className="text-red-600 text-base px-2 py-1 text-left rounded hover:bg-red-100"
                                onClick={() => setOpenActionMenu(null)}
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
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
