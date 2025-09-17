"use client";
import React, { ChangeEvent, FocusEvent } from "react";
import { ChevronDown, Upload, Plus } from "lucide-react";
import { useDamagedProductStore } from "@/store/damagedProductStore";
// import ReplacementForm from "./replacement";

const DamagedProductForm: React.FC = () => {
  const { formData, setField, resetForm } = useDamagedProductStore();

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setField("photos", Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (!formData.requestFromCustomer || !formData.customerRefund) {
      alert("Please fill in required fields!");
      return;
    }
    console.log("Submitting damaged product form:", formData);
    resetForm();
  };

  const handlePriceBlur = (e: FocusEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);
    
    // Check if the value is a valid number before formatting
    if (!isNaN(numberValue)) {
      const formattedValue = numberValue.toFixed(2);
      setField(field, formattedValue);
    } else if (value === "") {
      // If the field is empty, set it to "0.00"
      setField(field, "0.00");
    }
  };

  const renderBolUpload = () => (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1">
        <label className="block text-white/60 text-sm mb-2">Upload BOL</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          id="upload-bol"
          onChange={(e) => setField("bolFile", e.target.files?.[0] || null)}
        />
        <label
          htmlFor="upload-bol"
          className="flex items-center justify-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
        >
          <Plus size={16} />
          Upload BOL
        </label>
        {formData.bolFile && (
          <p className="text-sm text-green-400 mt-2">
            {formData.bolFile.name} uploaded
          </p>
        )}
      </div>

      <button
        onClick={() => alert("BOL Sent!")}
        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium self-end flex-1"
      >
        Send
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Problematic Parts</h2>
      <div className="bg-[#0a1929] p-6 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-semibold">Damaged Product</h3>
          <div className="flex items-center gap-4">
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="upload-photos"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="upload-photos"
                className="flex items-center gap-2 cursor-pointer bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Upload size={16} />
                Upload Photos
              </label>
              {formData.photos.length > 0 && (
                <p className="text-sm text-green-400 mt-2">
                  {formData.photos.length} file(s) uploaded
                </p>
              )}
            </div>
            <button
              onClick={() => alert("Sent to yard!")}
              className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium"
            >
              Send to Yard
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Request From customer
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                value={formData.requestFromCustomer}
                onChange={(e) => setField("requestFromCustomer", e.target.value)}
              >
                <option value="">Select</option>
                <option value="Refund">Refund</option>
                <option value="Replacement">Replacement</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60" size={16} />
            </div>
            {/* {formData.requestFromCustomer === "Replacement" && <ReplacementForm />} */}
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Return Shipping
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                value={formData.returnShipping}
                onChange={(e) => setField("returnShipping", e.target.value)}
              >
                <option value="">Select</option>
                <option value="not required">Not Required</option>
                <option value="own shipping">Own Shipping</option>
                <option value="yard shipping">Yard Shipping</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60" size={16} />
            </div>
          </div>
          {formData.returnShipping === "own shipping" && (
            <>
              {renderBolUpload()}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Return Shipping Price
                </label>
                <input
                  type="number"
                  className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                  value={formData.returnShippingPrice}
                  onChange={(e) => setField("returnShippingPrice", e.target.value)}
                  onBlur={(e) => handlePriceBlur(e, "returnShippingPrice")}
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Product Returned
                </label>
                <select
                  className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                  value={formData.productReturned}
                  onChange={(e) => setField("productReturned", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </>
          )}
          {formData.returnShipping === "yard shipping" && (
            <>
              {renderBolUpload()}
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Product Returned
                </label>
                <select
                  className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                  value={formData.productReturned}
                  onChange={(e) => setField("productReturned", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Customer Refund
            </label>
            <select
              className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
              value={formData.customerRefund}
              onChange={(e) => setField("customerRefund", e.target.value)}
            >
              <option value="">select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {formData.customerRefund === "Yes" && (
            <div>
              <label className="block text-white/60 text-sm mb-2">Amount</label>
              <input
                type="number"
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                value={formData.amount}
                onChange={(e) => setField("amount", e.target.value)}
                onBlur={(e) => handlePriceBlur(e, "amount")}
              />
            </div>
          )}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Yard Refund
            </label>
            <select
              className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
              value={formData.yardRefund}
              onChange={(e) => setField("yardRefund", e.target.value)}
            >
              <option value="">select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {formData.yardRefund === "Yes" && (
            <div>
              <label className="block text-white/60 text-sm mb-2">Yard Amount</label>
              <input
                type="number"
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                value={formData.yardAmount}
                onChange={(e) => setField("yardAmount", e.target.value)}
                onBlur={(e) => handlePriceBlur(e, "yardAmount")}
              />
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-medium"
          >
            Order Closed
          </button>
        </div>
      </div>
    </div>
  );
};

export default DamagedProductForm;