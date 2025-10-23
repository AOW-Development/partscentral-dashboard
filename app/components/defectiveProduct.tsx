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

const DefectiveProductForm = () => {
  // Connect to Zustand store
  const {
    common,
    defective,
    replacement,
    orderId,
    problematicPartId,
    isSubmitting,
    submitError,
    setCommonField,
    setDefectiveField,
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

  // Set active form type, order ID, and fetch existing data on mount
  useEffect(() => {
    setActiveFormType("defective");

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

  // Handle file uploads (empty for now as requested)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // TODO: Implement photo upload logic
      console.log("Photos selected:", files);
    }
  };

  const handleServiceDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // TODO: Implement service document upload logic
      console.log("Service documents selected:", files);
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
        "defective",
        common,
        defective,
        common.requestFromCustomer === "Replacement" ? replacement : undefined
      );

      console.log("Submitting defective product:", payload);

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
                id="upload-photos-defective"
                onChange={handlePhotoUpload}
              />
              <label
                htmlFor="upload-photos-defective"
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
                id="upload-service-doc-defective"
                onChange={handleServiceDocUpload}
              />
              <label
                htmlFor="upload-service-doc-defective"
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
                value={defective.problemCategory}
                onChange={(e) =>
                  setDefectiveField("problemCategory", e.target.value)
                }
              >
                <option value="">Select</option>
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
              value={defective.description}
              onChange={(e) => setDefectiveField("description", e.target.value)}
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
                value={common.requestFromCustomer}
                onChange={(e) =>
                  setCommonField("requestFromCustomer", e.target.value)
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
                value={common.returnShipping}
                onChange={(e) =>
                  setCommonField("returnShipping", e.target.value)
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
          {common.returnShipping !== "Not required" &&
            common.returnShipping !== "" && (
              <div className="md:col-span-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 ">
                    <input
                      type="file"
                      className="hidden"
                      id="upload-bol-defective"
                      onChange={handleBOLUpload}
                    />
                    <label
                      htmlFor="upload-bol-defective"
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

                  {common.returnShipping === "Own Shipping" && (
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Return Shipping Price
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-3 text-white"
                        value={common.returnShippingPrice}
                        onChange={(e) =>
                          setCommonField("returnShippingPrice", e.target.value)
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
                        value={common.productReturned}
                        onChange={(e) =>
                          setCommonField("productReturned", e.target.value)
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
                value={common.customerRefund}
                onChange={(e) =>
                  setCommonField("customerRefund", e.target.value)
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
                value={common.yardRefund}
                onChange={(e) => setCommonField("yardRefund", e.target.value)}
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
              value={common.amount}
              onChange={(e) => setCommonField("amount", e.target.value)}
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
              value={common.yardAmount}
              onChange={(e) => setCommonField("yardAmount", e.target.value)}
            />
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
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
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

export default DefectiveProductForm;
