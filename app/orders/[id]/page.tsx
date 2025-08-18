"use client";
import Header from "@/app/components/Header";
import ProtectRoute from "@/app/components/ProtectRoute";
import Sidebar from "@/app/components/Sidebar";
import { ChevronDown, X, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { URL } from "@/utils/imageUrl";
import { createOrderFromAdmin } from "@/utils/orderApi";
import { getCardType, isValidCardNumber } from "@/utils/cardValidator";
import { MAKES, MODELS } from "@/vehicleData-dashboard";
import { fetchYears } from "@/utils/vehicleApi";
import { getProductVariants, GroupedVariant } from "@/utils/productApi";

const OrderDetails = () => {
  // State for product variants
  const [productVariants, setProductVariants] = useState<GroupedVariant[]>([]);
  const [selectedSubpart, setSelectedSubpart] = useState<GroupedVariant | null>(null);
  const [selectedMileage, setSelectedMileage] = useState('');
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [variantError, setVariantError] = useState('');

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    partPrice: "",
    taxesPrice: "",
    handlingPrice: "",
    processingPrice: "",
    corePrice: "",
    shippingAddressType: "",
    company: "",
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
    variantSku: "", // store the selected variant SKU
    totalSellingPrice: "",
    totalPrice: "",
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
    carrierName: "",
    trackingNumber: "",
    notes: "",
  });
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Fetch years when make and model are selected
  useEffect(() => {
    if (formData.make && formData.model) {
      fetchYears(formData.make, formData.model).then(setAvailableYears);
    } else {
      setAvailableYears([]);
    }
  }, [formData.make, formData.model]);

  // Handle mileage selection
  const handleMileageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMiles = e.target.value;
    setSelectedMileage(selectedMiles);
    
    // Find the selected variant and update the SKU in form data
    if (selectedSubpart) {
      const variant = selectedSubpart.variants.find(v => v.miles === selectedMiles);
      if (variant) {
        setFormData(prev => ({
          ...prev,
          milesPromised: selectedMiles,
          variantSku: variant.sku,
          partPrice: variant.discountedPrice?.toString() || variant.actualprice.toString()
        }));
      }
    }
  };

  // Handle specification selection
  const handleSpecificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSpec = e.target.value;
    setFormData(prev => ({
      ...prev,
      specification: selectedSpec,
      variantSku: "",
      milesPromised: ""
    }));
    
    // Find and set the selected subpart
    const subpart = productVariants.find(v => v.subPart.name === selectedSpec) || null;
    setSelectedSubpart(subpart);
    setSelectedMileage("");
  };

  // Fetch product variants when make, model, year, and part are selected
  useEffect(() => {
    const fetchVariants = async () => {
      if (formData.make && formData.model && formData.year && formData.parts) {
        setIsLoadingVariants(true);
        setVariantError('');
        try {
          const data = await getProductVariants({
            make: formData.make,
            model: formData.model,
            year: formData.year,
            part: formData.parts
          });
          setProductVariants(data.groupedVariants || []);
          // Reset selections when variants change
          setSelectedSubpart(null);
          setSelectedMileage('');
          setFormData(prev => ({
            ...prev,
            specification: "",
            variantSku: "",
            milesPromised: ""
          }));
        } catch (error) {
          console.error('Error fetching product variants:', error);
          setVariantError('Failed to load product variants. Please try again.');
          setProductVariants([]);
        } finally {
          setIsLoadingVariants(false);
        }
      } else {
        setProductVariants([]);
      }
    };

    fetchVariants();
  }, [formData.make, formData.model, formData.year, formData.parts]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCompany, setShowCompany] = useState(false);
  const [showOwnShipping, setShowOwnShipping] = useState(false);
  const [showYardShippingCost, setShowYardShippingCost] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Helpers: formatters for card inputs
  const formatCardNumber = (rawValue: string): string => {
    const digitsOnly = rawValue.replace(/\D/g, "").slice(0, 19);
    return digitsOnly.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiryDate = (rawValue: string): string => {
    const digitsOnly = rawValue.replace(/\D/g, "").slice(0, 6);
    if (digitsOnly.length === 0) return "";

    // Ensure month stays between 01-12 when 2 digits are present
    let month = digitsOnly.slice(0, 2);
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum === 0) month = "01";
      else if (monthNum > 12) month = "12";
    }

    if (digitsOnly.length <= 2) return month;

    const rest = digitsOnly.slice(2);
    return `${month}/${rest}`;
  };

  // State for additional price fields visibility
  const [visiblePriceFields, setVisiblePriceFields] = useState<{
    taxesPrice: boolean;
    handlingPrice: boolean;
    processingPrice: boolean;
    corePrice: boolean;
  }>({
    taxesPrice: false,
    handlingPrice: false,
    processingPrice: false,
    corePrice: false,
  });

  const [showPriceOptions, setShowPriceOptions] = useState(false);
  const priceOptionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTotalPrice(
      Number(formData.partPrice) +
        Number(formData.handlingPrice) +
        Number(formData.corePrice) +
        Number(formData.taxesPrice) +
        Number(formData.processingPrice)
    );
    setFormData((prev) => ({
      ...prev,
      totalSellingPrice: totalPrice.toString(),
      totalPrice: totalPrice.toString(),
    }));
  }, [
    totalPrice,
    formData.partPrice,
    formData.handlingPrice,
    formData.corePrice,
    formData.taxesPrice,
    formData.processingPrice,
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showPriceOptions) return;
      const targetNode = event.target as Node;
      if (
        priceOptionsRef.current &&
        priceOptionsRef.current.contains(targetNode)
      ) {
        return;
      }
      setShowPriceOptions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPriceOptions]);

  // Field-specific error states
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Payment entries state for dynamic payment fields
  const [paymentEntries, setPaymentEntries] = useState([
    {
      id: 1,
      merchantMethod: "",
      totalPrice: "",
      approvalCode: "",
      entity: "",
      charged: "",
      chargeClicked: false,
    },
  ]);

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

  // Handle payment entry field changes
  const handlePaymentEntryChange = (
    id: number,
    field: string,
    value: string
  ) => {
    setPaymentEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Add a new payment entry
  const addPaymentEntry = () => {
    setPaymentEntries((prevEntries) => [
      ...prevEntries,
      {
        id: Date.now(), // Use timestamp as unique ID
        merchantMethod: "",
        totalPrice: "",
        approvalCode: "",
        entity: "",
        charged: "",
        chargeClicked: false,
      },
    ]);
  };

  // Remove a payment entry
  const removePaymentEntry = (id: number) => {
    if (paymentEntries.length > 1) {
      setPaymentEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    }
  };

  // Handle price field selection
  const handlePriceFieldSelection = (
    fieldName: keyof typeof visiblePriceFields
  ) => {
    setVisiblePriceFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
    setShowPriceOptions(false);
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

      case "partPrice":
        if (!value) return "Part price is required";
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

      case "cardNumber": {
        if (!value) return ""; // not required, validate only if provided
        if (!isValidCardNumber(value)) return "Enter a valid card number";
        const type = getCardType(value);
        if (!type) return "Unsupported card type";
        return "";
      }

      case "cardCvv": {
        if (!value) return ""; // not required
        if (!/^\d+$/.test(value)) return "CVV must be numeric";
        const type = getCardType(formData.cardNumber);
        const expected = type === "American Express" ? 4 : 3;
        if (value.length !== expected)
          return `CVV must be ${expected} digits${type ? ` for ${type}` : ""}`;
        return "";
      }

      case "cardDate": {
        if (!value) return ""; // not required
        // Accept MM/YY or MM/YYYY
        const match = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.exec(value.trim());
        if (!match) return "Use MM/YY or MM/YYYY";
        const month = parseInt(match[1], 10);
        let year = parseInt(match[2], 10);
        if (year < 100) year += 2000;
        const now = new Date();
        const expEnd = new Date(year, month, 0, 23, 59, 59); // end of month
        if (expEnd < now) return "Card is expired";
        return "";
      }

      default:
        return "";
    }
  };

  // Validate all required fields
  const validateAllFields = () => {
    const requiredFields = [
      "email",
      "mobile",
      "partPrice",
      "shippingAddress",
      "billingAddress",
      "make",
      "model",
      "year",
      "parts",
      "saleMadeBy",

      // "yardName",
      // "yardMobile",
      // "yardAddress",
      // "yardEmail",
      // "yardPrice",
      // "yardWarranty",
      // "yardMiles",
      // "yardShipping",
      // "yardCost",
      // "pictureStatus",
      // "carrierName",
      // "trackingNumber",
      // "notes",
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

    // Validate optional payment fields if provided
    ["cardNumber", "cardDate", "cardCvv"].forEach((field) => {
      const value = formData[field as keyof typeof formData] as string;
      if (value) {
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
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
          partPrice: formData.partPrice,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          shippingAddressType: formData.shippingAddressType,
          company: formData.company,
          totalSellingPrice: formData.totalSellingPrice,
        },
        paymentInfo: {
          cardHolderName: formData.cardHolderName,
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
          specification: formData.specification,
          saleMadeBy: formData.saleMadeBy,
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
        // previousYards: {
        //   name: formData.yardName,
        //   mobile: formData.yardMobile,
        //   address: formData.yardAddress,
        //   email: formData.yardEmail,
        //   price: formData.yardPrice,
        //   warranty: formData.yardWarranty,
        //   miles: formData.yardMiles,
        //   shipping: formData.yardShipping,
        // },
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

  const handleCreateOrder = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      if (!formData.variantSku) {
        alert('Please select a valid specification and mileage');
        return;
      }

      // Create cart items array with the selected part
      const cartItems = [
        {
          id: formData.variantSku, // Use the actual SKU from the selected variant
          name: `${formData.make} ${formData.model} ${formData.year} ${formData.parts}`,
          price: parseFloat(formData.partPrice) || 0,
          quantity: 1,
          warranty: formData.warranty,
          milesPromised: formData.milesPromised,
          specification: formData.specification,
        },
      ];
      const result = await createOrderFromAdmin(formData, cartItems);

      setMessage({
        type: "success",
        text: "Order created successfully!",
      });
      setIsProcessing(false);
      console.log("Order created:", result);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to create order. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharge = async (entryId: number) => {
    setIsLoading(true);
    setPaymentEntries((prev) =>
      prev.map((pe) =>
        pe.id === entryId
          ? {
              ...pe,
              approvalCode: pe.approvalCode || "123456",
              charged: pe.charged || "Yes",
              chargeClicked: true,
            }
          : pe
      )
    );
    setIsLoading(false);
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  console.log(setIsProcessing);

  useEffect(() => {
    if (formData.yardShipping == "Own Shipping") {
      setShowOwnShipping(true);
      setShowYardShippingCost(false);
    } else if (formData.yardShipping == "Yard Shipping") {
      setShowYardShippingCost(true);
      setShowOwnShipping(false);
    } else {
      setShowYardShippingCost(false);
      setShowOwnShipping(false);
    }
  }, [formData.yardShipping]);

  // State for previous yards and toggle
  const [showPreviousYard, setShowPreviousYard] = useState(false);
  const [previousYards, setPreviousYards] = useState([
    {
      yardName: "Old Yard Name1",
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
    {
      yardName: "Old Yard Name2",
      yardAddress: "Old Address",
      yardMobile: "1234567890",
      yardEmail: "oldyard@email.com",
      yardPrice: "1000",
      yardWarranty: "30 Days",
      yardMiles: "70000",
      yardShipping: "Own Shipping",
      yardCost: "800",
      reason: "Better price from new yard",
    },
  ]);
  const [selectedPrevYardIdx, setSelectedPrevYardIdx] = useState(0);
  console.log(setPreviousYards, setShowPreviousYard);

  // Add state for uploaded picture file
  const [uploadedPicture, setUploadedPicture] = useState<File | null>(null);

  return (
    <ProtectRoute>
      <div className="min-h-screen bg-main text-white font-exo py-2">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="pt-[60px] lg:pt-[40px] min-h-screen px-4 md:px-8">
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
                className={`mb-10 p-4 rounded-lg ${
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
              <div className="grid grid-cols-1 md:flex items-center justify-between mb-4">
                <div className="relative flex items-center gap-4">
                  <div className="absolute top-[-60px] md:left-5 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                    <Image
                      src={URL + "dummyImg.png"}
                      alt="Customer"
                      width={120}
                      height={120}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                    <h2 className="md:text-xl font-semibold text-white  mt-20">
                      Shiva Shankar Reddy
                    </h2>
                    <p className="text-white/60 mt-20 md:mt-0">ID: PC#022705</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 gap-3">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.email ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.email || "placeholder"}
                    </p>
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
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.mobile ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.mobile || "placeholder"}
                    </p>
                  </div>
                  <div className="relative">
                    <label className="block text-white/60 text-sm mb-2">
                      Part Price *
                    </label>
                    <div className="relative" ref={priceOptionsRef}>
                      <input
                        type="number"
                        className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 pr-12 text-white focus:outline-none ${
                          fieldErrors.partPrice
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-blue-500"
                        }`}
                        placeholder="Enter price"
                        value={formData.partPrice}
                        onChange={(e) =>
                          handleInputChange("partPrice", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPriceOptions(!showPriceOptions)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
                      >
                        <Plus size={14} />
                      </button>

                      {/* Dropdown options */}
                      {showPriceOptions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a1929] border border-gray-600 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            {!visiblePriceFields.taxesPrice && (
                              <button
                                type="button"
                                onClick={() =>
                                  handlePriceFieldSelection("taxesPrice")
                                }
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                              >
                                Taxes Price
                              </button>
                            )}
                            {!visiblePriceFields.handlingPrice && (
                              <button
                                type="button"
                                onClick={() =>
                                  handlePriceFieldSelection("handlingPrice")
                                }
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                              >
                                Handling Price
                              </button>
                            )}
                            {!visiblePriceFields.processingPrice && (
                              <button
                                type="button"
                                onClick={() =>
                                  handlePriceFieldSelection("processingPrice")
                                }
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                              >
                                Processing Price
                              </button>
                            )}
                            {!visiblePriceFields.corePrice && (
                              <button
                                type="button"
                                onClick={() =>
                                  handlePriceFieldSelection("corePrice")
                                }
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                              >
                                Core Price
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.partPrice ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.partPrice || "placeholder"}
                    </p>
                  </div>
                </div>
                {/* Dynamic additional price fields */}
                {(visiblePriceFields.taxesPrice ||
                  visiblePriceFields.handlingPrice ||
                  visiblePriceFields.processingPrice ||
                  visiblePriceFields.corePrice) && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {visiblePriceFields.taxesPrice && (
                      <div className="relative">
                        {true && (
                          <button
                            onClick={() => {
                              setVisiblePriceFields((prev) => ({
                                ...prev,
                                ["taxesPrice"]: false,
                              }));
                              handleInputChange("taxesPrice", "");
                            }}
                            className="absolute -top-[-20px] -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remove payment"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <label className="block text-white/60 text-sm mb-2">
                          Taxes Price
                        </label>
                        <input
                          type="number"
                          className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                            fieldErrors.taxesPrice
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-600 focus:border-blue-500"
                          }`}
                          placeholder="Enter price"
                          value={formData.taxesPrice}
                          onChange={(e) =>
                            handleInputChange("taxesPrice", e.target.value)
                          }
                        />
                        {fieldErrors.taxesPrice && (
                          <p className="text-red-400 text-xs mt-1">
                            {fieldErrors.taxesPrice}
                          </p>
                        )}
                      </div>
                    )}

                    {visiblePriceFields.handlingPrice && (
                      <div className="relative">
                        {true && (
                          <button
                            onClick={() => {
                              setVisiblePriceFields((prev) => ({
                                ...prev,
                                ["handlingPrice"]: false,
                              }));
                              handleInputChange("handlingPrice", "");
                            }}
                            className="absolute -top-[-20px] -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remove payment"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <label className="block text-white/60 text-sm mb-2">
                          Handling Price
                        </label>
                        <input
                          type="number"
                          className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                            fieldErrors.handlingPrice
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-600 focus:border-blue-500"
                          }`}
                          placeholder="Enter price"
                          value={formData.handlingPrice}
                          onChange={(e) =>
                            handleInputChange("handlingPrice", e.target.value)
                          }
                        />
                        {fieldErrors.handlingPrice && (
                          <p className="text-red-400 text-xs mt-1">
                            {fieldErrors.handlingPrice}
                          </p>
                        )}
                      </div>
                    )}

                    {visiblePriceFields.processingPrice && (
                      <div className="relative">
                        {true && (
                          <button
                            onClick={() => {
                              setVisiblePriceFields((prev) => ({
                                ...prev,
                                ["processingPrice"]: false,
                              }));
                              handleInputChange("processingPrice", "");
                            }}
                            className="absolute -top-[-20px] -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remove payment"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <label className="block text-white/60 text-sm mb-2">
                          Processing Price
                        </label>
                        <input
                          type="number"
                          className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                            fieldErrors.processingPrice
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-600 focus:border-blue-500"
                          }`}
                          placeholder="Enter price"
                          value={formData.processingPrice}
                          onChange={(e) =>
                            handleInputChange("processingPrice", e.target.value)
                          }
                        />
                        {fieldErrors.processingPrice && (
                          <p className="text-red-400 text-xs mt-1">
                            {fieldErrors.processingPrice}
                          </p>
                        )}
                      </div>
                    )}

                    {visiblePriceFields.corePrice && (
                      <div className="relative">
                        {true && (
                          <button
                            onClick={() => {
                              setVisiblePriceFields((prev) => ({
                                ...prev,
                                ["corePrice"]: false,
                              }));
                              handleInputChange("corePrice", "");
                            }}
                            className="absolute -top-[-20px] -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remove payment"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <label className="block text-white/60 text-sm mb-2">
                          Core Price
                        </label>
                        <input
                          type="number"
                          className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                            fieldErrors.corePrice
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-600 focus:border-blue-500"
                          }`}
                          placeholder="Enter price"
                          value={formData.corePrice}
                          onChange={(e) =>
                            handleInputChange("corePrice", e.target.value)
                          }
                        />
                        {fieldErrors.corePrice && (
                          <p className="text-red-400 text-xs mt-1">
                            {fieldErrors.corePrice}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Row 2 */}
                  <div className="col-span-1">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">
                        Shipping Address Type
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                          value={formData.shippingAddressType}
                          onChange={(e) => {
                            handleInputChange(
                              "shippingAddressType",
                              e.target.value
                            );
                            if (e.target.value === "Commercial") {
                              setShowCompany(true);
                            } else {
                              setShowCompany(false);
                            }
                          }}
                        >
                          <option value="">Select address type</option>
                          <option value="Residential">Residential</option>
                          {/* <option value="Non Residential">
                            Non Residential
                          </option> */}
                          <option value="Terminal">Terminal</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                          size={16}
                        />
                      </div>
                      {showCompany && (
                        <div className="mt-2 relative">
                          <label className=" block text-white/60 text-sm mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            className="block bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                            placeholder="Company name"
                            value={formData.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                          />
                        </div>
                      )}
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
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.shippingAddress ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.shippingAddress || "placeholder"}
                    </p>
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
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.billingAddress ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.billingAddress || "placeholder"}
                    </p>
                  </div>
                </div>

                {/* Middle Section - Payment & Warranty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-white/60 text-sm mb-2">
                      Card
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-4  gap-1">
                      <div>
                        <input
                          type="text"
                          className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                          placeholder="Card holder name"
                          value={formData.cardHolderName}
                          onChange={(e) =>
                            handleInputChange("cardHolderName", e.target.value)
                          }
                        />
                        <p className="text-red-400 text-xs mt-1 h-4 invisible">
                          placeholder
                        </p>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                          placeholder="Card Number"
                          value={formData.cardNumber}
                          inputMode="numeric"
                          maxLength={23}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            handleInputChange("cardNumber", formatted);
                          }}
                          onBlur={(e) => {
                            const err = validateField(
                              "cardNumber",
                              e.target.value
                            );
                            if (err)
                              setFieldErrors((prev) => ({
                                ...prev,
                                cardNumber: err,
                              }));
                          }}
                        />
                        <p
                          className={`text-red-400 text-xs mt-1 h-4 ${
                            fieldErrors.cardNumber ? "" : "invisible"
                          }`}
                        >
                          {fieldErrors.cardNumber || "placeholder"}
                        </p>
                        {!fieldErrors.cardNumber && formData.cardNumber && (
                          <p className="text-white/60 text-xs">
                            Detected card:{" "}
                            {getCardType(formData.cardNumber) || "Unknown"}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                          placeholder="Expire Date"
                          value={formData.cardDate}
                          inputMode="numeric"
                          maxLength={7}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            handleInputChange("cardDate", formatted);
                          }}
                          onBlur={(e) => {
                            const err = validateField(
                              "cardDate",
                              e.target.value
                            );
                            if (err)
                              setFieldErrors((prev) => ({
                                ...prev,
                                cardDate: err,
                              }));
                          }}
                        />
                        <p
                          className={`text-red-400 text-xs mt-1 h-4 ${
                            fieldErrors.cardDate ? "" : "invisible"
                          }`}
                        >
                          {fieldErrors.cardDate || "placeholder"}
                        </p>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                          placeholder="CVV"
                          value={formData.cardCvv}
                          inputMode="numeric"
                          maxLength={
                            getCardType(formData.cardNumber) ===
                            "American Express"
                              ? 4
                              : 3
                          }
                          onChange={(e) => {
                            const expected =
                              getCardType(formData.cardNumber) ===
                              "American Express"
                                ? 4
                                : 3;
                            const digits = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, expected);
                            handleInputChange("cardCvv", digits);
                          }}
                          onBlur={(e) => {
                            const err = validateField(
                              "cardCvv",
                              e.target.value
                            );
                            if (err)
                              setFieldErrors((prev) => ({
                                ...prev,
                                cardCvv: err,
                              }));
                          }}
                        />
                        <p
                          className={`text-red-400 text-xs mt-1 h-4 ${
                            fieldErrors.cardCvv ? "" : "invisible"
                          }`}
                        >
                          {fieldErrors.cardCvv || "placeholder"}
                        </p>
                      </div>
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
                    <div className="relative">
                      <select
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none disabled:opacity-50"
                        value={formData.milesPromised}
                        onChange={handleMileageChange}
                        disabled={!selectedSubpart}
                      >
                        <option value="">Select Miles</option>
                        {selectedSubpart?.variants.map((variant, idx) => (
                          <option key={idx} value={variant.miles}>
                            {variant.miles} miles
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Details Section - Before Send Invoice Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
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
                        onChange={(e) => {
                          handleInputChange("make", e.target.value);
                          handleInputChange("model", "");
                          handleInputChange("year", "");
                        }}
                      >
                        <option value="">Select make</option>
                        {MAKES.map((make) => (
                          <option key={make} value={make}>
                            {make}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.make ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.make || "placeholder"}
                    </p>
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
                        onChange={(e) => {
                          handleInputChange("model", e.target.value);
                          handleInputChange("year", "");
                        }}
                        disabled={!formData.make}
                      >
                        <option value="">Select model</option>
                        {(MODELS[formData.make] || []).map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.model ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.model || "placeholder"}
                    </p>
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
                        onChange={(e) => handleInputChange("year", e.target.value)}
                        disabled={!formData.model || availableYears.length === 0}
                      >
                        <option value="">Select year</option>
                        {availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.year ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.year || "placeholder"}
                    </p>
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
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.parts ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.parts || "placeholder"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Specification *
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none appearance-none ${
                          fieldErrors.specification
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-600 focus:border-blue-500"
                        }`}
                        value={formData.specification}
                        onChange={handleSpecificationChange}
                        disabled={!productVariants.length}
                      >
                        <option value="">Select Specification</option>
                        {productVariants.map((variant, idx) => (
                          <option key={idx} value={variant.subPart.name}>
                            {variant.subPart.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        size={16}
                      />
                    </div>
                    {fieldErrors.specification && (
                      <p className="text-red-400 text-xs mt-1">
                        {fieldErrors.specification}
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
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Total Selling Price
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Total Selling Price"
                      value={formData.totalSellingPrice}
                      onChange={(e) =>
                        handleInputChange("totalSellingPrice", e.target.value)
                      }
                    />
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

                {/* Payment Entries */}
                <div className="space-y-6">
                  {paymentEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="relative bg-[#0f1e35] p-4 rounded-lg border border-gray-700"
                    >
                      {index > 0 && (
                        <button
                          onClick={() => removePaymentEntry(entry.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          title="Remove payment"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-white/60 text-sm mb-2">
                            Merchant Method
                          </label>
                          <div className="relative">
                            <select
                              className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                              value={entry.merchantMethod}
                              onChange={(e) =>
                                handlePaymentEntryChange(
                                  entry.id,
                                  "merchantMethod",
                                  e.target.value
                                )
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
                              {/* <option>Bank Transfer</option> */}
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
                          <label className="block text-white/60 text-sm mb-2">
                            Total Price
                          </label>
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Total Price"
                            value={entry.totalPrice}
                            onChange={(e) =>
                              handlePaymentEntryChange(
                                entry.id,
                                "totalPrice",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <button
                            className={`cursor-pointer w-full mt-7 px-6 py-3 rounded-lg font-medium transition-colors ${
                              isLoading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-[#006BA9] hover:bg-[#006BA9]/90"
                            } text-white`}
                            onClick={() => handleCharge(entry.id)}
                            disabled={isLoading}
                          >
                            {entry.chargeClicked ? "Re-charge" : "Charge"}
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
                            value={entry.approvalCode}
                            onChange={(e) =>
                              handlePaymentEntryChange(
                                entry.id,
                                "approvalCode",
                                e.target.value
                              )
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
                          <input
                            type="text"
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Enter charged status"
                            value={entry.charged}
                            onChange={(e) =>
                              handlePaymentEntryChange(
                                entry.id,
                                "charged",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      onClick={addPaymentEntry}
                      className="flex items-center gap-2 bg-[#006BA9] hover:bg-[#006BA9]/90 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                      Add Payment
                    </button>
                  </div>
                </div>
                {/* Yard Info Section */}
                <div className=" p-2 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white text-lg font-semibold">
                      Yard Info
                    </h3>
                    <button
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      onClick={() => setShowPreviousYard((prev) => !prev)}
                    >
                      {showPreviousYard
                        ? "Hide Previous Yard"
                        : "Show Previous Yard"}
                    </button>
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
                          onChange={(e) => {
                            handleInputChange("yardShipping", e.target.value);
                          }}
                        >
                          <option value="">Select shipping option</option>
                          <option value="Own Shipping">Own Shipping</option>
                          <option value="Yard Shipping">Yard Shipping</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                          size={16}
                        />
                      </div>
                    </div>
                    {showYardShippingCost && (
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Yard Shipping Cost
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
                    )}
                  </div>
                </div>
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
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-10 my-2">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Picture Status
                    </label>
                    <select
                      className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.pictureStatus}
                      onChange={(e) =>
                        handleInputChange("pictureStatus", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {formData.pictureStatus === "Yes" && (
                      <div className="mt-4 p-4 bg-[#1a2636] rounded-lg border border-blue-700 flex flex-col items-center gap-4 shadow-lg">
                        <label
                          htmlFor="picture-upload"
                          className="w-full flex flex-col items-center justify-center cursor-pointer bg-[#22304a] border-2 border-dashed border-blue-400 rounded-lg p-6 hover:bg-[#2a3a5a] transition-colors text-white/80 text-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 mb-2 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                            />
                          </svg>
                          <span className="font-semibold">
                            Click to upload picture
                          </span>
                          <span className="text-xs text-white/50 mt-1">
                            (JPG, PNG, or GIF)
                          </span>
                          <input
                            id="picture-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setUploadedPicture(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                        {uploadedPicture && (
                          <div className="text-white/80 text-sm mt-2">
                            Selected:{" "}
                            <span className="font-semibold">
                              {uploadedPicture.name}
                            </span>
                          </div>
                        )}
                        <button
                          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-colors w-full"
                          // onClick handler for sending picture
                        >
                          Send Picture
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {showOwnShipping && (
                  <>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Own Shipping Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FFFFFF33] rounded-lg p-2 my-4">
                      {/* Name */}
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Product type
                        </label>
                        <div className="relative">
                          <select
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                            // value={formData.yardShipping}
                            // onChange={(e) =>
                            //   handleInputChange("yardShipping", e.target.value)
                            // }
                          >
                            <option value="">Select Product Type</option>
                            <option>LTL</option>
                            <option>Parcel</option>
                          </select>
                          <ChevronDown
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                            size={16}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Package type
                        </label>
                        <div className="relative">
                          <select
                            className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                            // value={formData.yardShipping}
                            // onChange={(e) =>
                            //   handleInputChange("yardShipping", e.target.value)
                            // }
                          >
                            <option value="">Select Package Type</option>
                            <option>Pallet</option>
                            <option>Box</option>
                            <option>Crate</option>
                          </select>
                          <ChevronDown
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                            size={16}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Weight
                        </label>
                        <input
                          type="number"
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Enter weight"
                          // value={formData.weight}
                          // onChange={(e) =>
                          // handleInputChange("weight", e.target.value)
                          // }
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Dimensions
                        </label>
                        <input
                          type="number"
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Enter dimensions"
                          // value={formData.dimensions}
                          // onChange={(e) =>
                          // handleInputChange("dimensions", e.target.value)
                          // }
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Pick Up Date
                        </label>
                        <input
                          type="date"
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Enter pick up date"
                          // value={formData.dimensions}
                          // onChange={(e) =>
                          // handleInputChange("dimensions", e.target.value)
                          // }
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Carrier
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Enter carrier"
                          // value={formData.weight}
                          // onChange={(e) =>
                          // handleInputChange("weight", e.target.value)
                          // }
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Price
                        </label>
                        <input
                          type="number"
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Enter price"
                          // value={formData.price}
                          // onChange={(e) =>
                          // handleInputChange("price", e.target.value)
                          // }
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          Variance
                        </label>
                        <input
                          type="number"
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Enter variance"
                          // value={formData.variance}
                          // onChange={(e) =>
                          // handleInputChange("variance", e.target.value)
                          // }
                        />
                      </div>
                      <div className="flex justify-end">
                        <button className="bg-[#006BA9] hover:bg-[#006BA9]/90 cursor-pointer mt-8 w-40 h-10 px-2 py-2 text-white  rounded-lg font-medium transition-colors">
                          Create BOL
                        </button>
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">
                          BOL Number
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="Enter BOL number"
                          // value={formData.carrierName}
                          // onChange={(e) =>
                          // handleInputChange("carrierName", e.target.value)
                          // }
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-10">
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    Carrier Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Carrier Name"
                    value={formData.carrierName}
                    onChange={(e) =>
                      handleInputChange("carrierName", e.target.value)
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
                <div className="col-span-1">
                  <button className="cursor-pointer mt-8 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-colors w-full">
                    Send Tracking details
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-white/60 text-sm mb-2">
                  Notes
                </label>
                <textarea
                  className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Add any notes here..."
                  rows={4}
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 mb-8">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    onClick={handleCreateOrder}
                  >
                    Save
                  </button>
                <button className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
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
