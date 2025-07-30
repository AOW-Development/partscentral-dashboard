"use client";
import Image from "next/image";
import React from "react";

import { URL } from "@/utils//imageUrl";
import Link from "next/link";
export default function NotFoundPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-audiowide">
            Page Not Found
          </h1>
          {/* <p className="text-lg md:text-xl text-gray-300 mb-6">
            The page you are looking for does not exist.
          </p> */}
          {/* <Image
            src={`${URL}not-found.png`}
            alt="Not Found"
            width={300}
            height={200}
            className="w-[250px] h-[150px] md:w-[300px] md:h-[200px]"
          /> */}
          <div className="mt-6">
            {/* <button
              onClick={() => window.history.back()}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded cursor-pointer"
            > */}
            <Link href="/">
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded cursor-pointer">
                Go Back
              </button>
            </Link>
          </div>
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
