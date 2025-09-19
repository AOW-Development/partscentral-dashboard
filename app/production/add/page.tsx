"use client";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import ProtectRoute from "@/app/components/ProtectRoute";
import { useState } from "react";
import Link from "next/link";
import ProductForm from "@/app/components/ProductsPage/ProductForm";
import ItemForm from "@/app/components/ProductsPage/ItemForm";
import SeoSection from "@/app/components/ProductsPage/SeoSection";
import MarketingSection from "@/app/components/ProductsPage/MarketingSection";

export default function Page() {
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [googleProductCategory, setGoogleProductCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [customLabel1, setCustomLabel1] = useState("");
  const [customLabel2, setCustomLabel2] = useState("");
  const [customLabel3, setCustomLabel3] = useState("");
  const [customLabel4, setCustomLabel4] = useState("");
  const [itemGroupId, setItemGroupId] = useState("");
  const [promotionId, setPromotionId] = useState("");
  const [gender, setGender] = useState("Male");
  const [googleProductHighlights, setGoogleProductHighlights] = useState("");
  const [displayInGoogleFeed, setDisplayInGoogleFeed] = useState("Yes");
  const [displayProductGoogleComments, setDisplayProductGoogleComments] =
    useState("Yes");
  return (
    <ProtectRoute>
      <div className="min-h-screen bg-main text-white font-exo">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="pt-6 px-4 md:px-8 pb-12">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-6">
              <div className="flex-1 min-w-[220px] sm:min-w-[300px]">
                <div className="relative h-[60px] mt-24 md:mt-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="search"
                    className="bg-[#091e36] rounded-lg pl-10 pr-4 w-full md:w-[30%] h-full text-white placeholder-gray-400 focus:outline-none cursor-text"
                  />
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            <nav className="font-medium mb-6 space-x-1">
              <span className="font-semibold text-white">Production</span>
              <span>&gt;</span>
              <span className="font-normal text-white/60">Add Product</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Panel */}
              <ProductForm />

              {/* Right Panel */}
              <ItemForm />
            </div>

            {/* Seo & Meta Section */}
            <SeoSection
              slug={slug}
              setSlug={setSlug}
              metaTitle={metaTitle}
              setMetaTitle={setMetaTitle}
              metaDescription={metaDescription}
              setMetaDescription={setMetaDescription}
            />

            {/* Marketing Strategy Section */}
            <MarketingSection
              googleProductCategory={googleProductCategory}
              setGoogleProductCategory={setGoogleProductCategory}
              productType={productType}
              setProductType={setProductType}
              customLabel1={customLabel1}
              setCustomLabel1={setCustomLabel1}
              customLabel2={customLabel2}
              setCustomLabel2={setCustomLabel2}
              customLabel3={customLabel3}
              setCustomLabel3={setCustomLabel3}
              customLabel4={customLabel4}
              setCustomLabel4={setCustomLabel4}
              itemGroupId={itemGroupId}
              setItemGroupId={setItemGroupId}
              promotionId={promotionId}
              setPromotionId={setPromotionId}
              gender={gender}
              setGender={setGender}
              googleProductHighlights={googleProductHighlights}
              setGoogleProductHighlights={setGoogleProductHighlights}
              displayInGoogleFeed={displayInGoogleFeed}
              setDisplayInGoogleFeed={setDisplayInGoogleFeed}
              displayProductGoogleComments={displayProductGoogleComments}
              setDisplayProductGoogleComments={setDisplayProductGoogleComments}
            />

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white text-base rounded-lg">
                Save
              </button>
            </div>
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
