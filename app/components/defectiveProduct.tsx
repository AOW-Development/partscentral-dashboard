import { Upload, ChevronDown } from "lucide-react";
import { useState } from "react";
import ReplacementForm from "./replacement";

const DefectiveProductForm = () => {
  const [formData, setFormData] = useState({
    problemCategory: "Other",
    description: "",
    requestFromCustomer: "",
    returnShipping: "",
    customerRefund: "",
    yardRefund: "",
    returnShippingPrice: "",
    amount: "",
    yardAmount: "",
    productReturned: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="mt-2">
      {/* <h2 className="text-white text-lg font-semibold mb-4">
        Problematic Parts
      </h2> */}
      <div className="bg-[#0a1929] p-6 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-semibold">
            Defective Product
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="upload-photos"
                onChange={() => {}}
              />
              <label
                htmlFor="upload-photos"
                className="flex items-center gap-2 cursor-pointer bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Upload size={16} />
                Upload Photos
              </label>
            </div>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="upload-service-doc"
                onChange={() => {}}
              />
              <label
                htmlFor="upload-service-doc"
                className="flex items-center gap-2 cursor-pointer bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Upload size={16} />
                Upload Service Document
              </label>
            </div>
            <button
              onClick={() => alert("Sent to yard!")}
              className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium"
            >
              Send
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem Category */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Problem category
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                value={formData.problemCategory}
                onChange={(e) =>
                  handleInputChange("problemCategory", e.target.value)
                }
              >
                <option value="Other">Other</option>
                <option value="Damaged">Damaged</option>
                <option value="Wrong Part">Wrong Part</option>
                <option value="Defective">Defective</option>
                <option value="Missing">Missing</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                size={16}
              />
            </div>
          </div>

          {/* Description of Defective parts */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Description of Defective parts
            </label>
            <input
              type="text"
              className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
              placeholder="Description of Defective parts"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Request From customer */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Request From customer
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                value={formData.requestFromCustomer}
                onChange={(e) =>
                  handleInputChange("requestFromCustomer", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="Refund">Refund</option>
                <option value="Replacement">Replacement</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                size={16}
              />
            </div>
          </div>

          {/* Return Shipping */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Return Shipping
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                value={formData.returnShipping}
                onChange={(e) =>
                  handleInputChange("returnShipping", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="Not required">Not required</option>
                <option value="Yard Shipping">Yard Shipping</option>
                <option value="Own Shipping">Own Shipping</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                size={16}
              />
            </div>
          </div>

          {/* Controls above Customer Refund */}
          {formData.returnShipping !== "Not required" && (
            <div className="md:col-span-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 ">
                  <input
                    type="file"
                    className="hidden"
                    id="upload-bol"
                    onChange={() => {}}
                  />
                  <label
                    htmlFor="upload-bol"
                    className="flex items-center justify-center gap-2 cursor-pointer border border-gray-500 text-white/90 px-6 py-3 rounded-lg bg-[#253348] hover:bg-[#2e3d55]"
                  >
                    <Upload size={16} />
                    Upload BOL
                  </label>
                  <button
                    onClick={() => alert("Sent!")}
                    className="px-10 py-3 rounded-full bg-[#0c70a8] hover:bg-[#0e7fbf] text-white font-medium"
                  >
                    Send
                  </button>
                </div>

                {formData.returnShipping !== "Yard Shipping" && (
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Return Shipping Price
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                      value={formData.returnShippingPrice}
                      onChange={(e) =>
                        handleInputChange("returnShippingPrice", e.target.value)
                      }
                    />
                  </div>
                )}
                <div className="">
                  <label className="block text-white/60 text-sm mb-2">
                    Product returned
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                      value={formData.productReturned}
                      onChange={(e) =>
                        handleInputChange("productReturned", e.target.value)
                      }
                    >
                      <option value="">Yes Or No</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Refund */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Customer Refund
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                value={formData.customerRefund}
                onChange={(e) =>
                  handleInputChange("customerRefund", e.target.value)
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

          {/* Yard Refund */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Yard Refund
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                value={formData.yardRefund}
                onChange={(e) =>
                  handleInputChange("yardRefund", e.target.value)
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

          {/* Amount */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Amount</label>
            <input
              type="number"
              className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />
          </div>

          {/* Yard Amount */}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Yard Amount
            </label>
            <input
              type="number"
              className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
              placeholder="0.00"
              value={formData.yardAmount}
              onChange={(e) => handleInputChange("yardAmount", e.target.value)}
            />
          </div>
          {formData.requestFromCustomer === "Replacement" && (
            <ReplacementForm />
          )}
        </div>

        {/* Order Closed Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => alert("Order Closed!")}
            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-medium"
          >
            Order Closed
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefectiveProductForm;
