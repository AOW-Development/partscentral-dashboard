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
  setPreviousYards: React.Dispatch<React.SetStateAction<PreviousYard[]>>;
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
  setPreviousYards,
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
  const [yardChargeForHistory, setYardChargeForHistory] = useState("");
  const [submitReason, setSubmitReason] = useState(false);
  const [showYardPriceOptions, setShowYardPriceOptions] = useState(false);
  const [visiblePriceFields, setVisiblePriceFields] = useState({
    taxesPrice: false,
    handlingPrice: false,
    processingPrice: false,
    corePrice: false,
  });
  const [editingPreviousYard, setEditingPreviousYard] = useState(false);
  const [editingYardIndex, setEditingYardIndex] = useState<number | null>(null);
  const yardPriceOptionsRef = useRef<HTMLDivElement>(null);

  const [fieldErrors] = useState<{ [key: string]: boolean }>({});
  const [localYardPrice, setLocalYardPrice] = useState<string>("");
  const [localTaxesPrice, setLocalTaxesPrice] = useState<string>("");
  const [localHandlingPrice, setLocalHandlingPrice] = useState<string>("");
  const [localProcessingPrice, setLocalProcessingPrice] = useState<string>("");
  const [localCorePrice, setLocalCorePrice] = useState<string>("");
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
    if (value === "" || value === null || value === undefined) {
      handleInputChange(field, "");
      return;
    }

    const numericValue = parseFloat(value.toString());
    if (isNaN(numericValue)) {
      handleInputChange(field, "");
      return;
    }

    const formatted = numericValue.toFixed(2);
    handleInputChange(field, formatted); // must store string, not number
  };

  

  // Ensure we have at least 3 previous yard slots
  const ensureMinimumPreviousYards = () => {
    const minYards = 3;
    console.log(
      "DEBUG: ensureMinimumPreviousYards - current length:",
      previousYards.length,
      "min required:",
      minYards
    );
    if (previousYards.length < minYards) {
      const emptyYards: PreviousYard[] = Array.from(
        { length: minYards - previousYards.length },
        () => ({
          yardName: "",
          attnName: "",
          yardAddress: "",
          yardMobile: "",
          yardEmail: "",
          yardPrice: "",
          yardWarranty: "",
          yardMiles: "",
          yardShipping: "",
          yardCost: "",
          reason: "",
          yardCharge: "",
        })
      );
      console.log(
        "DEBUG: ensureMinimumPreviousYards - adding",
        emptyYards.length,
        "empty yards"
      );
      setPreviousYards([...previousYards, ...emptyYards]);
    }
  };

  // Handle previous yard field changes
  const handlePreviousYardChange = (
    index: number,
    field: keyof PreviousYard,
    value: string
  ) => {
    setPreviousYards((prev) =>
      prev.map((yard, i) => (i === index ? { ...yard, [field]: value } : yard))
    );
  };

  // Start editing a previous yard
  const startEditingPreviousYard = (index: number) => {
    setEditingYardIndex(index);
    setEditingPreviousYard(true);
  };

  // Save previous yard changes
  const savePreviousYard = () => {
    setEditingPreviousYard(false);
    
    setEditingYardIndex(null);
  };

  // Cancel editing
  const cancelEditingPreviousYard = () => {
    setEditingPreviousYard(false);
    setEditingYardIndex(null);
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

  

  // Ensure minimum previous yards when component loads or previousYards changes
  useEffect(() => {
    console.log(
      "DEBUG: YardInfo - previousYards.length:",
      previousYards.length
    );
    if (previousYards.length < 3) {
      console.log("DEBUG: YardInfo - Adding empty yards to reach minimum of 3");
      ensureMinimumPreviousYards();
    }
  }, [previousYards.length]);

  // Sync local prices with form data
  useEffect(() => {
    if (formData.yardPrice !== undefined) {
      setLocalYardPrice(formData.yardPrice.toString());
    }
    if (formData.taxesYardPrice !== undefined) {
      setLocalTaxesPrice(formData.taxesYardPrice.toString());
    }
    if (formData.handlingYardPrice !== undefined) {
      setLocalHandlingPrice(formData.handlingYardPrice.toString());
    }
    if (formData.processingYardPrice !== undefined) {
      setLocalProcessingPrice(formData.processingYardPrice.toString());
    }
    if (formData.coreYardPrice !== undefined) {
      setLocalCorePrice(formData.coreYardPrice.toString());
    }
  }, [
    formData.yardPrice,
    formData.taxesYardPrice,
    formData.handlingYardPrice,
    formData.processingYardPrice,
    formData.coreYardPrice,
  ]);

  // Show price fields if they already have values
  useEffect(() => {
    console.log("YardInfo DEBUG - useEffect triggered, checking values:");
    console.log("taxesYardPrice:", formData.taxesYardPrice);
    console.log("handlingYardPrice:", formData.handlingYardPrice);
    console.log("processingYardPrice:", formData.processingYardPrice);
    console.log("coreYardPrice:", formData.coreYardPrice);

    const checkAndShowFields = (
      value: string | number | undefined,
      fieldName:
        | "taxesPrice"
        | "handlingPrice"
        | "processingPrice"
        | "corePrice"
    ) => {
      console.log(`Checking field ${fieldName} with value:`, value);
      if (
        value &&
        value !== "" &&
        value !== "0" &&
        value !== 0 &&
        value !== "0.00"
      ) {
        console.log(`Setting field ${fieldName} visible`);
        setVisiblePriceFields((prev) => ({ ...prev, [fieldName]: true }));
      }
    };

    checkAndShowFields(formData.taxesYardPrice, "taxesPrice");
    checkAndShowFields(formData.handlingYardPrice, "handlingPrice");
    checkAndShowFields(formData.processingYardPrice, "processingPrice");
    checkAndShowFields(formData.coreYardPrice, "corePrice");
  }, [
    formData.taxesYardPrice,
    formData.handlingYardPrice,
    formData.processingYardPrice,
    formData.coreYardPrice,
  ]);

  useEffect(() => {
    if (submitReason && reason.trim()) {
      const moveYardToHistory = async () => {
        try {
          const API_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
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
          // setYardCharge("");
          setSubmitReason(false);
        }
      };

      moveYardToHistory();
    }
  }, [submitReason, reason, orderId, onYardMoved]);

  return (
    <div className="relative p-2 mt-6">
      {statusPopUp && (
        <MoveYardPopUp
          setStatus={setStatusPopUp}
          setReason={setReason}
          // setYardCharge={setYardCharge}
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
      {showPreviousYard && (
        <div className="mb-6 bg-[#222c3a] rounded-lg p-4 border border-blue-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-semibold">
              Previous Yard Details
            </span>
            <div className="flex gap-2">
              {previousYards.length > 0 && (
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
              )}
              {editingPreviousYard ? (
                <div className="flex gap-1">
                  <button
                    onClick={savePreviousYard}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditingPreviousYard}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditingPreviousYard(selectedPrevYardIdx)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className=" grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Yard Name
              </label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardName || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardName",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Attn. Name
              </label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.attnName || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "attnName",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Address
              </label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardAddress || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardAddress",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Mobile</label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardMobile || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardMobile",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Email</label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardEmail || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardEmail",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Yard Price
              </label>
              <input
                type="number"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardPrice || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardPrice",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1">
                Taxes Price
              </label>
              <input
                type="number"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.taxesYardPrice || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "taxesYardPrice",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1">
                Handling Price
              </label>
              <input
                type="number"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={
                  previousYards[selectedPrevYardIdx]?.handlingYardPrice || ""
                }
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "handlingYardPrice",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1">
                Processing Price
              </label>
              <input
                type="number"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={
                  previousYards[selectedPrevYardIdx]?.processingYardPrice || ""
                }
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "processingYardPrice",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1">
                Core Price
              </label>
              <input
                type="number"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.coreYardPrice || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "coreYardPrice",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1">
                Warranty
              </label>

              <select
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                value={previousYards[selectedPrevYardIdx]?.yardWarranty || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardWarranty",
                    e.target.value
                  )
                }
              >
                <option value="">Select warranty</option>
                <option>30 Days</option>
                <option>60 Days</option>
                <option>90 Days</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Miles</label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardMiles || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardMiles",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Shipping
              </label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardShipping || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardShipping",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">
                Yard Shipping Cost
              </label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardCost || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardCost",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-white/60 text-xs mb-1">Reason</label>
              <textarea
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.reason || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "reason",
                    e.target.value
                  )
                }
                rows={3}
              />
            </div>
            {/* <div className="md:col-span-3">
              <label className="block text-white/60 text-xs mb-1">
                Yard Charge
              </label>
              <textarea
                className={`w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white ${
                  editingPreviousYard &&
                  editingYardIndex === selectedPrevYardIdx
                    ? "focus:border-blue-500 focus:outline-none"
                    : ""
                }`}
                value={previousYards[selectedPrevYardIdx]?.yardCharge || ""}
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardCharge",
                    e.target.value
                  )
                }
                rows={3}
              />
            </div>
            {/* <div className="md:col-span-3">
              <label className="block text-white/60 text-xs mb-1">
                Yard Charged Amount
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                value={
                  previousYards[selectedPrevYardIdx]?.yardChangedAmount || ""
                }
                disabled={
                  !(
                    editingPreviousYard &&
                    editingYardIndex === selectedPrevYardIdx
                  )
                }
                onChange={(e) =>
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardChangedAmount",
                    e.target.value
                  )
                }
                onBlur={(e) => {
                  const rawValue = e.target.value || "0";
                  const value = parseFloat(rawValue).toFixed(2);
                  handlePreviousYardChange(
                    selectedPrevYardIdx,
                    "yardChangedAmount",
                    value
                  );
                }}
              />
            </div> */}
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
          <label className="block text-white/60 text-sm mb-2">
            Yard Price *
          </label>
          <div className="relative" ref={yardPriceOptionsRef}>
            <input
              type="number"
              className={`appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full bg-[#0a1929] border rounded-lg px-4 py-3 pr-12 text-white focus:outline-none ${
                fieldErrors.yardPrice
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-600 focus:border-blue-500"
              }`}
              placeholder="00.00"
              value={localYardPrice}
              onChange={(e) => {
                setLocalYardPrice(e.target.value);
                handleInputChange("yardPrice", e.target.value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value)) && value !== "") {
                  const numericValue = parseFloat(value);
                  const formatted = numericValue.toFixed(2);
                  if (value !== formatted) {
                    setLocalYardPrice(formatted);
                    handleInputChange("yardPrice", formatted);
                  }
                }
              }}
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
                      onClick={() =>
                        handlePriceFieldSelection("processingPrice")
                      }
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
                }));
                handleInputChange("taxesYardPrice", "");
              }}
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
              value={localTaxesPrice}
              onChange={(e) => {
                setLocalTaxesPrice(e.target.value);
                handleInputChange("taxesYardPrice", e.target.value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value)) && value !== "") {
                  const numericValue = parseFloat(value);
                  const formatted = numericValue.toFixed(2);
                  if (value !== formatted) {
                    setLocalTaxesPrice(formatted);
                    handleInputChange("taxesYardPrice", formatted);
                  }
                }
              }}
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
                }));
                handleInputChange("handlingYardPrice", "");
              }}
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
              value={localHandlingPrice}
              onChange={(e) => {
                setLocalHandlingPrice(e.target.value);
                handleInputChange("handlingYardPrice", e.target.value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value)) && value !== "") {
                  const numericValue = parseFloat(value);
                  const formatted = numericValue.toFixed(2);
                  if (value !== formatted) {
                    setLocalHandlingPrice(formatted);
                    handleInputChange("handlingYardPrice", formatted);
                  }
                }
              }}
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
                }));
                handleInputChange("processingYardPrice", "");
              }}
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
              value={localProcessingPrice}
              onChange={(e) => {
                setLocalProcessingPrice(e.target.value);
                handleInputChange("processingYardPrice", e.target.value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value)) && value !== "") {
                  const numericValue = parseFloat(value);
                  const formatted = numericValue.toFixed(2);
                  if (value !== formatted) {
                    setLocalProcessingPrice(formatted);
                    handleInputChange("processingYardPrice", formatted);
                  }
                }
              }}
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
                }));
                handleInputChange("coreYardPrice", "");
              }}
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
              value={localCorePrice}
              onChange={(e) => {
                setLocalCorePrice(e.target.value);
                handleInputChange("coreYardPrice", e.target.value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value && !isNaN(parseFloat(value)) && value !== "") {
                  const numericValue = parseFloat(value);
                  const formatted = numericValue.toFixed(2);
                  if (value !== formatted) {
                    setLocalCorePrice(formatted);
                    handleInputChange("coreYardPrice", formatted);
                  }
                }
              }}
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
          <label className="block text-white/60 text-sm mb-2">
            Yard Charged
          </label>
          {/* <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter yard charge(Yes or No)"
            value={formData.yardCharge}
            onChange={(e) => handleInputChange("yardCharge", e.target.value)}
          /> */}
          <div className="relative">
            <select
              className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
              value={formData.yardCharge}
              onChange={(e) => handleInputChange("yardCharge", e.target.value)}
            >
              <option value="">Select yard charge</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
              size={16}
            />
          </div>
        </div>

        {/* {formData.yardCharge === "Yes" ||
          (formData.yardCharge === "yes" && ( */}
        <div>
          <label className="block text-white/60 text-sm mb-2">
            Yard Charged Amount
          </label>
          <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter amount"
            value={formData.yardChangedAmount}
            onChange={(e) =>
              handleInputChange("yardChangedAmount", e.target.value)
            }
            onBlur={(e) => {
              const rawValue = e.target.value || "0";
              const value = parseFloat(rawValue).toFixed(2);
              handleInputChange("yardChangedAmount", value);
            }}
          />
        </div>
        {/* ))} */}
      </div>
    </div>
  );
};

export default YardInfo;
