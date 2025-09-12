import React, { useState, useEffect } from "react";
import { ChevronDown, Minus } from "lucide-react";
import MoveYardPopUp from "./MoveYardPopUp";
import axios from "axios";

interface PreviousYard {
  yardName: string;
  attnName: string;
  yardAddress: string;
  yardMobile: string;
  yardEmail: string;
  yardPrice: string | number;
  yardWarranty: string;
  yardMiles: string | number;
  yardShipping: string;
  yardCost: string | number;
  reason?: string;
}

interface FormData {
  yardName: string; 
  attnName: string;
  yardAddress: string;
  yardMobile: string;
  yardEmail: string;
  yardPrice: string | number;
  yardWarranty: string;
  yardMiles: string | number;
  yardShipping: string;
  yardCost: string | number;
  reason?: string;
}

interface YardInfoProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  showYardShippingCost: boolean;
  previousYards: PreviousYard[];
  showPreviousYard: boolean;
  setShowPreviousYard: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPrevYardIdx: number;
  setSelectedPrevYardIdx: React.Dispatch<React.SetStateAction<number>>;
  setStatusPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  statusPopUp: boolean;
  orderId: string;
  onYardMoved: (reason: string) => void;
}

const YardInfo: React.FC<YardInfoProps> = ({
  formData,
  handleInputChange,
  showYardShippingCost,
  previousYards,
  showPreviousYard,
  setShowPreviousYard,
  selectedPrevYardIdx,
  setSelectedPrevYardIdx,
  setStatusPopUp,
  statusPopUp,
  orderId,
  onYardMoved,
}) => {
  const [reason, setReason] = useState("");
  const [submitReason, setSubmitReason] = useState(false);

  useEffect(() => {
    if (submitReason && reason.trim()) {
      const moveYardToHistory = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
          const response = await axios.post(
            `${API_URL}/yards/move-to-history/${orderId}`,
            { reason: reason.trim() }
          );
          console.log("Successfully moved yard to history:", response.data);

          // Notify parent component that yard has been moved
          onYardMoved(reason.trim());
        } catch (error) {
          console.error("Error moving yard to history:", error);
        } finally {
          // Reset state
          setReason("");
          setSubmitReason(false);
        }
      };

      moveYardToHistory();
    }
  }, [submitReason, reason, orderId, onYardMoved]);

  return (
    <div className=" relative p-2 mt-6">
      {statusPopUp && (
        <MoveYardPopUp
          setStatus={setStatusPopUp}
          setReason={setReason}
          setSubmitReason={setSubmitReason}
        />
      )}
      <div className="relative flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-semibold">Yard Info</h3>

        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={() => setShowPreviousYard((prev) => !prev)}
        >
          {showPreviousYard ? "Hide Previous Yard" : "Show Previous Yard"}
        </button>
      </div>
      {showPreviousYard && previousYards.length > 0 && (
        <div className="mb-6 bg-[#222c3a] rounded-lg p-4 border border-blue-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">
              Previous Yard Details
            </span>
            {previousYards.length > 0 && (
              <select
                className="bg-[#0a1929] border border-gray-600 rounded px-2 py-1 text-white text-xs"
                value={selectedPrevYardIdx}
                onChange={(e) => setSelectedPrevYardIdx(Number(e.target.value))}
              >
                {previousYards.map((_, idx) => (
                  <option key={idx} value={idx}>
                    Yard #{idx + 1}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className=" grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Yard Name
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardName || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Attn. Name
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.attnName || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardAddress || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Mobile</label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardMobile || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Email</label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardEmail || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Price</label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardPrice || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Warranty
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardWarranty || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Miles</label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardMiles || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Shipping
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardShipping || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Yard Cost / Own Shipping Info
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardCost || ""}
                disabled
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-white/60 text-xs mb-1">Reason</label>
              <textarea
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.reason || ""}
                disabled
              />
            </div>
          </div>
        </div>
      )}
      <h3 className="text-white text-lg font-semibold mb-4">
        Current Yard Info
      </h3>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FFFFFF33] rounded-lg p-2">
        <button
          className="absolute right-0 top-0 z-5 hover:bg-red-600 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
          onClick={() => {
            setStatusPopUp(!statusPopUp);
          }}
        >
          <Minus size={18} />
        </button>
        {/* Name */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Yard Name</label>
          <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter name"
            value={formData.yardName}
            onChange={(e) => handleInputChange("yardName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-2">Attn. Name</label>
          <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter name"
            value={formData.attnName}
            onChange={(e) => handleInputChange("attnName", e.target.value)}
          />
        </div>
        {/* Address */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Address</label>
          <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter address"
            value={formData.yardAddress}
            onChange={(e) => handleInputChange("yardAddress", e.target.value)}
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Mobile</label>
          <input
            type="tel"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter mobile number"
            value={formData.yardMobile}
            onChange={(e) => handleInputChange("yardMobile", e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Email</label>
          <input
            type="email"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter email"
            value={formData.yardEmail}
            onChange={(e) => handleInputChange("yardEmail", e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Price</label>
          <input
            type="number"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter price"
            value={formData.yardPrice}
            onChange={(e) => handleInputChange("yardPrice", e.target.value)}
               onBlur={(e) => {
                            const rawValue = e.target.value || "0"; // always string
                            const value = parseFloat(rawValue).toFixed(2); // value is string
                            handleInputChange("yardPrice", value);
                          }}
          />
        </div>

        {/* Warranty */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Warranty</label>
          <div className="relative">
            <select
              className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
              value={formData.yardWarranty}
              onChange={(e) =>
                handleInputChange("yardWarranty", e.target.value)
              }
            >
              <option value="">Select warranty</option>
              <option>30 Days</option>
              <option>60 Days</option>
              <option>90 Days</option>
              <option>6 Months</option>
              <option>1 Year</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
              size={16}
            />
          </div>
        </div>

        {/* Miles */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Miles</label>
          <input
            type="number"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter miles"
            value={formData.yardMiles}
            onChange={(e) => handleInputChange("yardMiles", e.target.value)}
          />
        </div>

        {/* Shipping */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Shipping</label>
          <div className="relative">
            <select
              className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
              value={formData.yardShipping}
              onChange={(e) => {
                handleInputChange("yardShipping", e.target.value);
              }}
            >
              <option value="">Select shipping option</option>
              <option value="Own Shipping">Own Shipping</option>
              <option value="Yard Shipping">Yard Shipping</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
              size={16}
            />
          </div>
        </div>
        {showYardShippingCost && (
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Yard Shipping Cost
            </label>
            <input
              type="number"
              className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="Enter yard cost"
              value={formData.yardCost}
              onChange={(e) => handleInputChange("yardCost", e.target.value)}
                 onBlur={(e) => {
                            const rawValue = e.target.value || "0"; // always string
                            const value = parseFloat(rawValue).toFixed(2); // value is string
                            handleInputChange("yardCost", value);
                          }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default YardInfo;
