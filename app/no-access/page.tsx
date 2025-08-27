"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { URL } from "@/utils//imageUrl";

// import { Exo } from "next/font/google";
// const exo = Exo({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });
export default function LoginPage() {
  const router = useRouter();
  const handleSubmit = () => {
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-main text-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-6 bg-secondary flex items-center justify-start shadow-md">
        {/* <h2 className="text-xl font-bold tracking-wide">Login</h2> */}
        <Image
          src={`${URL}header-3.png`}
          alt="Logo"
          width={200}
          height={60}
          className="w-[160px] h-[28px] md:w-[200px] md:h-[30px]"
        />
      </header>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center border border-gray-700 rounded-lg bg-secondary px-5 py-10 md:py-15 md:px-20 w-full md:w-1/3 mx-auto mt-10">
          <h1 className="text-3xl font-bold mb-6 font-audiowide">No Access</h1>
          <p className="text-lg font-medium mb-6">
            You do not have access to this page.
          </p>
          <button
            type="button"
            className="bg-hover cursor-pointer hover:bg-[#0075ff] w-full py-2 rounded-lg text-white font-semibold  transition-colors disabled:opacity-60"
            onClick={handleSubmit}
          >
            Go Back
          </button>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-10 px-6 bg-secondary text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} PartsCentral Dashboard. All rights
        reserved.
      </footer>
    </div>
  );
}
