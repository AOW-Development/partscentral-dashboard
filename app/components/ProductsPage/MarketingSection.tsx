import React from "react";

interface MarketingSectionProps {
  googleProductCategory: string;
  setGoogleProductCategory: (value: string) => void;
  productType: string;
  setProductType: (value: string) => void;
  customLabel1: string;
  setCustomLabel1: (value: string) => void;
  customLabel2: string;
  setCustomLabel2: (value: string) => void;
  customLabel3: string;
  setCustomLabel3: (value: string) => void;
  customLabel4: string;
  setCustomLabel4: (value: string) => void;
  itemGroupId: string;
  setItemGroupId: (value: string) => void;
  promotionId: string;
  setPromotionId: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  googleProductHighlights: string;
  setGoogleProductHighlights: (value: string) => void;
  displayInGoogleFeed: string;
  setDisplayInGoogleFeed: (value: string) => void;
  displayProductGoogleComments: string;
  setDisplayProductGoogleComments: (value: string) => void;
}

const MarketingSection: React.FC<MarketingSectionProps> = ({
  googleProductCategory,
  setGoogleProductCategory,
  productType,
  setProductType,
  customLabel1,
  setCustomLabel1,
  customLabel2,
  setCustomLabel2,
  customLabel3,
  setCustomLabel3,
  customLabel4,
  setCustomLabel4,
  itemGroupId,
  setItemGroupId,
  promotionId,
  setPromotionId,
  gender,
  setGender,
  googleProductHighlights,
  setGoogleProductHighlights,
  displayInGoogleFeed,
  setDisplayInGoogleFeed,
  displayProductGoogleComments,
  setDisplayProductGoogleComments,
}) => {
  return (
    <div className="md:w-[65%] mt-8 bg-[#0A2540] p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-white">
        Marketing Strategy
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Product Category */}
        <div>
          <label className="block text-base mb-2 text-white">
            Google Product Category
          </label>
          <input
            type="text"
            value={googleProductCategory}
            onChange={(e) => setGoogleProductCategory(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-base mb-2 text-white">
            Product Type
          </label>
          <input
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Custom Label 1 */}
        <div>
          <label className="block text-base mb-2 text-white">
            Custom Label 1
          </label>
          <input
            type="text"
            value={customLabel1}
            onChange={(e) => setCustomLabel1(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Custom Label 2 */}
        <div>
          <label className="block text-base mb-2 text-white">
            Custom Label 2
          </label>
          <input
            type="text"
            value={customLabel2}
            onChange={(e) => setCustomLabel2(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Custom Label 3 */}
        <div>
          <label className="block text-base mb-2 text-white">
            Custom Label 3
          </label>
          <input
            type="text"
            value={customLabel3}
            onChange={(e) => setCustomLabel3(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Custom Label 4 */}
        <div>
          <label className="block text-base mb-2 text-white">
            Custom Label 4
          </label>
          <input
            type="text"
            value={customLabel4}
            onChange={(e) => setCustomLabel4(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Item Group ID */}
        <div>
          <label className="block text-base mb-2 text-white">
            Item Group ID
          </label>
          <input
            type="text"
            value={itemGroupId}
            onChange={(e) => setItemGroupId(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Promotion ID */}
        <div>
          <label className="block text-base mb-2 text-white">
            Promotion ID
          </label>
          <input
            type="text"
            value={promotionId}
            onChange={(e) => setPromotionId(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-base mb-2 text-white">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Unisex</option>
          </select>
        </div>

        {/* Google Product Highlights */}
        <div>
          <label className="block text-base mb-2 text-white">
            Google Product Highlights
          </label>
          <input
            type="text"
            value={googleProductHighlights}
            onChange={(e) => setGoogleProductHighlights(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3 placeholder-gray-400"
          />
        </div>

        {/* Display in Google Feed */}
        <div>
          <label className="block text-base mb-2 text-white">
            Display in Google Feed
          </label>
          <select
            value={displayInGoogleFeed}
            onChange={(e) => setDisplayInGoogleFeed(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3"
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Display Product Google Comments */}
        <div>
          <label className="block text-base mb-2 text-white">
            Display Product Google Comments
          </label>
          <select
            value={displayProductGoogleComments}
            onChange={(e) => setDisplayProductGoogleComments(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3"
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MarketingSection;
