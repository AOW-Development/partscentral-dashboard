import { Upload, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import ReplacementForm from "./replacement";
import { useProblematicPartsStore } from "@/store/damagedProductStore";
import {
  createOrUpdateProblematicPart,
  buildPayloadFromStore,
  getProblematicPartsByOrderId,
} from "@/utils/problematicPartApi";
import { useParams, useRouter } from "next/navigation";
import { MAKES, MODELS } from "@/vehicleData-dashboard";
import { fetchYears } from "@/utils/vehicleApi";
import { getProductVariants, GroupedVariant } from "@/utils/productApi";

const WrongProductForm = () => {
  // Connect to Zustand store
  const {
    common,
    wrong,
    replacement,
    orderId,
    problematicPartId,
    isSubmitting,
    submitError,
    setCommonField,
    setWrongField,
    setActiveFormType,
    setOrderId,
    setSubmitting,
    setSubmitError,
    resetAll,
    loadProblematicPart,
  } = useProblematicPartsStore();

  const params = useParams();
  const router = useRouter();
  const [localLoading, setLocalLoading] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [productVariants, setProductVariants] = useState<GroupedVariant[]>([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

  // Set active form type, order ID, and fetch existing data on mount
  useEffect(() => {
    setActiveFormType("wrong");

    // Get order ID from URL params
    const currentOrderId = params.id as string;
    if (currentOrderId) {
      setOrderId(currentOrderId);

      // Fetch existing problematic parts for this order
      fetchExistingData(currentOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array - only run once on mount

  const fetchExistingData = async (orderId: string) => {
    try {
      setIsLoadingExisting(true);
      const existingParts = await getProblematicPartsByOrderId(orderId);

      // Get the first problematic part (regardless of type)
      // One order can only have ONE problematic part
      if (existingParts.length > 0) {
        const existingPart = existingParts[0];
        console.log("Loading existing problematic part:", existingPart);
        loadProblematicPart(existingPart);
      }
    } catch (error) {
      console.error("Error fetching existing problematic parts:", error);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  // Fetch years when make and model change
  useEffect(() => {
    if (wrong.make && wrong.model) {
      fetchYears(wrong.make, wrong.model).then((years) => {
        setAvailableYears(years);
      });
    } else {
      setAvailableYears([]);
    }
  }, [wrong.make, wrong.model]);

  // Fetch product variants when make, model, year, and parts change
  useEffect(() => {
    const fetchVariants = async () => {
      if (wrong.make && wrong.model && wrong.year && wrong.parts) {
        setIsLoadingVariants(true);
        try {
          const data = await getProductVariants({
            make: wrong.make,
            model: wrong.model,
            year: wrong.year,
            part: wrong.parts,
          });
          setProductVariants(data.groupedVariants || []);
        } catch (error) {
          console.error("Error fetching product variants:", error);
          setProductVariants([]);
        } finally {
          setIsLoadingVariants(false);
        }
      } else {
        setProductVariants([]);
      }
    };

    fetchVariants();
  }, [wrong.make, wrong.model, wrong.year, wrong.parts]);

  // Handle file uploads (empty for now as requested)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // TODO: Implement photo upload logic
      console.log("Photos selected:", files);
    }
  };

  const handleBOLUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement BOL upload logic
      console.log("BOL file selected:", file);
    }
  };

  const handleSubmit = async () => {
    if (!orderId) {
      alert("Order ID is missing!");
      return;
    }

    // Validate required fields
    if (!common.requestFromCustomer) {
      alert("Please select Request From Customer");
      return;
    }

    try {
      setSubmitting(true);
      setLocalLoading(true);
      setSubmitError(null);

      // Build payload from store
      const payload = buildPayloadFromStore(
        orderId,
        "wrong",
        common,
        wrong,
        common.requestFromCustomer === "Replacement" ? replacement : undefined
      );

      console.log("Submitting wrong product:", payload);

      // Create or update
      const result = await createOrUpdateProblematicPart(
        payload,
        problematicPartId || undefined
      );

      console.log("Problematic part saved:", result);

      // Show success message
      alert(
        problematicPartId
          ? "Problematic part updated successfully!"
          : "Problematic part created successfully! Order Closed!"
      );

      // Only reset form if creating (not updating)
      if (!problematicPartId) {
        resetAll();
      }

      // Reload the data to show updated values
      if (orderId) {
        await fetchExistingData(orderId);
      }

      router.refresh(); // Refresh the current page
    } catch (error: any) {
      console.error("Error submitting problematic part:", error);
      setSubmitError(error.message || "Failed to save problematic part");
      alert(`Error: ${error.message || "Failed to save problematic part"}`);
    } finally {
      setSubmitting(false);
      setLocalLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <h2 className="text-white text-lg font-semibold mb-4">
        Problematic Parts
      </h2>
      {isLoadingExisting && (
        <div className="bg-[#0a1929] p-6 rounded-lg shadow-lg mb-4">
          <p className="text-white text-center">Loading existing data...</p>
        </div>
      )}
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
                id="upload-photos-wrong"
                onChange={handlePhotoUpload}
              />
              <label
                htmlFor="upload-photos-wrong"
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:col-span-2">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Make <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={wrong.make}
                  onChange={(e) => {
                    setWrongField("make", e.target.value);
                    // Reset dependent fields when make changes
                    setWrongField("model", "");
                    setWrongField("year", "");
                    setWrongField("parts", "");
                    setWrongField("specification", "");
                  }}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Make</option>
                  {MAKES.map((make) => (
                    <option key={make} value={make}>
                      {make.charAt(0).toUpperCase() +
                        make.slice(1).toLowerCase()}
                    </option>
                  ))}
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
                  value={wrong.model}
                  onChange={(e) => {
                    setWrongField("model", e.target.value);
                    // Reset dependent fields when model changes
                    setWrongField("year", "");
                    setWrongField("parts", "");
                    setWrongField("specification", "");
                  }}
                  disabled={!wrong.make}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Model</option>
                  {(MODELS[wrong.make] || []).map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
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
                  value={wrong.year}
                  onChange={(e) => {
                    setWrongField("year", e.target.value);
                    // Reset dependent fields when year changes
                    setWrongField("parts", "");
                    setWrongField("specification", "");
                  }}
                  disabled={!wrong.model || availableYears.length === 0}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Year</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Part <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={wrong.parts}
                  onChange={(e) => {
                    setWrongField("parts", e.target.value);
                    // Reset specification when part changes
                    setWrongField("specification", "");
                  }}
                  disabled={!wrong.year}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Part</option>
                  <option value="Engine">Engine</option>
                  <option value="Transmission">Transmission</option>
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
                  value={wrong.specification}
                  onChange={(e) =>
                    setWrongField("specification", e.target.value)
                  }
                  disabled={!productVariants.length}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingVariants
                      ? "Loading..."
                      : productVariants.length === 0
                      ? "No specifications available"
                      : "Select Specification"}
                  </option>
                  {productVariants.map((variant, idx) => (
                    <option key={idx} value={variant.subPart.name}>
                      {variant.subPart.name}
                    </option>
                  ))}
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
                  value={common.requestFromCustomer}
                  onChange={(e) =>
                    setCommonField("requestFromCustomer", e.target.value)
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
                  value={common.returnShipping}
                  onChange={(e) =>
                    setCommonField("returnShipping", e.target.value)
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
            {(common.returnShipping === "Own Shipping" ||
              common.returnShipping === "Yard Shipping") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                <div className="flex items-center gap-6 w-full">
                  <div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="upload-bol-wrong"
                      onChange={handleBOLUpload}
                    />
                    <label
                      htmlFor="upload-bol-wrong"
                      className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600"
                    >
                      <Upload size={16} />
                      Upload BOL
                    </label>
                  </div>

                  <button
                    onClick={() => alert("Sent!")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-white font-medium transition-colors"
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
                        value={common.productReturned}
                        onChange={(e) =>
                          setCommonField("productReturned", e.target.value)
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
                  {common.returnShipping === "Own Shipping" && (
                    <div className="flex-1">
                      <label className="block text-white text-sm font-medium mb-2">
                        Return Shipping Price
                      </label>
                      <input
                        type="text"
                        value={common.returnShippingPrice}
                        onChange={(e) =>
                          setCommonField("returnShippingPrice", e.target.value)
                        }
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter price"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {common.requestFromCustomer === "Refund" && (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Customer Refund
                  </label>
                  <div className="relative">
                    <select
                      value={common.customerRefund}
                      onChange={(e) =>
                        setCommonField("customerRefund", e.target.value)
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
                      value={common.yardRefund}
                      onChange={(e) =>
                        setCommonField("yardRefund", e.target.value)
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
                    value={common.amount}
                    onChange={(e) => setCommonField("amount", e.target.value)}
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
                    value={common.yardAmount}
                    onChange={(e) =>
                      setCommonField("yardAmount", e.target.value)
                    }
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter yard amount"
                  />
                </div>
              </>
            )}
          </div>
          {common.requestFromCustomer === "Replacement" && <ReplacementForm />}
        </div>

        {/* Order Closed Button */}
        <div className="flex justify-end mt-6">
          {submitError && (
            <p className="text-red-500 text-sm mr-4 self-center">
              {submitError}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || localLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed px-6 py-2 rounded-lg text-white font-medium transition-colors"
          >
            {isSubmitting || localLoading
              ? "Saving..."
              : problematicPartId
              ? "Update & Close Order"
              : "Submit & Close Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WrongProductForm;
