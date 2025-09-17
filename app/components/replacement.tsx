// "use client";
// import React, { ChangeEvent, FocusEvent } from "react";
// import { useDamagedProductStore } from "@/store/damagedProductStore";

// const ReplacementForm: React.FC = () => {
//   const { formData, setField } = useDamagedProductStore();

//   const handlePriceBlur = (e: FocusEvent<HTMLInputElement>, field: keyof typeof formData) => {
//     const value = e.target.value;
//     const numberValue = parseFloat(value);
//     if (!isNaN(numberValue)) {
//       setField(field, numberValue.toFixed(2));
//     } else if (value === "") {
//       setField(field, "0.00");
//     }
//   };

//   return (
//     <div className="bg-[#0a1929] p-6 rounded-lg mt-6 shadow-lg">
//       <h3 className="text-white text-lg font-semibold mb-4">Replacement Yard Information</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Example fields */}
//         <div>
//           <label className="block text-white/60 text-sm mb-2">Carrier Name</label>
//           <input
//             type="text"
//             className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-2 text-white"
//             value={formData.carrierName || ""}
//             onChange={(e) => setField("carrierName", e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-white/60 text-sm mb-2">Tracking Number</label>
//           <input
//             type="text"
//             className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-2 text-white"
//             value={formData.trackingNumber || ""}
//             onChange={(e) => setField("trackingNumber", e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-white/60 text-sm mb-2">Estimated Time of Arrival</label>
//           <input
//             type="text"
//             className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-2 text-white"
//             value={formData.eta || ""}
//             onChange={(e) => setField("eta", e.target.value)}
//           />
//         </div>

//         {/* Conditional: Only show if Return Shipping = "own shipping" */}
//         {formData.returnShipping === "own shipping" && (
//           <>
//             <div>
//               <label className="block text-white/60 text-sm mb-2">Replacement Price</label>
//               <input
//                 type="number"
//                 className="w-full bg-[#0d1b2a] border border-gray-600 rounded-lg px-4 py-2 text-white"
//                 value={formData.replacementPrice || ""}
//                 onChange={(e) => setField("replacementPrice", e.target.value)}
//                 onBlur={(e) => handlePriceBlur(e, "replacementPrice")}
//               />
//             </div>
//             {/* Add any other fields you want for own shipping */}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReplacementForm;
