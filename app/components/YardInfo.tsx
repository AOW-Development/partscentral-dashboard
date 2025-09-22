import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Minus, Plus } from "lucide-react";
import MoveYardPopUp from "./MoveYardPopUp";
import axios from "axios";

interface PreviousYard {
  yardName: string;
  attnName: string;
  yardAddress: string;
  yardMobile: string;
  yardEmail: string;
  yardPrice: string;
  taxesYardPrice?: string | number;
  handlingYardPrice?: string | number;
  processingYardPrice?: string | number;
  coreYardPrice?: string | number;
  yardWarranty: string;
  yardMiles: string | number;
  yardShipping: string;
  yardCost: string | number;
  reason?: string;
  yardCharge?: string;
  yardChangedAmount?: string | number;
}

interface FormData {
  yardName: string;
  attnName: string;
  yardAddress: string;
  yardMobile: string;
  yardEmail: string;
  yardPrice: string | number;
  taxesYardPrice?: string | number;
  handlingYardPrice?: string | number;
  processingYardPrice?: string | number;
  coreYardPrice?: string | number;
  yardWarranty: string;
  yardMiles: string | number;
  yardShipping: string;
  yardCost: string | number;
  yardtotalBuy: string | number;
  reason?: string;
  yardCharge?: string;
  yardChangedAmount?: string | number;
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
  onYardMoved: (reason: string, yardCharge: string) => void;
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
  const [yardCharge, setYardCharge] = useState("");
  const [submitReason, setSubmitReason] = useState(false);
  const [showYardPriceOptions, setShowYardPriceOptions] = useState(false);
  const [yardChangedAmount, setYardChangedAmount] = useState("");
  const [visiblePriceFields, setVisiblePriceFields] = useState({
    taxesPrice: false,
    handlingPrice: false,
    processingPrice: false,
    corePrice: false,
  });
  const yardPriceOptionsRef = useRef<HTMLDivElement>(null);

  const [fieldErrors] = useState<{ [key: string]: boolean }>({});
  // Handle price field selection
  const handlePriceFieldSelection = (
    fieldName: keyof typeof visiblePriceFields
  ) => {
    setVisiblePriceFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
    setShowYardPriceOptions(false);
  };

  // helper
  const handlePriceBlur = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    if (value === "" || isNaN(Number(value))) {
      handleInputChange(field, "");
      return;
    }
    const formatted = parseFloat(value.toString()).toFixed(2);
    handleInputChange(field, formatted); // must store string, not number
  };

  // const handleInputChange = (field: string, value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));

  //   // Clear field error when user starts typing
  //   if (fieldErrors[field]) {
  //     setFieldErrors((prev) => ({
  //       ...prev,
  //       [field]: "",
  //     }));
  //   }
  // };

  useEffect(() => {
    if (submitReason && reason.trim() && yardCharge.trim()) {
      const moveYardToHistory = async () => {
        try {
          const API_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
          const response = await axios.post(
            `${API_URL}/yards/move-to-history/${orderId}`,
            { reason: reason.trim(), yardCharge: yardCharge.trim() }
          );
          console.log("Successfully moved yard to history:", response.data);

          // Notify parent component that yard has been moved
          onYardMoved(reason.trim(), yardCharge.trim());
        } catch (error) {
          console.error("Error moving yard to history:", error);
        } finally {
          // Reset state
          setReason("");
          setYardCharge("");
          setSubmitReason(false);
        }
      };

      moveYardToHistory();
    }
  }, [submitReason, reason, orderId, onYardMoved, yardCharge]);

  return (
    <div className="relative p-2 mt-6">
      {statusPopUp && (
        <MoveYardPopUp
          setStatus={setStatusPopUp}
          setReason={setReason}
          setYardCharge={setYardCharge}
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
                Taxes Price
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.taxesYardPrice || ""}
                disabled
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1">
                Handling Price
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={
                  previousYards[selectedPrevYardIdx]?.handlingYardPrice || ""
                }
                disabled
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1">
                Processing Price
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={
                  previousYards[selectedPrevYardIdx]?.processingYardPrice || ""
                }
                disabled
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1">
                Core Price
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.coreYardPrice || ""}
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
            <div className="md:col-span-3">
              <label className="block text-white/60 text-xs mb-1">
                yard charge
              </label>
              <textarea
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                value={previousYards[selectedPrevYardIdx]?.yardCharge || ""}
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
          <label className="block text-white/60 text-sm mb-2">Address</label>
          <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter address"
            value={formData.yardAddress}
            onChange={(e) => handleInputChange("yardAddress", e.target.value)}
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
        {/* <div>
          <label className="block text-white/60 text-sm mb-2">Address</label>
          <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter address"
            value={formData.yardAddress}
            onChange={(e) => handleInputChange("yardAddress", e.target.value)}
          />
        </div> */}

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

         <div className="relative">
          <label className="block text-white/60 text-sm mb-2">Yard Price *</label>
          <div className="relative" ref={yardPriceOptionsRef}>
            <input
              type="text"
              className={`appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full bg-[#0a1929] border rounded-lg px-4 py-3 pr-12 text-white focus:outline-none ${
                fieldErrors.yardPrice ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-blue-500"
              }`}
              placeholder="00.00"
              value={formData.yardPrice === 0 ? "" : formData.yardPrice}
              onChange={(e) => handleInputChange("yardPrice", e.target.value)}
              onBlur={(e) => handlePriceBlur("yardPrice", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowYardPriceOptions(!showYardPriceOptions)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
            >
              <Plus size={14} />
            </button>

            {/* Dropdown options */}
            {showYardPriceOptions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a1929] border border-gray-600 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {!visiblePriceFields.taxesPrice && (
                    <button
                      type="button"
                      onClick={() => handlePriceFieldSelection("taxesPrice")}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                    >
                      Taxes Price
                    </button>
                  )}
                  {!visiblePriceFields.handlingPrice && (
                    <button
                      type="button"
                      onClick={() => handlePriceFieldSelection("handlingPrice")}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                    >
                      Handling Price
                    </button>
                  )}
                  {!visiblePriceFields.processingPrice && (
                    <button
                      type="button"
                      onClick={() => handlePriceFieldSelection("processingPrice")}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                    >
                      Processing Price
                    </button>
                  )}
                  {!visiblePriceFields.corePrice && (
                    <button
                      type="button"
                      onClick={() => handlePriceFieldSelection("corePrice")}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                    >
                      Core Price
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conditional rendering for fees */}
        {visiblePriceFields.taxesPrice && (
          <div className="relative">
            <button
              onClick={() => {
                setVisiblePriceFields((prev) => ({
                  ...prev,
                  taxesPrice: false,
                }))
                handleInputChange("taxesYardPrice", "")
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove payment"
            >
              <X size={16} />
            </button>
            <label className="block text-white/60 text-sm mb-2">Taxes Price</label>
            <input
              type="text"
              className={`
                appearance-none
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                  fieldErrors.taxesPrice
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-blue-500"
                }`}
              placeholder="00.00"
              value={
                formData.taxesYardPrice === 0 || formData.taxesYardPrice === "0" || formData.taxesYardPrice === "0.00"
                  ? ""
                  : formData.taxesYardPrice
              }
              onChange={(e) => handleInputChange("taxesYardPrice", e.target.value)}
              onBlur={(e) => handlePriceBlur("taxesYardPrice", e.target.value)}
            />
          </div>
        )}

        {visiblePriceFields.handlingPrice && (
          <div className="relative">
            <button
              onClick={() => {
                setVisiblePriceFields((prev) => ({
                  ...prev,
                  handlingPrice: false,
                }))
                handleInputChange("handlingYardPrice", "")
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove payment"
            >
              <X size={16} />
            </button>
            <label className="block text-white/60 text-sm mb-2">Handling Price</label>
            <input
              type="text"
              className={`
                appearance-none
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                  fieldErrors.handlingPrice
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-blue-500"
                }`}
              placeholder="00.00"
              value={
                formData.handlingYardPrice === 0 ||
                formData.handlingYardPrice === "0" ||
                formData.handlingYardPrice === "0.00"
                  ? ""
                  : formData.handlingYardPrice
              }
              onChange={(e) => handleInputChange("handlingYardPrice", e.target.value)}
              onBlur={(e) => handlePriceBlur("handlingYardPrice", e.target.value)}
            />
          </div>
        )}

        {visiblePriceFields.processingPrice && (
          <div className="relative">
            <button
              onClick={() => {
                setVisiblePriceFields((prev) => ({
                  ...prev,
                  processingPrice: false,
                }))
                handleInputChange("processingYardPrice", "")
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove payment"
            >
              <X size={16} />
            </button>
            <label className="block text-white/60 text-sm mb-2">Processing Price</label>
            <input
              type="text"
              className={`
                appearance-none
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                  fieldErrors.processingPrice
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-blue-500"
                }`}
              placeholder="00.00"
              value={
                formData.processingYardPrice === 0 ||
                formData.processingYardPrice === "0" ||
                formData.processingYardPrice === "0.00"
                  ? ""
                  : formData.processingYardPrice
              }
              onChange={(e) => handleInputChange("processingYardPrice", e.target.value)}
              onBlur={(e) => handlePriceBlur("processingYardPrice", e.target.value)}
            />
          </div>
        )}

        {visiblePriceFields.corePrice && (
          <div className="relative">
            <button
              onClick={() => {
                setVisiblePriceFields((prev) => ({
                  ...prev,
                  corePrice: false,
                }))
                handleInputChange("coreYardPrice", "")
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove payment"
            >
              <X size={16} />
            </button>
            <label className="block text-white/60 text-sm mb-2">Core Price</label>
            <input
              type="text"
              className={`
                appearance-none
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                  fieldErrors.corePrice
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-blue-500"
                }`}
              placeholder="00.00"
              value={
                formData.coreYardPrice === 0 || formData.coreYardPrice === "0" || formData.coreYardPrice === "0.00"
                  ? ""
                  : formData.coreYardPrice
              }
              onChange={(e) => handleInputChange("coreYardPrice", e.target.value)}
              onBlur={(e) => handlePriceBlur("coreYardPrice", e.target.value)}
            />
          </div>
        )}


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
          <>
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
                  const rawValue = e.target.value || "0";
                  const value = parseFloat(rawValue).toFixed(2);
                  handleInputChange("yardCost", value);
                }}
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Total Buy
              </label>
              <input
                type="number"
                className="w-full bg-[#0a1929] border  border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter total buy"
                value={(
                  (Number(formData.yardPrice) || 0) +
                  (Number(formData.taxesYardPrice) || 0) +
                  (Number(formData.handlingYardPrice) || 0) +
                  (Number(formData.processingYardPrice) || 0) +
                  (Number(formData.coreYardPrice) || 0) +
                  (Number(formData.yardCost) || 0)
                ).toFixed(2)}
                disabled
              />
            </div>
          </>
        )}


        <div>
        <label className="block text-white/60 text-sm mb-2">Yard Charged</label>
        <div className="relative">
          <select
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
            value={yardCharge}
            onChange={(e) => setYardCharge(e.target.value)}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
            size={16}
          />
        </div>
      </div>

      {yardCharge === "Yes" && (
        <div>
          <label className="block text-white/60 text-sm mb-2">Yard Changed Amount</label>
          <input
            type="number"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter amount"
            value={yardChangedAmount}
            onChange={(e) => setYardChangedAmount(e.target.value)}
            onBlur={(e) => {
              const rawValue = e.target.value || "0";
              const value = parseFloat(rawValue).toFixed(2);
              setYardChangedAmount(value);
            }}
          />
        </div>
        )}
      </div>
    </div>
  );
};

export default YardInfo;
