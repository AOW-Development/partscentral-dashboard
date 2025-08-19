"use client";
import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import ProtectRoute from "../components/ProtectRoute";

export default function Leads() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // const [value, onChange] = useState<Value>(new Date());
  // Dummy customers data
  const initialClients = [
    {
      id: "CL-001",
      name: "John Doe",
      phone: "(555) 123-4567",
      productInterest: "Engine",
      source: "Google",
      assignedBy: "Shiva",
      // email: "john.doe@example.com",
      status: "Contacted",
      priority: "High",
      // lastContact: "2025-08-15",
    },
    {
      id: "CL-002",
      name: "Jane Smith",
      phone: "(555) 234-5678",
      productInterest: "Engine",
      source: "Website",
      assignedBy: "Shiva",
      // email: "jane.smith@example.com",
      status: "New",
      priority: "High",
      // lastContact: "2025-08-14",
    },
    {
      id: "CL-003",
      name: "Robert Johnson",
      phone: "(555) 345-6789",
      productInterest: "Engine",
      source: "Google",
      assignedBy: "Shiva",
      // email: "robert.j@example.com",
      status: "Qualified",
      priority: "High",
      // lastContact: "2025-08-10",
    },
    {
      id: "CL-004",
      name: "Emily Davis",
      phone: "(555) 456-7890",
      productInterest: "Engine",
      source: "Meta",
      assignedBy: "Shiva",
      // email: "emily.d@example.com",
      status: "Follow-Up",
      priority: "High",
      // lastContact: "2025-08-12",
    },
    {
      id: "CL-005",
      name: "Michael Brown",
      phone: "(555) 567-8901",
      productInterest: "Engine",
      source: "Website",
      assignedBy: "Shiva",
      // email: "michael.b@example.com",
      status: "Quoted",
      priority: "High",
      // lastContact: "2025-08-05",
    },
    {
      id: "CL-006",
      name: "Sarah Wilson",
      phone: "(555) 678-9012",
      productInterest: "Engine",
      source: "Google",
      assignedBy: "Shiva",
      // email: "sarah.w@example.com",
      status: "Contacted",
      priority: "Low",
      // lastContact: "2025-08-16",
    },
    {
      id: "CL-007",
      name: "David Taylor",
      phone: "(555) 789-0123",
      productInterest: "Engine",
      source: "Google",
      assignedBy: "Shiva",
      // email: "david.t@example.com",
      status: "New",
      priority: "Low",
      // lastContact: "2025-08-14",
    },
    {
      id: "CL-008",
      name: "Jennifer Anderson",
      phone: "(555) 890-1234",
      productInterest: "Engine",
      source: "Website",
      assignedBy: "Shiva",
      // email: "jennifer.a@example.com",
      status: "Contacted",
      priority: "Medium",
      // lastContact: "2025-08-08",
    },
    {
      id: "CL-009",
      name: "William Thomas",
      phone: "(555) 901-2345",
      productInterest: "Engine",
      source: "Meta",
      assignedBy: "Shiva",
      // email: "william.t@example.com",
      status: "Quoted",
      priority: "Medium",
      // lastContact: "2025-08-13",
    },
    {
      id: "CL-010",
      name: "Jessica Jackson",
      phone: "(555) 012-3456",
      productInterest: "Engine",
      source: "Website",
      assignedBy: "Shiva",
      // email: "jessica.j@example.com",
      status: "Qualified",
      priority: "Low",
      // lastContact: "2025-08-15",
    },
  ];

  // State for filters and UI
  const [clients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [filteredClients, setFilteredClients] = useState(initialClients);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const filterBtnRef = useRef<HTMLButtonElement | null>(null);
  const filterPanelRef = useRef<HTMLDivElement | null>(null);

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
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // If the click is not on an action button, close any open menus
      if (!target.closest(".action-button") && openActionMenu) {
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
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.phone.includes(search)
        // client.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Dropdown Status
    if (status) {
      filtered = filtered.filter(
        (client) => client.status.toLowerCase() === status.toLowerCase()
      );
    }
    const startIndex = (currentPage - 1) * 50;
    const endIndex = startIndex + 50;
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
          <main className="pt-[100px] md:pt-[40px] min-h-screen px-4 md:px-8">
            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row gap-3 mb-8 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
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
                    placeholder="Search clients..."
                    className="bg-[#091e36] rounded-lg pl-10 pr-4 py-2.5 w-full text-white placeholder-gray-400 focus:outline-none border border-gray-600 focus:border-blue-500 transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative w-full lg:w-40">
                <select
                  className="appearance-none bg-[#091e36] rounded-lg px-4 py-2.5 text-white focus:outline-none w-full border border-gray-600 focus:border-blue-500 transition-colors"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Filter</option>
                  <option value="source">Source</option>
                  <option value="assignedBy">Assigned By</option>
                  <option value="active">Active</option>

                  <option value="inactive">Inactive</option>
                  <option value="priority">Priority</option>
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

              {/* Bulk Actions Dropdown */}
              <div className="relative w-full lg:w-48">
                <select
                  className="appearance-none bg-[#091e36] rounded-lg px-4 py-2.5 text-white focus:outline-none w-full border border-gray-600 focus:border-blue-500 transition-colors"
                  disabled={!selectedItems.length}
                >
                  <option value="">
                    Bulk Actions ({selectedItems.length})
                  </option>
                  <option value="export">Export Selected</option>
                  <option value="delete">Delete Selected</option>
                  <option value="status">Update Status</option>
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

              {/* Add Lead Button */}
              <button
                onClick={() => {
                  // Add your add lead logic here
                  console.log("Add new lead clicked");
                }}
                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Lead
              </button>
            </div>
            <div className="bg-[#091e36] rounded-lg p-6 sm:p-6 lg:p-10 mb-6">
              <h1 className="text-2xl font-audiowide font-bold mb-6">Leads</h1>
              {/* <p className="text-gray-400 mb-6">This is the orders page.</p> */}

              <div className="overflow-x-auto rounded-lg shadow-lg ">
                <table className="min-w-full text-lg text-left">
                  <thead className=" text-gray-300">
                    <tr>
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <input
                          type="checkbox"
                          className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                          checked={
                            selectedItems.length > 0 &&
                            selectedItems.length === filteredClients.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(
                                filteredClients.map((client) => client.id)
                              );
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Lead ID
                        </div>
                      </th>
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Lead Name
                        </div>
                      </th>
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Mobile
                        </div>
                      </th>
                      {/* <th className="px-6 py-4 font-semibold text-sm text-gray-400">
                        Email
                      </th> */}
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Product Interest
                        </div>
                      </th>
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Source
                        </div>
                      </th>
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Assigned By
                        </div>
                      </th>
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Status
                        </div>
                      </th>
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Priority
                        </div>
                      </th>
                      {/* <th className="px-6 py-4 font-semibold text-sm text-gray-400">
                        Last Contact
                      </th> */}
                      <th className="px-4 py-4 font-semibold text-sm text-gray-400">
                        <div className="flex justify-center space-x-2">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-800/50">
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex justify-center space-x-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                              checked={selectedItems.includes(client.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([
                                    ...selectedItems,
                                    client.id,
                                  ]);
                                } else {
                                  setSelectedItems(
                                    selectedItems.filter(
                                      (id) => id !== client.id
                                    )
                                  );
                                }
                              }}
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                          <div className="flex justify-center space-x-2">
                            {client.id}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-300">
                          <div className="flex justify-center space-x-2">
                            {client.name}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                          <div className="flex justify-center space-x-2">
                            {client.phone || "N/A"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                          <div className="flex justify-center space-x-2">
                            {client.productInterest || "N/A"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                          <div className="flex justify-center space-x-2">
                            {client.source || "N/A"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                          <div className="flex justify-center space-x-2">
                            {client.assignedBy || "N/A"}
                          </div>
                        </td>
                        <td
                          className={`whitespace-nowrap text-sm text-gray-300 ${
                            client.status === "New" &&
                            "bg-[#046AA6] text-white flex items-center rounded-full justify-center px-2 py-1 mt-4"
                          } ${
                            client.status === "Contacted" &&
                            "bg-[#046AA6]/60 text-white flex items-center rounded-full justify-center px-2 py-1 mt-4"
                          }
                          ${
                            client.status === "Qualified" &&
                            "bg-[#2DA527] text-white flex items-center rounded-full justify-center px-2 py-1 mt-4"
                          }
                           ${
                             client.status === "Follow-Up" &&
                             "bg-[#BE0000] text-white flex items-center rounded-full justify-center px-2 py-1 mt-4"
                           }
                           ${
                             client.status === "Quoted" &&
                             "bg-[#046AA6] text-white flex items-center rounded-full justify-center px-2 py-1 mt-4"
                           }
                          `}
                        >
                          {client.status || "N/A"}
                        </td>
                        <td className=" whitespace-nowrap justify-center px-4 py-4 gap-0.5 text-sm text-gray-300">
                          <div className="flex justify-center space-x-2">
                            <div
                              className={`inline-flex mx-1 mt-1  w-2 h-2  rounded-full bg-${
                                client.priority === "High"
                                  ? "red-500"
                                  : client.priority === "Medium"
                                  ? "blue-500"
                                  : "green-500"
                              }`}
                            ></div>
                            {client.priority || "N/A"}
                          </div>
                        </td>

                        {/* <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                          {client.email || "N/A"}
                        </td> */}
                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium relative">
                          <div className="flex justify-center space-x-2">
                            <button
                              type="button"
                              className="text-blue-500 hover:text-blue-700 action-button"
                              onClick={() =>
                                setOpenActionMenu(
                                  openActionMenu === client.id
                                    ? null
                                    : client.id
                                )
                              }
                            >
                              •••
                            </button>
                            {openActionMenu === client.id && (
                              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <button
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    console.log("Edit client:", client.id);
                                    setOpenActionMenu(null);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                  onClick={() => {
                                    console.log("Delete client:", client.id);
                                    setOpenActionMenu(null);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
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
                totalPages={Math.ceil(clients.length / 10)}
                onPageChange={setCurrentPage}
              />
            </div>
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
