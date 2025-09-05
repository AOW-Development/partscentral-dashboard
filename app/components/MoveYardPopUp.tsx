"use client";
import React, { useState } from "react";

interface MoveYardPopUpProps {
  setStatus: (status: boolean) => void;
  setReason: (reason: string) => void;
}

export default function MoveYardPopUp({
  setStatus,
  setReason,
}: MoveYardPopUpProps) {
  const [reason, setLocalReason] = useState("");

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalReason(e.target.value);
    setReason(e.target.value);
  };

  const handleSubmit = () => {
    setReason(reason.trim());
    console.log("REASON", reason);
    setStatus(false);
  };

  const handleCancel = () => {
    setLocalReason("");
    setReason("");
    setStatus(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-60 transition-opacity duration-300" />
      <div className="relative z-60 bg-[#222c3a] w-full max-w-sm rounded-xl p-6 flex flex-col justify-center items-center gap-4 shadow-2xl border border-blue-800">
        <p className="text-white text-lg font-semibold text-center mb-2">
          Are you sure you want to remove this yard?
        </p>
        <p className="text-white/70 text-sm text-center mb-2">
          If yes, please enter the reason below.
        </p>
        <input
          className="w-full bg-[#0a1929] border border-gray-600 focus:border-blue-500 rounded-lg px-4 py-2 text-white placeholder:text-white/40 outline-none transition-all"
          type="text"
          placeholder="Enter reason"
          value={reason}
          onChange={handleReasonChange}
        />
        <div className="flex w-full gap-3 mt-2">
          <button
            className="flex-1 bg-[#006BA9] hover:bg-[#005b8a] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow hover:shadow-lg"
            onClick={handleSubmit}
            disabled={!reason.trim()}
            style={{
              opacity: reason.trim() ? 1 : 0.6,
              cursor: reason.trim() ? "pointer" : "not-allowed",
            }}
          >
            Submit
          </button>
          <button
            className="flex-1 bg-gray-600 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow hover:shadow-lg"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
