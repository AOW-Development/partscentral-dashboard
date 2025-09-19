import React, { useState } from "react";

const ItemForm: React.FC = () => {
  const [stock, setStock] = useState("Instock");
  const [stockNumber, setStockNumber] = useState("");
  const [make, setMake] = useState("Ford");
  const [model, setModel] = useState("Aspire");
  const [year, setYear] = useState("2024");
  const [parts, setParts] = useState("Engines");
  const [specification, setSpecification] = useState("Engines");
  const [warranty, setWarranty] = useState("Warranty");
  const [milesPromised, setMilesPromised] = useState("Miles Promised");

  return (
    <div className="space-y-6">
      {/* Stocks */}
      <div className="bg-[#0A2540] p-4 rounded-lg">
        <label className="block text-base mb-2">Stocks</label>
        <select
          className="w-full bg-[#103245] text-white rounded-lg px-4 py-3 mb-3"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        >
          <option>Instock</option>
          <option>Outstock</option>
        </select>
        <div>
          <label className="block text-base mb-2">No.of Stocks</label>
          <input
            type="number"
            value={stockNumber}
            onChange={(e) => setStockNumber(e.target.value)}
            className="w-full bg-[#103245] text-white rounded-lg px-4 py-3"
            placeholder="0"
          />
        </div>
      </div>

      {/* Organization */}
      <div className="bg-[#0A2540] p-4 rounded-lg">
        <h3 className="text-base font-semibold mb-4">Organization</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-base mb-2">Make</label>
            <select
              className="w-full bg-[#103245] text-white rounded-lg px-4 py-3"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            >
              <option>Ford</option>
              <option>Toyota</option>
              <option>Honda</option>
            </select>
          </div>
          <div>
            <label className="block text-base mb-2">Model</label>
            <select
              className="w-full bg-[#103245] text-white rounded-lg px-4 py-3"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option>Aspire</option>
              <option>Focus</option>
              <option>Mustang</option>
            </select>
          </div>
          <div>
            <label className="block text-base mb-2">Year</label>
            <select
              className="w-full bg-[#103245] text-white rounded-lg px-4 py-3"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <div>
            <label className="block text-base mb-2">Parts</label>
            <select
              className="w-full bg-[#103245] text-white rounded-lg px-4 py-3"
              value={parts}
              onChange={(e) => setParts(e.target.value)}
            >
              <option>Engines</option>
              <option>Transmission</option>
              <option>Brakes</option>
            </select>
          </div>
          <div>
            <label className="block text-base mb-2">Specification</label>
            <select
              className="w-full bg-[#103245] text-white rounded-lg px-4 py-3"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
            >
              <option>Engines</option>
              <option>V6</option>
              <option>V8</option>
            </select>
          </div>
        </div>
      </div>

      {/* Warranty */}
      <div className="bg-[#0A2540] p-4 rounded-lg">
        <label className="block text-base mb-2">Warranty</label>
        <select
          className="w-full bg-[#103245] text-white rounded-lg px-4 py-3"
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
        >
          <option>Warranty</option>
          <option>1 Year</option>
          <option>2 Years</option>
          <option>3 Years</option>
        </select>
      </div>
      <div className="bg-[#0A2540] p-4 rounded-lg">
        <label className="block text-base mb-2">Miles Promised</label>
        <select
          className="w-full bg-[#103245] text-white rounded-lg px-4 py-3"
          value={milesPromised}
          onChange={(e) => setMilesPromised(e.target.value)}
        >
          <option>Miles Promised</option>
          <option>30 days</option>
          <option>60 days</option>
          <option>90 days</option>
          <option>6 months</option>
          <option>1 Year</option>
        </select>
      </div>
    </div>
  );
};

export default ItemForm;
