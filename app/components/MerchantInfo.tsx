import React from "react";

interface PaymentEntry {
  id: number;
  merchantMethod: string;
  totalPrice: string;
  approvalCode: string;
  charged: string;
  cardChargedDate: string;
  entity: string;
  chargeClicked?: boolean;
}

interface MerchantInfoProps {
  paymentEntries: PaymentEntry[];
  isLoading: boolean;
  formData: { entity: string; totalSellingPrice: string | number };
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
  // Calculate total selling price and paid amounts
  const totalSellingPrice = parseFloat(
    formData.totalSellingPrice?.toString() || "0"
  );
  const totalPaidAmount = paymentEntries.reduce((sum, entry) => {
    return sum + parseFloat(entry.totalPrice || "0");
  }, 0);
  const remainingAmount = totalSellingPrice - totalPaidAmount;

  // Handle payment amount change with validation
  const handlePaymentAmountChange = (entryId: number, newAmount: string) => {
    const numericAmount = parseFloat(newAmount || "0");
    const currentEntry = paymentEntries.find((entry) => entry.id === entryId);
    const currentEntryAmount = parseFloat(currentEntry?.totalPrice || "0");

    // Calculate remaining amount excluding current entry
    const otherEntriesTotal = totalPaidAmount - currentEntryAmount;
    const availableAmount = totalSellingPrice - otherEntriesTotal;

    // Allow the change if it doesn't exceed available amount
    if (numericAmount <= availableAmount || newAmount === "") {
      handlePaymentEntryChange(entryId, "totalPrice", newAmount);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-[#0a1929] p-4 rounded-lg border border-gray-600">
        <h3 className="text-white text-lg font-semibold mb-3">
          Payment Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-white/60">Total Order Amount:</span>
            <div className="text-white font-medium">
              ${totalSellingPrice.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-white/60">Total Paid:</span>
            <div className="text-white font-medium">
              ${totalPaidAmount.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-white/60">Remaining:</span>
            <div
              className={`font-medium ${
                remainingAmount > 0
                  ? "text-red-400"
                  : remainingAmount < 0
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              ${remainingAmount.toFixed(2)}
              {remainingAmount < 0 && " (Overpaid)"}
            </div>
          </div>
        </div>
      </div>

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
                  <option>Wells Fargo</option>
                  <option>Netevia</option>
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
                {remainingAmount > 0 && (
                  <span className="text-blue-400 ml-2">
                    (Max: $
                    {(
                      parseFloat(entry.totalPrice || "0") + remainingAmount
                    ).toFixed(2)}
                    )
                  </span>
                )}
              </label>
              <input
                type="text"
                className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                  parseFloat(entry.totalPrice || "0") >
                  parseFloat(entry.totalPrice || "0") + remainingAmount
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-blue-500"
                }`}
                placeholder="Total Price"
                value={entry.totalPrice}
                onChange={(e) =>
                  handlePaymentAmountChange(entry.id, e.target.value)
                }
                onBlur={(e) => {
                  let value = e.target.value.trim();
                  if (value !== "" && !isNaN(Number(value))) {
                    // Format to 2 decimal places
                    const formatted = parseFloat(value).toFixed(2);
                    handlePaymentAmountChange(entry.id, formatted);
                  }
                }}
              />
              {parseFloat(entry.totalPrice || "0") > 0 &&
                remainingAmount < 0 && (
                  <p className="text-yellow-400 text-xs mt-1">
                    Warning: Total payments exceed order amount
                  </p>
                )}
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
                  value={entry.entity}
                  onChange={(e) =>
                    handlePaymentEntryChange(entry.id, "entity", e.target.value)
                  }
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
                Card Charged Date
              </label>
              <input
                type="date"
                className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter card charged date"
                value={entry.cardChargedDate}
                // value=""
                onChange={(e) =>
                  handlePaymentEntryChange(
                    entry.id,
                    "cardChargedDate",
                    e.target.value
                  )
                }
              />
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

      <div className="flex justify-between items-center">
        <div className="text-sm text-white/60">
          {remainingAmount > 0 && (
            <span>
              Remaining to pay:{" "}
              <span className="text-white font-medium">
                ${remainingAmount.toFixed(2)}
              </span>
            </span>
          )}
          {remainingAmount === 0 && (
            <span className="text-green-400">✓ Fully paid</span>
          )}
          {remainingAmount < 0 && (
            <span className="text-yellow-400">
              ⚠ Overpaid by ${Math.abs(remainingAmount).toFixed(2)}
            </span>
          )}
        </div>
        <button
          onClick={addPaymentEntry}
          disabled={remainingAmount <= 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            remainingAmount > 0
              ? "bg-[#006BA9] hover:bg-[#006BA9]/90 text-white cursor-pointer"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Plus size={18} />
          Add Payment
          {remainingAmount > 0 && (
            <span className="text-xs">
              ($${remainingAmount.toFixed(2)} left)
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MerchantInfo;
