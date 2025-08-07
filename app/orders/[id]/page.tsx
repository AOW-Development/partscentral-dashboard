"use client";
import Header from "@/app/components/Header";
import ProtectRoute from "@/app/components/ProtectRoute";
import Sidebar from "@/app/components/Sidebar";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import React from "react"; // Added missing import for React

const OrderDetails = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    sellingPrice: "",
    shippingAddressType: "",
    shippingAddress: "",
    billingAddress: "",
    cardHolderName: "",
    cardNumber: "",
    cardDate: "",
    cardCvv: "",
    warranty: "",
    milesPromised: "",
    make: "",
    model: "",
    year: "",
    parts: "",
    specification: "",
    merchantMethod: "",
    approvalCode: "",
    entity: "",
    charged: "",
    saleMadeBy: "",
    yardName: "",
    yardMobile: "",
    yardAddress: "",
    yardEmail: "",
    yardPrice: "",
    yardWarranty: "",
    yardMiles: "",
    yardShipping: "",
    yardCost: "",
    pictureStatus: "",
    trackingNumber: "",
  });

  // Field-specific error states
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate individual field
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "email":
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return "";

      case "mobile":
        if (!value) return "Mobile number is required";
        if (value.length < 10)
          return "Mobile number must be at least 10 digits";
        return "";

      case "sellingPrice":
        if (!value) return "Selling price is required";
        if (isNaN(Number(value)) || Number(value) <= 0)
          return "Please enter a valid price";
        return "";

      case "shippingAddress":
        if (!value) return "Shipping address is required";
        if (value.length < 10)
          return "Please enter a complete shipping address";
        return "";

      case "billingAddress":
        if (!value) return "Billing address is required";
        if (value.length < 10) return "Please enter a complete billing address";
        return "";

      case "make":
        if (!value) return "Make is required";
        return "";

      case "model":
        if (!value) return "Model is required";
        return "";

      case "year":
        if (!value) return "Year is required";
        const currentYear = new Date().getFullYear();
        if (
          isNaN(Number(value)) ||
          Number(value) < 1900 ||
          Number(value) > currentYear + 1
        ) {
          return "Please enter a valid year";
        }
        return "";

      case "parts":
        if (!value) return "Parts is required";
        return "";

      default:
        return "";
    }
  };

  // Validate all required fields
  const validateAllFields = () => {
    const requiredFields = [
      "email",
      "mobile",
      "sellingPrice",
      "shippingAddress",
      "billingAddress",
      "make",
      "model",
      "year",
      "parts",
    ];

    const newErrors: { [key: string]: string } = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof typeof formData]
      );
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setFieldErrors(newErrors);
    return !hasErrors;
  };

  // Send invoice function
  const handleSendInvoice = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Prepare invoice data
      const invoiceData = {
        orderId: "PC#022705", // You can get this from URL params
        customerInfo: {
          name: "Shiva Shankar Reddy",
          email: formData.email,
          mobile: formData.mobile,
          sellingPrice: formData.sellingPrice,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          shippingAddressType: formData.shippingAddressType,
        },
        paymentInfo: {
          cardNumber: formData.cardNumber,
          cardDate: formData.cardDate,
          cardCvv: formData.cardCvv,
          warranty: formData.warranty,
          milesPromised: formData.milesPromised,
        },
        productInfo: {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          parts: formData.parts,
        },
        yardInfo: {
          name: formData.yardName,
          mobile: formData.yardMobile,
          address: formData.yardAddress,
          email: formData.yardEmail,
          price: formData.yardPrice,
          warranty: formData.yardWarranty,
          miles: formData.yardMiles,
          shipping: formData.yardShipping,
        },
        additionalInfo: {
          pictureStatus: formData.pictureStatus,
          trackingNumber: formData.trackingNumber,
        },
      };
      console.log(invoiceData);

      // API call to send invoice
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Invoice sent successfully! Check the email for the invoice.",
        });
        // Update invoice status
        setIsProcessing(false);
      } else {
        throw new Error(result.message || "Failed to send invoice");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to send invoice. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharge = async () => {
    setIsLoading(true);
    console.log("Charging...");
    setIsLoading(false);
  };

  // Clear message after 5 seconds
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  console.log(setIsProcessing);

  // State for previous yards and toggle
  const [showPreviousYard, setShowPreviousYard] = useState(false);
  const [previousYards, setPreviousYards] = useState([
    {
      yardName: "Old Yard Name",
      yardAddress: "Old Address",
      yardMobile: "1234567890",
      yardEmail: "oldyard@email.com",
      yardPrice: "1000",
      yardWarranty: "30 Days",
      yardMiles: "50000",
      yardShipping: "Own Shipping",
      yardCost: "800",
      reason: "Better price from new yard",
    },
  ]);
  const [selectedPrevYardIdx, setSelectedPrevYardIdx] = useState(0);
  console.log(setPreviousYards, setShowPreviousYard);

  return (
    <ProtectRoute>
      <div className="min-h-screen bg-main text-white font-exo py-2">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="pt-[40px] min-h-screen px-4 md:px-8">
            {/* Header with breadcrumb and close button */}
            <div className="flex items-center justify-between mb-20">
              <div className="flex items-center gap-2 text-sm">
                <Link href="/orders">
                  <span className="text-white/60">Orders</span>
                </Link>
                <span className="text-white/60">›</span>
                <span className="text-white">Order Details</span>
              </div>
              <button className="text-white/60 hover:text-white">
                <Link href="/orders">
                  <X size={20} />
                </Link>
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-500/20 border border-green-500 text-green-400"
                    : "bg-red-500/20 border border-red-500 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Customer Profile Section */}
            <div className="bg-[#0a1929] rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="relative flex items-center gap-4">
                  <div className="absolute top-[-60px] left-5 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                    <Image
                      src="/dummyImg.png"
                      alt="Customer"
                      width={120}
                      height={120}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1 mt-20">
                      Shiva Shankar Reddy
                    </h2>
                    <p className="text-white/60 text-sm">ID: PC#022705</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm">27Jun25</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Google
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isProcessing
                        ? "bg-purple-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {isProcessing ? "Processing" : "Completed"}
                  </span>
                  <button className="text-white/60 hover:text-white">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="space-y-8">
                {/* Top Section - Contact & Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Row 1 */}
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                        fieldErrors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-600 focus:border-blue-500"
                      }`}
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                    {fieldErrors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Mobile *
                    </label>
                    <input
                      type="tel"
                      className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                        fieldErrors.mobile
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-600 focus:border-blue-500"
                      }`}
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={(e) =>
                        handleInputChange("mobile", e.target.value)
                      }
                    />
                    {fieldErrors.mobile && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.mobile}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Selling Price *
                    </label>
                    <input
                      type="number"
                      className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                        fieldErrors.sellingPrice
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-600 focus:border-blue-500"
                      }`}
                      placeholder="Enter price"
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        handleInputChange("sellingPrice", e.target.value)
                      }
                    />
                    {fieldErrors.sellingPrice && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.sellingPrice}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Row 2 */}
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Shipping Address Type
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                        value={formData.shippingAddressType}
                        onChange={(e) =>
                          handleInputChange(
                            "shippingAddressType",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select address type</option>
                        <option>Residential</option>
                        <option>Non Residential</option>
                        <option>Terminal</option>
                        <option>Commercial</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Shipping Address *
                    </label>
                    <textarea
                      className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none h-20 resize-none ${
                        fieldErrors.shippingAddress
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-600 focus:border-blue-500"
                      }`}
                      placeholder="Enter shipping address"
                      value={formData.shippingAddress}
                      onChange={(e) =>
                        handleInputChange("shippingAddress", e.target.value)
                      }
                    />
                    {fieldErrors.shippingAddress && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.shippingAddress}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Billing Address *
                    </label>
                    <textarea
                      className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none h-20 resize-none ${
                        fieldErrors.billingAddress
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-600 focus:border-blue-500"
                      }`}
                      placeholder="Enter billing address"
                      value={formData.billingAddress}
                      onChange={(e) =>
                        handleInputChange("billingAddress", e.target.value)
                      }
                    />
                    {fieldErrors.billingAddress && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.billingAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle Section - Payment & Warranty */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-white/60 text-sm mb-2">
                      Card
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Card holder name"
                        value={formData.cardHolderName}
                        onChange={(e) =>
                          handleInputChange("cardHolderName", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          handleInputChange("cardNumber", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Date"
                        value={formData.cardDate}
                        onChange={(e) =>
                          handleInputChange("cardDate", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="CVV"
                        value={formData.cardCvv}
                        onChange={(e) =>
                          handleInputChange("cardCvv", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Warranty
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                        value={formData.warranty}
                        onChange={(e) =>
                          handleInputChange("warranty", e.target.value)
                        }
                      >
                        <option value="">Select warranty</option>
                        <option>30 Days</option>
                        <option>60 Days</option>
                        <option>90 Days</option>
                        <option>6 Months</option>
                        <option>1 Year</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Miles Promised
                    </label>
                    <input
                      type="number"
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Enter miles"
                      value={formData.milesPromised}
                      onChange={(e) =>
                        handleInputChange("milesPromised", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Product Details Section - Before Send Invoice Button */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Make *
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none appearance-none ${
                          fieldErrors.make
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-blue-500"
                        }`}
                        value={formData.make}
                        onChange={(e) =>
                          handleInputChange("make", e.target.value)
                        }
                      >
                        <option value="">Select make</option>
                        {/* <option>Toyota</option>
                        <option>Honda</option> */}
                        <option>Ford</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    {fieldErrors.make && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.make}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Model *
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none appearance-none ${
                          fieldErrors.model
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-blue-500"
                        }`}
                        value={formData.model}
                        onChange={(e) =>
                          handleInputChange("model", e.target.value)
                        }
                      >
                        <option value="">Select model</option>
                        <option>500</option>
                        {/* <option>Honda</option>
                        <option>Ford</option> */}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    {fieldErrors.model && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.model}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Year *
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none appearance-none ${
                          fieldErrors.year
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-blue-500"
                        }`}
                        value={formData.year}
                        onChange={(e) =>
                          handleInputChange("year", e.target.value)
                        }
                      >
                        <option value="">Select year</option>
                        <option>2001</option>
                        <option>2002</option>
                        <option>2003</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    {fieldErrors.year && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.year}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Parts *
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none appearance-none ${
                          fieldErrors.parts
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-blue-500"
                        }`}
                        value={formData.parts}
                        onChange={(e) =>
                          handleInputChange("parts", e.target.value)
                        }
                      >
                        <option value="">Select parts</option>
                        <option>Engine</option>
                        <option>Transmission</option>
                        {/* <option>Ford</option> */}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    {fieldErrors.parts && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.parts}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Specification *
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none appearance-none ${
                          fieldErrors.make
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-blue-500"
                        }`}
                        value={formData.specification}
                        onChange={(e) =>
                          handleInputChange("specification", e.target.value)
                        }
                      >
                        <option value="">Select Specification</option>
                        {/* <option>Toyota</option>
                        <option>Honda</option> */}
                        <option>4.9L</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    {fieldErrors.make && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.make}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Sale Made By
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                        value={formData.saleMadeBy}
                        onChange={(e) =>
                          handleInputChange("saleMadeBy", e.target.value)
                        }
                      >
                        <option value="">Select person</option>
                        <option>Shiva</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                  </div>
                </div>

                {/* Send Invoice Button */}
                <div className="flex justify-end gap-4">
                  <button
                    className={`cursor-pointer mt-8 w-40 h-10 px-2 py-1 rounded-lg font-medium transition-colors ${
                      isLoading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#006BA9] hover:bg-[#006BA9]/90"
                    } text-white`}
                    onClick={handleSendInvoice}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending Invoice..." : "Send Invoice"}
                  </button>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Invoice Status
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3">
                        <span className="text-green-400 text-sm">
                          Invoice Sent
                        </span>
                        <span className="text-white/60 text-xs">
                          27Jun25 7:11pm
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3">
                        <span className="text-green-400 text-sm">
                          Invoice Confirm
                        </span>
                        <span className="text-white/60 text-xs">
                          28Jun25 7:11pm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Status */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Merchant Method
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                        value={formData.merchantMethod}
                        onChange={(e) =>
                          handleInputChange("merchantMethod", e.target.value)
                        }
                      >
                        <option value="">Select merchant</option>
                        <option>Paypal</option>
                        <option>Wire Transfer</option>
                        <option>Zelle</option>
                        <option>EMS</option>
                        <option>EPX</option>
                        <option>CLOVER</option>
                        <option>MAVRICK</option>
                        <option>ALTRUPAY</option>
                        <option>Stripe</option>
                        <option>Bank Transfer</option>
                        <option>Cash</option>
                        <option>Cheque</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className={`cursor-pointer w-full mt-7 px-6 py-3 rounded-lg font-medium transition-colors ${
                        isLoading
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-[#006BA9] hover:bg-[#006BA9]/90"
                      } text-white`}
                      onClick={handleCharge}
                      disabled={isLoading}
                    >
                      {isLoading ? "processing..." : "Charge"}
                    </button>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Approval Code
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Enter approval code"
                      value={formData.approvalCode}
                      onChange={(e) =>
                        handleInputChange("approvalCode", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Entity
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                        value={formData.entity}
                        onChange={(e) =>
                          handleInputChange("entity", e.target.value)
                        }
                      >
                        <option value="">Select entity</option>
                        <option>WY</option>
                        <option>IL</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Charged
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                        value={formData.charged}
                        onChange={(e) =>
                          handleInputChange("charged", e.target.value)
                        }
                      >
                        <option>No</option>
                        <option>Yes</option>
                        {/* <option value="">Select option</option> */}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                  </div>
                </div>
                {/* Yard Info Section */}
                <div className=" p-2 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white text-lg font-semibold">
                      Yard Info
                    </h3>
                    {/* <button
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      onClick={() => setShowPreviousYard((prev) => !prev)}
                    >
                      {showPreviousYard
                        ? "Hide Previous Yard"
                        : "Show Previous Yard"}
                    </button> */}
                  </div>
                  {showPreviousYard && previousYards.length > 0 && (
                    <div className="mb-6 bg-[#222c3a] rounded-lg p-4 border border-blue-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-semibold">
                          Previous Yard Details
                        </span>
                        {previousYards.length > 1 && (
                          <select
                            className="bg-[#0a1929] border border-gray-600 rounded px-2 py-1 text-white text-xs"
                            value={selectedPrevYardIdx}
                            onChange={(e) =>
                              setSelectedPrevYardIdx(Number(e.target.value))
                            }
                          >
                            {previousYards.map((_, idx) => (
                              <option key={idx} value={idx}>
                                Yard #{idx + 1}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Yard Name
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={previousYards[selectedPrevYardIdx].yardName}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={
                              previousYards[selectedPrevYardIdx].yardAddress
                            }
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Mobile
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={
                              previousYards[selectedPrevYardIdx].yardMobile
                            }
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Email
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={previousYards[selectedPrevYardIdx].yardEmail}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Price
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={previousYards[selectedPrevYardIdx].yardPrice}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Warranty
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={
                              previousYards[selectedPrevYardIdx].yardWarranty
                            }
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Miles
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={previousYards[selectedPrevYardIdx].yardMiles}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Shipping
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={
                              previousYards[selectedPrevYardIdx].yardShipping
                            }
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs mb-1">
                            Yard Cost
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={previousYards[selectedPrevYardIdx].yardCost}
                            disabled
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-white/60 text-xs mb-1">
                            Reason
                          </label>
                          <textarea
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
                            value={previousYards[selectedPrevYardIdx].reason}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Current Yard Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FFFFFF33] rounded-lg p-2">
                    {/* Name */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Yard Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Enter name"
                        value={formData.yardName}
                        onChange={(e) =>
                          handleInputChange("yardName", e.target.value)
                        }
                      />
                    </div>
                    {/* Address */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Enter address"
                        value={formData.yardAddress}
                        onChange={(e) =>
                          handleInputChange("yardAddress", e.target.value)
                        }
                      />
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Enter mobile number"
                        value={formData.yardMobile}
                        onChange={(e) =>
                          handleInputChange("yardMobile", e.target.value)
                        }
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Enter email"
                        value={formData.yardEmail}
                        onChange={(e) =>
                          handleInputChange("yardEmail", e.target.value)
                        }
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Enter price"
                        value={formData.yardPrice}
                        onChange={(e) =>
                          handleInputChange("yardPrice", e.target.value)
                        }
                      />
                    </div>

                    {/* Warranty */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Warranty
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                          value={formData.yardWarranty}
                          onChange={(e) =>
                            handleInputChange("yardWarranty", e.target.value)
                          }
                        >
                          <option value="">Select warranty</option>
                          <option>30 Days</option>
                          <option>60 Days</option>
                          <option>90 Days</option>
                          <option>6 Months</option>
                          <option>1 Year</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                          size={16}
                        />
                      </div>
                    </div>

                    {/* Miles */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Miles
                      </label>
                      <input
                        type="number"
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Enter miles"
                        value={formData.yardMiles}
                        onChange={(e) =>
                          handleInputChange("yardMiles", e.target.value)
                        }
                      />
                    </div>

                    {/* Shipping */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Shipping
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                          value={formData.yardShipping}
                          onChange={(e) =>
                            handleInputChange("yardShipping", e.target.value)
                          }
                        >
                          <option value="">Select shipping option</option>
                          <option>Own Shipping</option>
                          <option>Yard Shipping</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                          size={16}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Yard Cost
                      </label>
                      <input
                        type="number"
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Enter yard cost"
                        value={formData.yardCost}
                        onChange={(e) =>
                          handleInputChange("yardCost", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* Send PO Button */}
                <div className="flex justify-end gap-2">
                  <button className="bg-[#006BA9] hover:bg-[#006BA9]/90 cursor-pointer mt-8 w-40 h-10 px-2 py-1 text-white  rounded-lg font-medium transition-colors">
                    Send PO
                  </button>
                  {/* PO Status & Approval/Sales */}
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      PO Status
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3">
                        <span className="text-green-400 text-sm">PO Sent</span>
                        <span className="text-white/60 text-xs">
                          27Jun25 7:11pm
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3">
                        <span className="text-green-400 text-sm">
                          PO Confirm
                        </span>
                        <span className="text-white/60 text-xs">
                          28Jun25 7:11pm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    Picture Status
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Picture Status"
                    value={formData.pictureStatus}
                    onChange={(e) =>
                      handleInputChange("pictureStatus", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Tracking Number"
                    value={formData.trackingNumber}
                    onChange={(e) =>
                      handleInputChange("trackingNumber", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 mb-8">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Save
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Close
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
};

export default OrderDetails;
