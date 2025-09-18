import React from "react";

interface PaymentEntry {
  id: number;
  merchantMethod: string;
  totalPrice: string;
  approvalCode: string;
  charged: string;
  chargeClicked?: boolean;
}

interface MerchantInfoProps {
  paymentEntries: PaymentEntry[];
  isLoading: boolean;
  formData: { entity: string };
  handlePaymentEntryChange: (
    id: number,
    field: keyof PaymentEntry,
    value: string
  ) => void;
  handleInputChange: (field: string, value: string) => void;
  handleCharge: (id: number) => void;
  removePaymentEntry: (id: number) => void;
  addPaymentEntry: () => void;
  ChevronDown: React.ElementType;
  X: React.ElementType;
  Plus: React.ElementType;
}

const MerchantInfo: React.FC<MerchantInfoProps> = ({
  paymentEntries,
  isLoading,
  formData,
  handlePaymentEntryChange,
  handleInputChange,
  handleCharge,
  removePaymentEntry,
  addPaymentEntry,
  ChevronDown,
  X,
  Plus,
}) => {
  return (
    <div className="space-y-6">
      {paymentEntries.map((entry, index) => (
        <div
          key={entry.id}
          className="relative bg-[#0f1e35] p-4 rounded-lg border border-gray-700"
        >
          {index > 0 && (
            <button
              onClick={() => removePaymentEntry(entry.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove payment"
            >
              <X size={16} />
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Merchant Method
              </label>
              <div className="relative">
                <select
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                  value={entry.merchantMethod}
                  onChange={(e) =>
                    handlePaymentEntryChange(
                      entry.id,
                      "merchantMethod",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select merchant</option>
                  <option>Paypal</option>
                  <option>Wire Transfer</option>
                  <option>Zelle</option>
                  <option>EMS</option>
                  <option>EPX</option>
                  <option>CLOVER</option>
                  <option>MAVRICK</option>
                  <option>ALTRUPAY</option>
                  <option>Stripe</option>
                  {/* <option>Bank Transfer</option> */}
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>Other</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                  size={16}
                />
              </div>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Total Price
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Total Price"
                value={entry.totalPrice}
                onChange={(e) =>
                  handlePaymentEntryChange(
                    entry.id,
                    "totalPrice",
                    e.target.value
                  )
                }
                 onBlur={(e) => {
              let value = e.target.value.trim();
              if (value !== "" && !isNaN(Number(value))) {
                // Format to 2 decimal places
                const formatted = parseFloat(value).toFixed(2);
                handlePaymentEntryChange(entry.id, "totalPrice", formatted);
              }
            }}
              />
            </div>
            <div>
              <button
                className={`cursor-pointer w-full mt-7 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#006BA9] hover:bg-[#006BA9]/90"
                } text-white`}
                onClick={() => handleCharge(entry.id)}
                disabled={isLoading}
              >
                {entry.chargeClicked ? "Re-charge" : "Charge"}
              </button>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Approval Code
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter approval code"
                value={entry.approvalCode}
                onChange={(e) =>
                  handlePaymentEntryChange(
                    entry.id,
                    "approvalCode",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Entity</label>
              <div className="relative">
                <select
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                  value={formData.entity}
                  onChange={(e) => handleInputChange("entity", e.target.value)}
                >
                  <option value="">Select entity</option>
                  <option>WY</option>
                  <option>IL</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                  size={16}
                />
              </div>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Charged
              </label>
              <input
                type="text"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter charged status"
                value={entry.charged}
                onChange={(e) =>
                  handlePaymentEntryChange(entry.id, "charged", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={addPaymentEntry}
          className="flex items-center gap-2 bg-[#006BA9] hover:bg-[#006BA9]/90 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add Payment
        </button>
      </div>
    </div>
  );
};

export default MerchantInfo;
