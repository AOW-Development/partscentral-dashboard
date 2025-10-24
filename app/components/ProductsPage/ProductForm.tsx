import React, { useState } from "react";

interface MediaFile extends File {}

const ProductForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [heading1, setHeading1] = useState("");
  const [heading2, setHeading2] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [engineType, setEngineType] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  return (
    <div className="md:col-span-2 space-y-6 bg-[#0A2540] p-4 rounded-lg">
      {/* Title */}
      <div>
        <label className="block text-base mb-2">Title</label>
        <input
          type="text"
          placeholder="Engines"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3"
        />
      </div>

      {/* Heading 1 & 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-base mb-2">Heading 1</label>
          <input
            type="text"
            value={heading1}
            onChange={(e) => setHeading1(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-base mb-2">Heading 2</label>
          <input
            type="text"
            value={heading2}
            onChange={(e) => setHeading2(e.target.value)}
            className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-base mb-2">Description</label>

        {/* Rich Text Editor Toolbar */}
        <div className="bg-[#103245] rounded-t-lg border-b border-gray-600 px-4 py-2 flex items-center gap-2">
          <select className="bg-[#103245] text-white text-sm rounded px-2 py-1">
            <option>Paragraph</option>
          </select>
          <div className="flex items-center gap-1 ml-2">
            <button className="p-1 hover:bg-gray-600 rounded text-white">
              <strong>B</strong>
            </button>
            <button className="p-1 hover:bg-gray-600 rounded text-white">
              <em>I</em>
            </button>
            <button className="p-1 hover:bg-gray-600 rounded text-white">
              <u>U</u>
            </button>
            <button className="p-1 hover:bg-gray-600 rounded text-white">
              A
            </button>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button className="p-1 hover:bg-gray-600 rounded text-white">
              ≡
            </button>
            <button className="p-1 hover:bg-gray-600 rounded text-white">
              🔗
            </button>
            <button className="p-1 hover:bg-gray-600 rounded text-white">
              📷  
            </button>
            <button className="p-1 hover:bg-gray-600 rounded text-white">
              📹
            </button>
          </div>
          <button className="p-1 hover:bg-gray-600 rounded ml-auto text-white">
            ⋯
          </button>
          <button className="p-1 hover:bg-gray-600 rounded text-white">
            &lt;/&gt;
          </button>
        </div>

        <textarea
          rows={6}
          className="w-full text-base bg-[#103245] text-white rounded-b-lg px-4 py-3 border-0"
          placeholder="Write description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Media */}
      <div>
        <label className="block text-base mb-2">Media</label>
        <div className="bg-[#103245] text-white rounded-lg px-4 py-6 text-center border border-dashed border-gray-600">
          <input
            type="file"
            className="hidden"
            id="mediaUpload"
            onChange={(e) => {
              setFiles(e.target.files);
            }}
            accept="image/*,video/*,model/*"
            multiple
          />
          <div className="flex gap-2 justify-center mb-2">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm">
              <label htmlFor="mediaUpload" className="cursor-pointer">
                Upload New
              </label>
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white text-sm">
              Select existing
            </button>
          </div>
          <div className="text-xs text-gray-400">
            Accepts images, videos, or 3D models
          </div>
          {files && files.length > 0 && (
            <div className="mt-4 text-left">
              <div className="text-xs text-gray-300 mb-1">Selected files:</div>
              <ul className="text-xs text-white list-disc pl-4">
                {Array.from(files).map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-base mb-1">Category</label>
        <select
          value={engineType}
          onChange={(e) => setEngineType(e.target.value)}
          className="w-full text-base bg-[#103245] text-white rounded-lg px-4 py-3"
        >
          <option>Choose the product category</option>
          <option>Engine</option>
          <option>Transmission</option>
        </select>
      </div>

      {/* Pricing */}
      <div className=" p-4">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Selling Price</label>
            <input
              type="text"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full bg-[#103245] px-4 py-2 rounded text-white"
              placeholder="$ 0.00"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Discount Percentage</label>
            <input
              type="text"
              className="w-full bg-[#103245] px-4 py-2 rounded text-white"
              placeholder="0%"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
          </div>
        </div>
        <label className="block text-sm mb-1">Discount Price</label>
        <div className="flex items-center gap-4">
          <input
            type="text"
            className="w-1/3 bg-[#103245] px-4 py-2 rounded text-white"
            placeholder="$ 0.00"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
