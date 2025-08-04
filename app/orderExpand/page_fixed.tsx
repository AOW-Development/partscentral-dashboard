"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronsLeftRight } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import { redirect } from "next/navigation";

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dropdownStatus, setDropdownStatus] = useState<string | null>(null);
  const [dropdownPart, setDropdownPart] = useState<string | null>(null);

  const filterBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterPanelRef = useRef<HTMLDivElement | null>(null);

  // Complete dummy data with all required fields
  const tableData = [
    {
      id: "022705",
      lead: "John Doe",
      name: "Shiva Kumar",
      email: "shiva@gmail.com",
      mobile: "8877665544",
      cardNumber: "xxxx-xxxx-xxxx-1234",
      expiryDate: "12/25",
      cvv: "123",
      billingAddress: "123 Main St, Anytown, USA",
      shippingAddress: "456 Oak Ave, Somewhere, USA",
      part: "Engine Assembly V6",
      yardInfo: "Yard A - Section 1",
      poStatus: "Approved",
      approvalCode: "AC123456",
      chargedAsOn: "27Jun25",
      entity: "PartsCenter LLC",
      charged: "$1,200",
      invoiceStatus: "Paid",
      costPrice: "$800",
      ownShippingYardShipping: "Yard Shipping",
      shippingVariance: "$25",
      core: "$150",
      taxExtraCharge: "$96",
      returnShippingCostCustoms: "$0",
      replacementCostPrice: "$0",
      replacementShipping: "$0",
      partialRefunds: "$0",
      totalBuy: "$1,071",
      sellingPrice: "$1,200",
      processingFee: "$15",
      depositFee: "$50",
      gp: "$129",
      saleMadeBy: "Alice Johnson",
      dateOfSale: "27Jun25",
      warranty: "2 Year Limited",
      invoiceMadeBy: "Bob Smith",
      orderStatus: "Processing",
    },
    {
      id: "022706",
      lead: "Jane Smith",
      name: "Priya Sharma",
      email: "priya@gmail.com",
      mobile: "9988776655",
      cardNumber: "xxxx-xxxx-xxxx-5678",
      expiryDate: "03/26",
      cvv: "456",
      billingAddress: "789 Pine St, Elsewhere, USA",
      shippingAddress: "321 Elm Dr, Nowhere, USA",
      part: "Transmission Auto 4WD",
      yardInfo: "Yard B - Section 2",
      poStatus: "Pending",
      approvalCode: "AC789012",
      chargedAsOn: "28Jun25",
      entity: "Auto Parts Inc",
      charged: "$800",
      invoiceStatus: "Pending",
      costPrice: "$550",
      ownShippingYardShipping: "Own Shipping",
      shippingVariance: "$0",
      core: "$100",
      taxExtraCharge: "$64",
      returnShippingCostCustoms: "$0",
      replacementCostPrice: "$0",
      replacementShipping: "$0",
      partialRefunds: "$0",
      totalBuy: "$714",
      sellingPrice: "$800",
      processingFee: "$12",
      depositFee: "$40",
      gp: "$86",
      saleMadeBy: "Carol Davis",
      dateOfSale: "28Jun25",
      warranty: "1 Year Standard",
      invoiceMadeBy: "David Wilson",
      orderStatus: "Shipped",
    },
    {
      id: "022707",
      lead: "Mike Johnson",
      name: "Amit Patel",
      email: "amit@gmail.com",
      mobile: "8877661122",
      cardNumber: "xxxx-xxxx-xxxx-9012",
      expiryDate: "08/27",
      cvv: "789",
      billingAddress: "456 Cedar Ln, Anyplace, USA",
      shippingAddress: "987 Birch St, Everywhere, USA",
      part: "Brake System Complete",
      yardInfo: "Yard C - Section 3",
      poStatus: "Completed",
      approvalCode: "AC345678",
      chargedAsOn: "29Jun25",
      entity: "Brake Masters Ltd",
      charged: "$450",
      invoiceStatus: "Paid",
      costPrice: "$300",
      ownShippingYardShipping: "Yard Shipping",
      shippingVariance: "$15",
      core: "$75",
      taxExtraCharge: "$36",
      returnShippingCostCustoms: "$0",
      replacementCostPrice: "$0",
      replacementShipping: "$0",
      partialRefunds: "$0",
      totalBuy: "$426",
      sellingPrice: "$450",
      processingFee: "$8",
      depositFee: "$25",
      gp: "$24",
      saleMadeBy: "Eve Martinez",
      dateOfSale: "29Jun25",
      warranty: "6 Month Basic",
      invoiceMadeBy: "Frank Brown",
      orderStatus: "Delivered",
    },
  ];

  const tableHeaders = [
    "ID",
    "Lead",
    "Name",
    "Email",
    "Mobile",
    "Card Number",
    "Expiry Date",
    "CVV",
    "Billing Address",
    "Shipping Address",
    "Part",
    "Yard Info",
    "PO Status",
    "Approval Code",
    "Charged As On",
    "Entity",
    "Charged",
    "Invoice Status",
    "Cost Price",
    "Own Shipping/Yard Shipping",
    "Shipping Variance",
    "Core",
    "Tax/Extra Charge",
    "Return Shipping Cost/Customs",
    "Replacement Cost Price",
    "Replacement Shipping",
    "Partial Refunds",
    "Total Buy",
    "Selling Price",
    "Processing Fee",
    "Deposit Fee",
    "GP",
    "Sale Made By",
    "Date of Sale",
    "Warranty",
    "Invoice Made By",
    "Order Status",
  ];

  const handleExpand = () => {
    console.log("Expand/Collapse clicked");
    redirect("/orders");
  };

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

  return (
    <div className="min-h-screen bg-main text-white font-exo">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
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
                  className="bg-[#091e36] rounded-lg pl-10 pr-4 py-4 w-full md:w-[50%] text-white placeholder-gray-400 focus:outline-none"
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
              {showFilterModal && (
                <div
                  ref={filterPanelRef}
                  className="absolute z-50 mt-2 right-2 w-80 max-w-full bg-[#0a1e36] rounded-xl shadow-lg p-0"
                  style={{ minWidth: "400px" }}
                >
                  <div className="px-6 py-4 rounded-b-xl">
                    <div className="mb-4">
                      <div className="text-lg font-bold mb-2">Status</div>
                      <div className="flex gap-1 mb-2">
                        {["Paid", "Pending", "Cancelled", "Refunded"].map(
                          (s) => (
                            <button
                              key={s}
                              className={`px-3 py-2 rounded-full cursor-pointer hover:bg-[#091627] font-semibold focus:outline-none shadow-md transition-colors ${
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
                          )
                        )}
                      </div>
                      <hr className="border-blue-300/40" />
                    </div>
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-audiowide font-bold">Orders</h1>
              <ChevronsLeftRight
                onClick={() => handleExpand()}
                className="hover:text-slate-300 cursor-pointer md:mr-10"
              />
            </div>

            <div className="overflow-x-auto rounded-sm shadow-lg">
              <table className="min-w-full text-sm text-left border-2 border-gray-600">
                <thead className="text-gray-100 bg-[#0a1e36]">
                  <tr className="border-2">
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="border border-gray-600 px-2 py-2 font-bold whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-100">
                  {tableData.map((data, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-600 hover:bg-[#0a1e36]/50"
                    >
                      <td className="border border-gray-600 px-2 py-2">
                        {data.id}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.lead}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.name}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.email}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.mobile}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.cardNumber}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.expiryDate}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.cvv}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.billingAddress}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.shippingAddress}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.part}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.yardInfo}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.poStatus}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.approvalCode}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.chargedAsOn}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.entity}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.charged}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.invoiceStatus}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.costPrice}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.ownShippingYardShipping}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.shippingVariance}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.core}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.taxExtraCharge}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.returnShippingCostCustoms}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.replacementCostPrice}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.replacementShipping}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.partialRefunds}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.totalBuy}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.sellingPrice}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.processingFee}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.depositFee}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.gp}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.saleMadeBy}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.dateOfSale}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.warranty}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.invoiceMadeBy}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {data.orderStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
