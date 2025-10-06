"use client";
import React, { ChangeEvent, useState } from "react";
import { ChevronDown, Plus, X, Minus } from "lucide-react";
import { useDamagedProductStore } from "@/store/damagedProductStore";
import MoveYardPopUp from "./MoveYardPopUp"; // Assuming this component exists

interface PreviousYard {
  yardName: string;
  attnName: string; // Added to match the YardInfo component
  yardAddress: string;
  yardPhone: string; // Changed from mobile to phone to match your store
  yardEmail: string;
  yardPrice: string;
  taxesPrice?: string;
  handlingPrice?: string;
  processingPrice?: string;
  corePrice?: string;
  yardWarranty: string;
  yardMiles: string; // Added to match the YardInfo component
  yardShipping: string; // Changed from 'shipping' to match your store
  yardCost: string; // Changed from 'replacementPrice' to match the YardInfo component's logic
  reason?: string;
  yardCharge?: string;
}

const ReplacementForm: React.FC = () => {
  const { replacementData, setReplacementField } = useDamagedProductStore();

  const [showPreviousYard, setShowPreviousYard] = useState(false);
  const [selectedPrevYardIdx, setSelectedPrevYardIdx] = useState(0);
  const [statusPopUp, setStatusPopUp] = useState(false);

  // Mock data for previous yards, as it's not provided in the store
  const previousYards: PreviousYard[] = [
    {
      yardName: "Previous Yard A",
      attnName: "John Doe",
      yardAddress: "123 Old St, Anytown",
      yardPhone: "555-123-4567",
      yardEmail: "old.yard@example.com",
      yardPrice: "500.00",
      taxesPrice: "25.00",
      yardWarranty: "90 Days",
      yardMiles: "150",
      yardShipping: "Yard Shipping",
      yardCost: "75.00",
      reason: "Part not available",
      yardCharge: "10.00",
    },
    {
      yardName: "Previous Yard B",
      attnName: "Jane Smith",
      yardAddress: "456 History Ln, Nowhere",
      yardPhone: "555-987-6543",
      yardEmail: "history.yard@example.com",
      yardPrice: "650.00",
      handlingPrice: "15.00",
      yardWarranty: "1 Year",
      yardMiles: "200",
      yardShipping: "Own Shipping",
      yardCost: "50.00",
      reason: "Wrong part sent",
      yardCharge: "5.00",
    },
  ];

  const [visiblePriceFields, setVisiblePriceFields] = useState({
    taxesPrice: false,
    handlingPrice: false,
    processingPrice: false,
    corePrice: false,
  });

  const handlePriceFieldSelection = (
    fieldName: keyof typeof visiblePriceFields
  ) => {
    setVisiblePriceFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const handleRemovePriceField = (
    fieldName: keyof typeof visiblePriceFields
  ) => {
    setVisiblePriceFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
    setReplacementField(fieldName as keyof typeof replacementData, "");
  };

  const handlePriceBlur = (
    field: keyof typeof replacementData,
    value: string
  ) => {
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
      const formattedValue = numberValue.toFixed(2);
      setReplacementField(field, formattedValue);
    } else if (value === "") {
      setReplacementField(field, "0.00");
    }
  };

  const calculateTotalBuy = () => {
    const price = parseFloat(replacementData.replacementPrice) || 0;
    const taxes = parseFloat(replacementData.taxesPrice as string) || 0;
    const handling = parseFloat(replacementData.handlingPrice as string) || 0;
    const processing =
      parseFloat(replacementData.processingPrice as string) || 0;
    const core = parseFloat(replacementData.corePrice as string) || 0;
    const cost = parseFloat(replacementData.yardCost as string) || 0;
    return (price + taxes + handling + processing + core + cost).toFixed(2);
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* --- Does Yard have replacement? --- */}
      <div className="md:col-span-2">
        <label className="block text-white/60 text-sm mb-2">
          Does Yard have a Replacement?
        </label>
        <div className="relative">
          <select
            className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
            value={replacementData.hasReplacement}
            onChange={(e) =>
              setReplacementField("hasReplacement", e.target.value)
            }
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            size={16}
          />
        </div>
      </div>

      {/* --- If Yes → Re-delivery Tracking Details --- */}
      {replacementData.hasReplacement === "Yes" && (
        <div className="md:col-span-2">
          <p className="text-white/70 mb-4">Re-delivery Tracking Details</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Carrier Name"
              className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
              value={replacementData.carrierName}
              onChange={(e) =>
                setReplacementField("carrierName", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Tracking Number"
              className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
              value={replacementData.trackingNumber}
              onChange={(e) =>
                setReplacementField("trackingNumber", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Estimated Time of Arrival"
              className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
              value={replacementData.eta}
              onChange={(e) => setReplacementField("eta", e.target.value)}
            />
            <button
              onClick={() => alert("Tracking details sent!")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* --- If No → Replacement Yard Information and related fields --- */}
      {replacementData.hasReplacement === "No" && (
        <div className="md:col-span-2">
          <div className="relative p-2 mt-6">
            {statusPopUp && (
              <MoveYardPopUp
                setStatus={() => setStatusPopUp(false)}
                setReason={() => {}}
                setYardCharge={() => {}}
                setSubmitReason={() => {}}
                // orderId={orderId} // You need to pass this prop from parent
                // onYardMoved={() => {}} // You need to pass this prop from parent
              />
            )}
            <div className="relative flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">
                Replacement Yard Information
              </h3>
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
                  <select
                    className="bg-[#0a1929] border border-gray-600 rounded px-2 py-1 text-white text-xs"
                    value={selectedPrevYardIdx}
                    onChange={(e) =>
                      setSelectedPrevYardIdx(Number(e.target.value))
                    }
                  >
                    {previousYards.map((_, idx) => (
                      <option key={idx} value={idx}>
                        Yard #{idx + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
                      value={
                        previousYards[selectedPrevYardIdx]?.yardAddress || ""
                      }
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                      value={
                        previousYards[selectedPrevYardIdx]?.yardPhone || ""
                      }
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">
                      Email
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                      value={
                        previousYards[selectedPrevYardIdx]?.yardEmail || ""
                      }
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                      value={
                        previousYards[selectedPrevYardIdx]?.yardPrice || ""
                      }
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
                      value={
                        previousYards[selectedPrevYardIdx]?.taxesPrice || ""
                      }
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
                        previousYards[selectedPrevYardIdx]?.handlingPrice || ""
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
                        previousYards[selectedPrevYardIdx]?.processingPrice ||
                        ""
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
                      value={
                        previousYards[selectedPrevYardIdx]?.corePrice || ""
                      }
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
                      value={
                        previousYards[selectedPrevYardIdx]?.yardWarranty || ""
                      }
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">
                      Miles
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                      value={
                        previousYards[selectedPrevYardIdx]?.yardMiles || ""
                      }
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
                      value={
                        previousYards[selectedPrevYardIdx]?.yardShipping || ""
                      }
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">
                      Yard Cost
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                      value={previousYards[selectedPrevYardIdx]?.yardCost || ""}
                      disabled
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-white/60 text-xs mb-1">
                      Reason
                    </label>
                    <textarea
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                      value={previousYards[selectedPrevYardIdx]?.reason || ""}
                      disabled
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-white/60 text-xs mb-1">
                      Yard Charge
                    </label>
                    <textarea
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                      value={
                        previousYards[selectedPrevYardIdx]?.yardCharge || ""
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-white text-lg font-semibold mb-4">
              Current Yard Info
            </h3>
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FFFFFF33] rounded-lg p-2">
              <button
                className="absolute right-0 top-0 z-10 hover:bg-red-600 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
                onClick={() => setStatusPopUp(true)}
              >
                <Minus size={18} />
              </button>
              {/* Name */}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Yard Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter name"
                  value={replacementData.yardName}
                  onChange={(e) =>
                    setReplacementField("yardName", e.target.value)
                  }
                />
              </div>
              {/* Address */}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter address"
                  value={replacementData.yardAddress}
                  onChange={(e) =>
                    setReplacementField("yardAddress", e.target.value)
                  }
                />
              </div>
              {/* Phone */}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter phone number"
                  value={replacementData.yardPhone}
                  onChange={(e) =>
                    setReplacementField("yardPhone", e.target.value)
                  }
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter email"
                  value={replacementData.yardEmail}
                  onChange={(e) =>
                    setReplacementField("yardEmail", e.target.value)
                  }
                />
              </div>
              {/* Warranty */}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Warranty
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                    value={replacementData.warranty}
                    onChange={(e) =>
                      setReplacementField("warranty", e.target.value)
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
              {/* Shipping */}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Shipping
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                    value={replacementData.shipping}
                    onChange={(e) =>
                      setReplacementField("shipping", e.target.value)
                    }
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
              {/* Yard Price */}
              <div className="relative">
                <label className="block text-white/60 text-sm mb-2">
                  Replacement Price *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="00.00"
                    value={replacementData.replacementPrice}
                    onChange={(e) =>
                      setReplacementField("replacementPrice", e.target.value)
                    }
                    onBlur={(e) =>
                      handlePriceBlur("replacementPrice", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handlePriceFieldSelection("taxesPrice")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Conditional rendering for additional fees */}
              {visiblePriceFields.taxesPrice && (
                <div className="relative">
                  <button
                    onClick={() => handleRemovePriceField("taxesPrice")}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove payment"
                  >
                    <X size={16} />
                  </button>
                  <label className="block text-white/60 text-sm mb-2">
                    Taxes Price
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none border-gray-600 focus:border-blue-500"
                    placeholder="00.00"
                    value={replacementData.taxesPrice as string}
                    onChange={(e) =>
                      setReplacementField("taxesPrice", e.target.value)
                    }
                    onBlur={(e) =>
                      handlePriceBlur("taxesPrice", e.target.value)
                    }
                  />
                </div>
              )}
              {visiblePriceFields.handlingPrice && (
                <div className="relative">
                  <button
                    onClick={() => handleRemovePriceField("handlingPrice")}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove payment"
                  >
                    <X size={16} />
                  </button>
                  <label className="block text-white/60 text-sm mb-2">
                    Handling Price
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none border-gray-600 focus:border-blue-500"
                    placeholder="00.00"
                    value={replacementData.handlingPrice as string}
                    onChange={(e) =>
                      setReplacementField("handlingPrice", e.target.value)
                    }
                    onBlur={(e) =>
                      handlePriceBlur("handlingPrice", e.target.value)
                    }
                  />
                </div>
              )}
              {visiblePriceFields.processingPrice && (
                <div className="relative">
                  <button
                    onClick={() => handleRemovePriceField("processingPrice")}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove payment"
                  >
                    <X size={16} />
                  </button>
                  <label className="block text-white/60 text-sm mb-2">
                    Processing Price
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none border-gray-600 focus:border-blue-500"
                    placeholder="00.00"
                    value={replacementData.processingPrice as string}
                    onChange={(e) =>
                      setReplacementField("processingPrice", e.target.value)
                    }
                    onBlur={(e) =>
                      handlePriceBlur("processingPrice", e.target.value)
                    }
                  />
                </div>
              )}
              {visiblePriceFields.corePrice && (
                <div className="relative">
                  <button
                    onClick={() => handleRemovePriceField("corePrice")}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove payment"
                  >
                    <X size={16} />
                  </button>
                  <label className="block text-white/60 text-sm mb-2">
                    Core Price
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none border-gray-600 focus:border-blue-500"
                    placeholder="00.00"
                    value={replacementData.corePrice as string}
                    onChange={(e) =>
                      setReplacementField("corePrice", e.target.value)
                    }
                    onBlur={(e) => handlePriceBlur("corePrice", e.target.value)}
                  />
                </div>
              )}
              {/* Yard Shipping Cost */}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Yard Shipping Cost
                </label>
                <input
                  type="number"
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter yard cost"
                  value={replacementData.yardCost}
                  onChange={(e) =>
                    setReplacementField("yardCost", e.target.value)
                  }
                  onBlur={(e) => handlePriceBlur("yardCost", e.target.value)}
                />
              </div>
              {/* Total Buy */}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Total Buy
                </label>
                <input
                  type="number"
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                  value={calculateTotalBuy()}
                  disabled
                />
              </div>
            </div>

            {/* Picture Status */}
            <div className="mt-6">
              <label className="block text-white/60 text-sm mb-2">
                Picture Status
              </label>
              <div className="relative">
                <select
                  className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                  value={replacementData.pictureStatus}
                  onChange={(e) =>
                    setReplacementField("pictureStatus", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                  size={16}
                />
              </div>
            </div>

            {/* Re-delivery Tracking Details (for "No" option) */}
            <div className="mt-6 ">
              <h4 className="text-white/70 text-base font-semibold mb-3">
                Re-delivery Tracking Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Carrier Name"
                  className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                  value={replacementData.redeliveryCarrierName}
                  onChange={(e) =>
                    setReplacementField("redeliveryCarrierName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Tracking Number"
                  className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                  value={replacementData.redeliveryTrackingNumber}
                  onChange={(e) =>
                    setReplacementField(
                      "redeliveryTrackingNumber",
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() => alert("Replacement tracking sent!")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-medium"
                >
                  Send Replacement Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplacementForm;
