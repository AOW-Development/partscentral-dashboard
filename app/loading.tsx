// create a loader that matches the login page
"use client";
import React from "react";
// import { Loader2 } from "lucide-react";
import { LineWave } from "react-loader-spinner";
export default function Loading() {
  return (
    <div className="flex items-center flex-col justify-center h-screen bg-gradient-to-br from-[#07182C] to-[#03101E]">
      {/* <Loader2 className="w-10 h-10 animate-spin text-white" /> */}
      <LineWave
        height="120"
        width="120"
        color="#ffffff"
        ariaLabel="line-wave"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        firstLineColor="#ffffff"
        middleLineColor="#ffffff"
        lastLineColor="#ffffff"

        // barStyle={{}}
        // barWidth={5}
        // barHeight={5}
      />
      <span className="text-white text-2xl mr-7">Loading...</span>
    </div>
  );
}
