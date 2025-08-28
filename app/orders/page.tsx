"use client";
import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown, Pencil, Plus } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import ProtectRoute from "../components/ProtectRoute";
// import { redirect } from "next/navigation";
// import MainCalendar from "react-calendar";
import Link from "next/link";
import CalendarMain from "../components/Calendar";

// import { getSocket } from "../utils/socket";
import { getSocket } from "../../utils/socket";
// import Calendar from "react-calendar";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Order {
  id: string;
  name: string;
  orderDate: string;
  sum: string;
  email: string;
  mobile: string;
  status: string;
}

interface RawOrder {
  [x: string]: any;
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  customer: {
    full_name: string;
    email: string;
  };
  shippingSnapshot?: {
    phone?: string;
  };
  billingSnapshot?: {
    phone?: string;
  };
}

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [value, onChange] = useState<Value>(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  console.log(selectedDateRange.start, selectedDateRange.end, onChange);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthName = value instanceof Date ? monthNames[value.getMonth()] : null;
  const year = value instanceof Date ? value.getFullYear() : null;
  const date = value instanceof Date ? value.getDate() : null;

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`);
        if (response.ok) {
          const data = await response.json();
          const mappedOrders = data.map((order: RawOrder) => ({
            id: order.id,
            name: order.customer.full_name,
            orderDate: order.orderDate 
              ? new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' ')
              : new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' '),
            sum: `${order.totalAmount}`,
            email: order.customer.email,
            mobile: order.shippingSnapshot?.phone || order.billingSnapshot?.phone || '',
            status: order.status,
          }));
          setOrders(mappedOrders);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on('new_order', (data) => {
      const newOrder: Order = {
        id: data.order.id,
        // name: data.order.customer.full_name,
        name: data.order.customerName ,
        orderDate: data.order.orderDate,
        // ordate: new Date(data.order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' '),
        sum: `${data.order.total}`,
        email: data.order.customer_email,
        mobile: data.order.mobile,
        // sum: `${data.order.totalAmount}`,
        // email: data.order.customer.email,
        // mobile: data.order.shippingSnapshot?.phone || data.order.billingSnapshot?.phone || '',
        status: data.order.status,
      };
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    return () => {
      socket.off('new_order');
    };
  }, []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterPanelRef = useRef<HTMLDivElement | null>(null);

  // Add state for dropdown filters
  // const [dropdownStatus, setDropdownStatus] = useState<string | null>(null);
  const [dropdownQty, setDropdownQty] = useState<string | null>(null);
  // const [dropdownPart, setDropdownPart] = useState<string | null>(null);
  console.log(setDateRange, setDropdownQty);

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
          order.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status && status !== "Order Status") {
      filtered = filtered.filter((order) => order.status === status);
    }
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(
        (order) => order.orderDate >= dateRange.from && order.orderDate <= dateRange.to
      );
    }
    // Dropdown Status
    // if (dropdownStatus) {
    //   filtered = filtered.filter(
    //     (order) => order.status.toLowerCase() === dropdownStatus.toLowerCase()
    //   );
    // }
    // Dropdown Qty
    // Removed qty filter since qty field is not needed
    // Dropdown Part
    // if (dropdownPart) {
    // if (dropdownPart === "Engines") {
    //     filtered = filtered.filter((order) =>
    //     order.name.toLowerCase().includes("engine")
    //   );
    // } else if (dropdownPart === "Transmission") {
    //   filtered = filtered.filter((order) =>
    //     order.name.toLowerCase().includes("transmission")
    //   );
    // }
    // }
    const startIndex = (currentPage - 1) * 50;
    const endIndex = startIndex + 50;
    filtered = filtered.slice(startIndex, endIndex);
    setFilteredOrders(filtered);
  }, [
    search,
    status,
    dateRange,
    orders,
    // dropdownStatus,
    dropdownQty,
    currentPage,
    // dropdownPart,
  ]);

  // Handle date range change from calendar
  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setSelectedDateRange({ start: startDate, end: endDate });
    console.log(selectedDateRange);

    // Update the date range for filtering
    if (startDate && endDate) {
      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);
        return `${day}${month}${year}`;
      };

      setDateRange({
        from: formatDate(startDate),
        to: formatDate(endDate),
      });
      console.log(dateRange);
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
                  <option>Order Status</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Paid</option>
                  <option>Cancelled</option>
                  <option>Refunded</option>
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
              <div
                onClick={() => setOpen(!open)}
                className="calendar-trigger bg-[#091e36] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-secondary/90 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-lg p-2">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-white flex flex-row gap-2">
                    <p className="text-sm font-medium">Today</p>
                    <p className="text-sm opacity-80">
                      {monthName} {date} • {year}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </div>
              {open && (
                <CalendarMain
                  onClose={() => setOpen(false)}
                  onDateRangeChange={handleDateRangeChange}
                />
              )}
              {/* <div> */}
              {/* Date range selector placeholder */}
              {/* <div className="flex items-center bg-[#091e36] rounded-lg px-4 py-2 text-white w-full md:w-auto gap-2">
                  {/* <Calendar onChange={onChange} value={value} /> */}
              {/* <input
                    type="text"
                    placeholder="From (e.g. 22Jun25)"
                    className="bg-transparent border-b border-gray-500 px-2 py-2 w-24 text-xs"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                  /> */}
              {/* <span>-</span>
                  <input
                    type="text"
                    placeholder="To (e.g. 30Jun25)"
                    className="bg-transparent border-b border-gray-500 px-2 py-3 w-24 text-xs"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                  /> */}
              {/* </div> */}
              {/* </div> */}
            </div>
            <div className="bg-[#091e36] rounded-lg p-6 sm:p-6 lg:p-10 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-audiowide font-bold">Orders</h1>
                {/* <ChevronsLeftRight
                  onClick={() => handleExpand()}
                  className="hover:text-slate-300 cursor-pointer md:mr-10"
                /> */}
                <Link
                  href="/orders/new"
                  className="bg-secondary flex items-center gap-2 hover:bg-secondary/90 text-white px-8 py-4 rounded-lg hover:text-slate-300 cursor-pointer"
                >
                  Create Order
                  <Plus />
                </Link>
              </div>
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
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Mobile</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-100">
                    {filteredOrders.map((order, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-700 last:border-0 cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <input type="checkbox" />
                        </td>
                        <td className="px-4 py-6">{order.id}</td>
                        <td className="px-4 py-6">{order.name}</td>
                        <td className="px-4 py-6">{order.orderDate}</td>
                        <td className="px-4 py-6">{order.email}</td>
                        <td className="px-4 py-6">{order.mobile}</td>
                        <td className="px-4 py-6">{order.sum}</td>
                        <td className="px-4 py-6">
                          <span className="bg-[#8b88f9] px-5 py-2 rounded-full text-xs">
                            {String(order.status || '')}
                          </span>
                        </td>
                        {/* {order.status === "Processing" && (
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
                          {order.status === "Refunded" && (
                            <span className="bg-blue-600 text-white px-5 py-3 rounded-full text-xs">
                              Refunded
                            </span>
                          )}
                          {order.status === "Refunded" && (
                            <span className="bg-blue-600 text-white px-5 py-3 rounded-full text-xs">
                              Refunded
                            </span>
                          )} */}
                        
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
                              <Link
                                href={`/orders/${order.id}`}
                                className="text-black text-base px-2 py-1 text-left rounded hover:bg-gray-200"
                                onClick={() => setOpenActionMenu(null)}
                                type="button"
                              >
                                Details
                              </Link>
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
                                Remove Order
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
