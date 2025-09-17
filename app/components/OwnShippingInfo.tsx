import React from "react";

interface OwnShippingInfoProps {
  formData: {
    ownShippingInfo: {
      productType: string;
      packageType: string;
      weight: string;
      dimensions: string;
      pickUpDate: string;
      carrier: string;
      price: string;
      variance: string;
      bolNumber: string;
      totalBuy: string;
    };
  };
  
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleCreateBOL: () => void;
  ChevronDown: React.ElementType;
}
const OwnShippingInfo: React.FC<OwnShippingInfoProps> = ({ formData, setFormData, handleCreateBOL, ChevronDown }) => {
  const formatToTwoDecimals = (value: string): string => {
    if (!value || value === "") return ""
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return value
    return numValue.toFixed(2)
  }

  // const handleNumericChange = (field: string, value: string) => {
  //   // Allow typing decimal numbers but format on blur
  //   setFormData((prev: any) => ({
  //     ...prev,
  //     ownShippingInfo: {
  //       ...prev.ownShippingInfo,
  //       [field]: value,
  //     },
  //   }))
  // }

  const handleNumericBlur = (field: string, value: string) => {
    const formattedValue = formatToTwoDecimals(value)
    setFormData((prev: any) => ({
      ...prev,
      ownShippingInfo: {
        ...prev.ownShippingInfo,
        [field]: formattedValue,
      },
    }))
  }
  return (
    <>
      <h3 className="text-white text-lg font-semibold mb-4">
        Own Shipping Info
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#FFFFFF33] rounded-lg p-2 my-4">
        {/* Product Type */}
        <div>
          <label className="block text-white/60 text-sm mb-2">
            Product type
          </label>
          <div className="relative">
            <select
              className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
              value={formData.ownShippingInfo.productType}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  ownShippingInfo: {
                    ...prev.ownShippingInfo,
                    productType: e.target.value,
                  },
                }))
              }
            >
              <option value="">Select Product Type</option>
              <option>LTL</option>
              <option>Parcel</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
              size={16}
            />
          </div>
        </div>
        {/* Package Type */}
        <div>
          <label className="block text-white/60 text-sm mb-2">
            Package type
          </label>
          <div className="relative">
            <select
              className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
              value={formData.ownShippingInfo.packageType}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  ownShippingInfo: {
                    ...prev.ownShippingInfo,
                    packageType: e.target.value,
                  },
                }))
              }
            >
              <option value="">Select Package Type</option>
              <option>Pallet</option>
              <option>Box</option>
              <option>Crate</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
              size={16}
            />
          </div>
        </div>
        {/* Weight */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Weight</label>
          <input
            type="number"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter weight"
            value={formData.ownShippingInfo.weight}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                ownShippingInfo: {
                  ...prev.ownShippingInfo,
                  weight: e.target.value,
                },
              }))
            }
          />
        </div>
        {/* Dimensions */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Dimensions</label>
          <input
            type="number"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter dimensions"
            value={formData.ownShippingInfo.dimensions}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                ownShippingInfo: {
                  ...prev.ownShippingInfo,
                  dimensions: e.target.value,
                },
              }))
            }
          />
        </div>
        {/* Pick Up Date */}
        <div>
          <label className="block text-white/60 text-sm mb-2">
            Pick Up Date
          </label>
          <input
            type="date"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter pick up date"
            value={formData.ownShippingInfo.pickUpDate}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                ownShippingInfo: {
                  ...prev.ownShippingInfo,
                  pickUpDate: e.target.value,
                },
              }))
            }
          />
        </div>
        {/* Carrier */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Carrier</label>
          <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter carrier"
            value={formData.ownShippingInfo.carrier}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                ownShippingInfo: {
                  ...prev.ownShippingInfo,
                  carrier: e.target.value,
                },
              }))
            }
          />
        </div>
        {/* Price */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Price</label>
          <input
            type="number"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter price"
            value={formData.ownShippingInfo.price}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                ownShippingInfo: {
                  ...prev.ownShippingInfo,
                  price: e.target.value,
                },
              }))
              
            }
            onBlur={(e) => handleNumericBlur("price", e.target.value)}
            
          />
        </div>
        {/* Variance */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Variance</label>
          <input
            type="number"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter variance"
            value={formData.ownShippingInfo.variance}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                ownShippingInfo: {
                  ...prev.ownShippingInfo,
                  variance: e.target.value,
                },
              }))
            }
             onBlur={(e) => handleNumericBlur("variance", e.target.value)}
          />
        </div>
          <div>
          <label className="block text-white/60 text-sm mb-2">Total Buy</label>
          <input
            type="number"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter total buy"
            value={formData.ownShippingInfo.totalBuy}
          />
          
        </div>
        {/* Create BOL Button */}
        <div className="flex justify-end">
          <button
            onClick={handleCreateBOL}
            className="bg-[#006BA9] hover:bg-[#006BA9]/90 cursor-pointer mt-8 w-40 h-10 px-2 py-2 text-white  rounded-lg font-medium transition-colors"
          >
            Create BOL
          </button>
        </div>
        {/* BOL Number */}
        <div>
          <label className="block text-white/60 text-sm mb-2">BOL Number</label>
          <input
            type="text"
            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter BOL number"
            value={formData.ownShippingInfo.bolNumber}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                ownShippingInfo: {
                  ...prev.ownShippingInfo,
                  bolNumber: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>
      {/* Total Buy */}
    </>
  );
};

export default OwnShippingInfo;
