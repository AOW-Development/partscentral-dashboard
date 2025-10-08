import { Upload, ChevronDown } from "lucide-react";
import { useState } from "react";
import ReplacementForm from "./replacement";

const WrongProductForm = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    specification: "",
    requestFromCustomer: "",
    returnShipping: "",
    customerRefund: "",
    yardRefund: "",
    amount: "",
    yardAmount: "",
    returnShippingPrice: "",
    productReturned: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Order Closed!");
  };

  return (
    <div className="mt-2">
      {/* <h2 className="text-white text-lg font-semibold mb-4">
        Problematic Parts
      </h2> */}
      <div className="bg-[#0a1929] p-6 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-semibold">Wrong Product</h3>
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
            <button
              onClick={() => alert("Sent to yard!")}
              className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium"
            >
              Send
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ordered Part Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:col-span-2">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Make <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Make</option>
                  <option value="acura">Acura</option>
                  <option value="buick">Buick</option>
                  <option value="dodge">Dodge</option>
                  <option value="honda">Honda</option>
                  <option value="hyundai">Hyundai</option>
                  <option value="isuzu">Isuzu</option>
                  <option value="kia">Kia</option>
                  <option value="suzuki">Suzuki</option>
                  <option value="toyota">Toyota</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Model <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Model</option>
                  <option value="model1">Model 1</option>
                  <option value="model2">Model 2</option>
                  <option value="model3">Model 3</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                  <option value="2016">2016</option>
                  <option value="2015">2015</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Specification
              </label>
              <div className="relative">
                <select
                  value={formData.specification}
                  onChange={(e) =>
                    handleInputChange("specification", e.target.value)
                  }
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Specification</option>
                  <option value="Specification 1">Specification 1</option>
                  <option value="Specification 2">Specification 2</option>
                  <option value="Specification 3">Specification 3</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Request From Customer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Request From Customer
              </label>
              <div className="relative">
                <select
                  value={formData.requestFromCustomer}
                  onChange={(e) =>
                    handleInputChange("requestFromCustomer", e.target.value)
                  }
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select</option>
                  <option value="Refund">Refund</option>
                  <option value="Replacement">Replacement</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Return Shipping
              </label>
              <div className="relative">
                <select
                  value={formData.returnShipping}
                  onChange={(e) =>
                    handleInputChange("returnShipping", e.target.value)
                  }
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select</option>
                  <option value="Not required">Not required</option>
                  <option value="Yard Shipping">Yard Shipping</option>
                  <option value="Own Shipping">Own Shipping</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            {/* Conditional Return Shipping Fields */}
            {(formData.returnShipping === "Own Shipping" ||
              formData.returnShipping === "Yard Shipping") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                <div className="flex items-end gap-6">
                  <div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="upload-bol"
                      onChange={() => {}}
                    />
                    <label
                      htmlFor="upload-bol"
                      className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600"
                    >
                      <Upload size={16} />
                      Upload BOL
                    </label>
                  </div>

                  <button
                    onClick={() => alert("Sent!")}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-white font-medium transition-colors"
                  >
                    Send
                  </button>
                </div>

                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-white text-sm font-medium mb-2">
                      Product Returned
                    </label>
                    <div className="relative">
                      <select
                        value={formData.productReturned}
                        onChange={(e) =>
                          handleInputChange("productReturned", e.target.value)
                        }
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                      >
                        <option value="">Yes Or No</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  {formData.returnShipping === "Own Shipping" && (
                    <div className="flex-1">
                      <label className="block text-white text-sm font-medium mb-2">
                        Return Shipping Price
                      </label>
                      <input
                        type="text"
                        value={formData.returnShippingPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "returnShippingPrice",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter price"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.requestFromCustomer === "Refund" && (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Customer Refund
                  </label>
                  <div className="relative">
                    <select
                      value={formData.customerRefund}
                      onChange={(e) =>
                        handleInputChange("customerRefund", e.target.value)
                      }
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Yard Refund
                  </label>
                  <div className="relative">
                    <select
                      value={formData.yardRefund}
                      onChange={(e) =>
                        handleInputChange("yardRefund", e.target.value)
                      }
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Yard Amount
                  </label>
                  <input
                    type="text"
                    value={formData.yardAmount}
                    onChange={(e) =>
                      handleInputChange("yardAmount", e.target.value)
                    }
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter yard amount"
                  />
                </div>
              </>
            )}
          </div>
          {formData.requestFromCustomer === "Replacement" && (
            <ReplacementForm />
          )}
        </div>

        {/* Order Closed Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-medium transition-colors"
          >
            Order Closed
          </button>
        </div>
      </div>
    </div>
  );
};

export default WrongProductForm;
