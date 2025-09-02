"use client";
import Header from "@/app/components/Header";
import ProtectRoute from "@/app/components/ProtectRoute";
import Sidebar from "@/app/components/Sidebar";
import { useParams } from "next/navigation";
import { ChevronDown, X, Plus, Minus, Calendar } from "lucide-react";
import Image from "next/image";
declare global {
  interface Window {
    _lastVariantKeys?: { [index: number]: string };
  }
}
// --- Strong types for cart mapping ---
export type ProductFormData = {
  variantSku: string;
  make: string;
  model: string;
  year: string;
  parts: string;
  partPrice: string | number;
  quantity?: number;
  milesPromised?: string | number;
  specification?: string;
  pictureUrl?: string;
  pictureStatus?: string;
  productVariants?: GroupedVariant[];
  selectedSubpart?: GroupedVariant | null;
  selectedMileage?: string;
};
export type OrderFormData = {
  products: ProductFormData[];
  customerName: string;
  id: string;
  date: string;
  source: string;
  status: string;
  email: string;
  mobile: string;
  alternateMobile: string;
  partPrice: string | number;
  taxesPrice: string | number;
  handlingPrice: string | number;
  processingPrice: string | number;
  corePrice: string | number;
  shippingAddressType: string;
  company: string;
  shippingAddress: string;
  billingAddress: string;
  cardHolderName: string;
  cardNumber: string;
  cardDate: string;
  cardCvv: string;
  alternateCardHolderName: string;
  alternateCardNumber: string;
  alternateCardDate: string;
  alternateCardCvv: string;
  warranty: string;
  totalSellingPrice: string | number;
  totalPrice: string | number;
  merchantMethod: string;
  approvalCode: string;
  entity: string;
  charged: string;
  saleMadeBy: string;
  yardName: string;
  yardMobile: string;
  yardAddress: string;
  yardEmail: string;
  yardPrice: string | number;
  yardWarranty: string;
  yardMiles: string | number;
  yardShipping: string;
  yardCost: string | number;
  pictureStatus: string;
  pictureUrl: string;
  carrierName: string;
  trackingNumber: string;
  customerNotes: any;
  yardNotes: any;
  invoiceStatus: string;
  invoiceSentAt: string;
  invoiceConfirmedAt: string;
  vinNumber: string;
  notes: string;
  ownShippingInfo: {
    productType: string;
    packageType: string;
    weight: string;
    dimensions: string;
    pickUpDate: string;
    carrier: string;
    price: string;
    variance: string;
    bolNumber: string;
  };
};
// --- End strong types for cart mapping ---

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { URL } from "@/utils/imageUrl";
import { createOrderFromAdmin, getOrderById } from "@/utils/orderApi";
import { updateOrderFromAdmin } from "@/utils/updateOrderApi";
import { getCardType, isValidCardNumber } from "@/utils/cardValidator";
import { MAKES, MODELS } from "@/vehicleData-dashboard";
import { fetchYears } from "@/utils/vehicleApi";
import { getProductVariants, GroupedVariant } from "@/utils/productApi";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // warranty?: string;
  milesPromised?: string;
  specification?: string;
}

const OrderDetails = () => {
  const params = useParams();
  const orderId = params.id as string;
  const lastVariantKeys = useRef<{ [index: number]: string }>({});
  const isInitialLoad = useRef(true);
  const [showAlternateMobileNumber, setShowAlternateMobileNumber] =
    useState(false);

  useEffect(() => {
    if (orderId && orderId !== "create" && orderId !== "new") {
      getOrderById(orderId)
        .then((data) => {
          const payment = data.payments?.[0] || {};
          const billing = data.billingSnapshot || {};

          const shipping = data.shippingSnapshot || {};
          const yard = data.yardInfo || {};
          const ownShipping = yard.yardOwnShippingInfo || {};

          const customerNotesArray =
            data.customerNotes && typeof data.customerNotes === "string"
              ? JSON.parse(data.customerNotes)
              : Array.isArray(data.customerNotes)
              ? data.customerNotes
              : [];
          const yardNotesArray =
            data.yardNotes && typeof data.yardNotes === "string"
              ? JSON.parse(data.yardNotes)
              : Array.isArray(data.yardNotes)
              ? data.yardNotes
              : [];

          setCustomerNotes(customerNotesArray);
          setYardNotes(yardNotesArray);

          // Map backend cartItems to UI cartItems array with strong typing
          const products =
            Array.isArray(data.items) && data.items.length > 0
              ? data.items.map(
                  (item: any): ProductFormData => ({
                    variantSku: String(item.sku || item.id || ""),
                    make: String(item.makeName || ""),
                    model: String(item.modelName || ""),
                    year: String(item.yearName || ""),
                    parts: String(item.partName || ""),
                    partPrice: String(item.unitPrice || item.lineTotal || ""),
                    quantity:
                      typeof item.quantity === "number"
                        ? item.quantity
                        : parseInt(item.quantity) || 1,
                    milesPromised:
                      typeof item.milesPromised === "string" ||
                      typeof item.milesPromised === "number"
                        ? String(item.milesPromised)
                        : "",
                    specification: String(item.specification || ""),
                    pictureUrl: String(item.pictureUrl || ""),
                    pictureStatus: String(item.pictureStatus || "PENDING"),
                    productVariants: [],
                    selectedSubpart: null,
                    selectedMileage: "",
                  })
                )
              : formData.products; // Keep existing products if data.items is empty
console.log("DEBUG 1: Products from server mapping:", products)
          setFormData({
            ...formData,
            products, // Set the products here
            // Basic order info
            id: data.orderNumber || "",
            date: data.orderDate
              ? new Date(data.orderDate).toISOString().split("T")[0]
              : "",
            source: data.source || "",
            status: data.status || "",

            // Customer info
            customerName: data.customer?.full_name || "",
            email: billing.email || "",
            mobile: billing.phone || "",
            alternateMobile: data.customer?.alternativePhone || "",

            // Pricing
            partPrice: data.subtotal || "",
            taxesPrice: data.taxesAmount || "",
            handlingPrice: data.handlingFee || "",
            processingPrice: data.processingFee || "",
            corePrice: data.corePrice || "",
            totalSellingPrice: data.totalAmount || "",
            totalPrice: data.totalAmount || "",

            // Address info
            shippingAddressType: shipping.addressType || data.addressType || "",
            company: shipping.company || data.companyName || "",
            shippingAddress: data.shippingAddress || shipping.address || "",
            billingAddress: data.billingAddress || billing.address || "",

            // Payment info
            cardHolderName: payment.cardHolderName || "",
            cardNumber: payment.cardNumber || "",
            cardDate: payment.cardExpiry
              ? new Date(payment.cardExpiry).toLocaleDateString("en-US", {
                  month: "2-digit",
                  year: "2-digit",
                })
              : "",
            cardCvv: payment.cardCvv || "",
            // Alternate card info
            alternateCardHolderName: payment.alternateCardHolderName || "",
            alternateCardNumber: payment.alternateCardNumber || "",
            alternateCardDate: payment.alternateCardExpiry
              ? new Date(payment.alternateCardExpiry).toLocaleDateString(
                  "en-US",
                  {
                    month: "2-digit",
                    year: "2-digit",
                  }
                )
              : "",
            alternateCardCvv: payment.alternateCardCvv || "",
            merchantMethod: payment.method || "",
            approvalCode:
              payment.approvelCode || payment.providerPaymentId || "",
            entity: payment.entity || "",
            charged: payment.status === "SUCCEEDED" ? "Yes" : "No",

            // Product info (from first item if available)
            warranty: data.items?.[0]?.metadata?.warranty || "",
            pictureUrl: data.items?.[0]?.pictureUrl || "",
            pictureStatus: data.items?.[0]?.pictureStatus || "",

            // Order management
            saleMadeBy: data.saleMadeBy || "",
            carrierName: data.carrierName || "",
            trackingNumber: data.trackingNumber || "",

            // Notes and metadata
            notes: data.notes || "",
            vinNumber: data.vinNumber || "",

            // Yard info
            yardName: yard.yardName || "",
            yardMobile: yard.yardMobile || "",
            yardAddress: yard.yardAddress || "",
            yardEmail: yard.yardEmail || "",
            yardPrice: yard.yardPrice || "",
            yardWarranty: yard.yardWarranty || "",
            yardMiles: yard.yardMiles || "",
            yardShipping: yard.yardShippingType || "",
            yardCost: yard.yardShippingCost || "",
            customerNotes: customerNotesArray,
            yardNotes: yardNotesArray,
            invoiceStatus: data.invoiceStatus || "",
            invoiceSentAt: data.invoiceSentAt
              ? new Date(data.invoiceSentAt).toISOString().split("T")[0]
              : "",
            invoiceConfirmedAt: data.invoiceConfirmedAt
              ? new Date(data.invoiceConfirmedAt).toISOString().split("T")[0]
              : "",
            ownShippingInfo: {
              productType: ownShipping.productType || "",
              packageType: ownShipping.packageType || "",
              weight: ownShipping.weight || "",
              dimensions: ownShipping.dimensions || "",
              pickUpDate: ownShipping.pickUpDate || "",
              carrier: ownShipping.carrier || "",
              price: ownShipping.price || "",
              variance: ownShipping.variance || "",
              bolNumber: ownShipping.bolNumber || "",
            },
          });

          if (data.customerNotes && typeof data.customerNotes === "string") {
            try {
              const parsedCustomerNotes = JSON.parse(data.customerNotes);
              setCustomerNotes(
                Array.isArray(parsedCustomerNotes) ? parsedCustomerNotes : []
              );
            } catch (error) {
              console.error("Failed to parse customer notes:", error);
              setCustomerNotes([]);
            }
          }

          if (data.yardNotes && typeof data.yardNotes === "string") {
            try {
              const parsedYardNotes = JSON.parse(data.yardNotes);
              setYardNotes(
                Array.isArray(parsedYardNotes) ? parsedYardNotes : []
              );
            } catch (error) {
              console.error("Failed to parse yard notes:", error);
              setYardNotes([]);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch order details", err);
        });
    }
  }, [orderId]); // State for product variants

  // Per-product loading state for variants
  const [isLoadingVariants, setIsLoadingVariants] = useState<{
    [index: number]: boolean;
  }>({});
  const [variantError, setVariantError] = useState("");
  const [cardEntry, setCardEntry] = useState(false);

  const [statusPopUp, setStatusPopUp] = useState(false);

  const [formData, setFormData] = useState<OrderFormData>({
    products: [
      {
        variantSku: "",
        make: "",
        model: "",
        year: "",
        parts: "",
        partPrice: "",
        quantity: 1,
        milesPromised: "",
        specification: "",
        pictureUrl: "",
        pictureStatus: "",
        productVariants: [],
        selectedSubpart: null,
        selectedMileage: "",
      },
    ],
    customerName: "",
    id: "",
    date: "",
    source: "",
    status: "",
    email: "",
    mobile: "",
    alternateMobile: "",
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
    alternateCardHolderName: "",
    alternateCardNumber: "",
    alternateCardDate: "",
    alternateCardCvv: "",
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
    pictureUrl: "",
    carrierName: "",
    trackingNumber: "",
    customerNotes: "",
    yardNotes: "",
    invoiceStatus: "",
    invoiceSentAt: "",
    invoiceConfirmedAt: "",
    vinNumber: "",
    notes: "",
    warranty: "",
    ownShippingInfo: {
      productType: "",
      packageType: "",
      weight: "",
      dimensions: "",
      pickUpDate: "",
      carrier: "",
      price: "",
      variance: "",
      bolNumber: "",
    },
  });

  const handleProductInputChange = (
    index: number,
    field: keyof ProductFormData,
    value: any
  ) => {
    setFormData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          variantSku: "",
          make: "",
          model: "",
          year: "",
          parts: "",
          partPrice: "",
          quantity: 1,
          milesPromised: "",
          specification: "",
          pictureUrl: "",
          pictureStatus: "PENDING",
          productVariants: [],
          selectedSubpart: null,
          selectedMileage: "",
        },
      ],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };
  const [availableYears, setAvailableYears] = useState<{
    [index: number]: string[];
  }>({});

  // Fetch years for each product's make/model
  useEffect(() => {
    formData.products.forEach((product, index) => {
      if (product.make && product.model) {
        fetchYears(product.make, product.model).then((years) => {
          setAvailableYears((prev) => ({ ...prev, [index]: years }));
        });
      } else {
        setAvailableYears((prev) => ({ ...prev, [index]: [] }));
      }
    });
  }, [formData.products.map((p) => `${p.make}-${p.model}`).join(",")]);

  // Handle mileage selection
  const handleMileageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const selectedMiles = e.target.value;
    const product = formData.products[index];
    handleProductInputChange(index, "milesPromised", selectedMiles);

    if (product.selectedSubpart) {
      const variant = product.selectedSubpart.variants.find(
        (v) => v.miles === selectedMiles
      );
      if (variant) {
        handleProductInputChange(index, "variantSku", variant.sku);
        handleProductInputChange(
          index,
          "partPrice",
          variant.discountedPrice?.toString() || variant.actualprice.toString()
        );
      }
    }
  };

  // Handle specification selection
  const handleSpecificationChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const selectedSpec = e.target.value;
    const product = formData.products[index];
    const subpart =
      product.productVariants?.find((v) => v.subPart.name === selectedSpec) ||
      null;

    handleProductInputChange(index, "specification", selectedSpec);
    handleProductInputChange(index, "selectedSubpart", subpart);
    handleProductInputChange(index, "variantSku", "");
    handleProductInputChange(index, "milesPromised", "");
  };

  const fetchProductVariants = async (index: number) => {
    
    const product = formData.products[index];
    if (product.make && product.model && product.year && product.parts) {
      setIsLoadingVariants((prev) => ({ ...prev, [index]: true }));
      setVariantError("");
      try {
        const data = await getProductVariants({
          make: product.make,
          model: product.model,
          year: product.year,
          part: product.parts,
        });
        const variants = data.groupedVariants || [];
        console.log(`DEBUG fetchProductVariants for index ${index}:`);
        console.log(`  - Product:`, product);
        console.log(`  - Fetched variants:`, variants);
        console.log(`  - Existing specification:`, product.specification);
        console.log(`  - Existing milesPromised:`, product.milesPromised);
        
        handleProductInputChange(index, "productVariants", variants);
        
        // If there's an existing specification value, find and set the corresponding selectedSubpart
        if (product.specification && variants.length > 0) {
          console.log(`  - Looking for variant with subPart.name = "${product.specification}"`);
          const matchingVariant = variants.find(
            (variant: any) => variant.subPart.name === product.specification
          );
          if (matchingVariant) {
            console.log(`Setting selectedSubpart for index ${index}:`, matchingVariant);
            handleProductInputChange(index, "selectedSubpart", matchingVariant);
          }
        }
      } catch (error) {
        console.error("Error fetching product variants:", error);
        setVariantError("Failed to load product variants. Please try again.");
        handleProductInputChange(index, "productVariants", []);
      } finally {
        setIsLoadingVariants((prev) => ({ ...prev, [index]: false }));
      }
    } else {
      handleProductInputChange(index, "productVariants", []);
    }
  };

  // useEffect to reactively fetch variants and reset dependent fields
  useEffect(() => {
    formData.products.forEach((product, index) => {
      console.log(`DEBUG 2: useEffect running for index ${index}`, product);
      const { make, model, year, parts } = product;
      // Compose a unique key for these fields
      const key = `${make}-${model}-${year}-${parts}`;

      if (lastVariantKeys.current[index] !== key) {
        console.log(`DEBUG 4: Fields change detected for index ${index}, isInitialLoad: ${isInitialLoad.current}`);
        
        // Only reset dependent fields if this is NOT the initial load AND the key actually changed
        // This prevents resetting fields when loading existing order data
        if (lastVariantKeys.current[index] && !isInitialLoad.current) {
          console.log(`DEBUG 5: Resetting fields for index ${index}`);
          handleProductInputChange(index, "specification", "");
          handleProductInputChange(index, "selectedSubpart", null);
          handleProductInputChange(index, "selectedMileage", "");
          handleProductInputChange(index, "variantSku", "");
          handleProductInputChange(index, "milesPromised", "");
        }
        
        // Always reset productVariants and fetch new ones if needed
        handleProductInputChange(index, "productVariants", []);
        // Only fetch if all fields are present
        if (make && model && year && parts) {
          fetchProductVariants(index);
        }
        lastVariantKeys.current[index] = key;
      }
    });
    
    // Mark initial load as complete after first run
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
    
    console.log("Loaded products:", formData.products);
    // eslint-disable-next-line
  }, [
    formData.products
      .map((p) => `${p.make}-${p.model}-${p.year}-${p.parts}`)
      .join(","),
  ]);

  const [lastLogged, setLastLogged] = useState({
    trackingNumber: "",
    yardCost: "",
    carrierName: "",
  });
  const [isProcessing, setIsProcessing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCompany, setShowCompany] = useState(false);
  const [showOwnShipping, setShowOwnShipping] = useState(false);
  const [showYardShippingCost, setShowYardShippingCost] = useState(false);
  const [invoiceButtonState, setInvoiceButtonState] = useState(false);
  const [productEntry, setProductEntry] = useState<{ count: number }[]>([
    { count: 1 },
  ]);

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
    const newTotalPrice =
      Number(formData.partPrice) +
        Number(formData.handlingPrice) +
        Number(formData.corePrice) +
        Number(formData.taxesPrice) +
        Number(formData.processingPrice);

    if (Number(formData.totalPrice) !== newTotalPrice) {
      setFormData((prev) => ({
        ...prev,
        totalSellingPrice: newTotalPrice.toString(),
        totalPrice: newTotalPrice.toString(),
      }));
    }
  }, [
    formData.partPrice,
    formData.handlingPrice,
    formData.corePrice,
    formData.taxesPrice,
    formData.processingPrice,
    formData.totalPrice,
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

  const handleOwnShippingInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ownShippingInfo: {
        ...prev.ownShippingInfo,
        [field]: value,
      },
    }));
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
      case "alternateCardNumber": {
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
      case "alternateCardCvv": {
        if (!value) return ""; // not required
        if (!/^\d+$/.test(value)) return "CVV must be numeric";
        const type = getCardType(formData.alternateCardNumber);
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
      case "alternateCardDate": {
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
  let TIME = new Date();

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

    // requiredFields.forEach((field) => {
    //   const error = validateField(
    //     field,
    //     formData[field as keyof typeof formData]
    //   );
    //   if (error) {
    //     newErrors[field] = error;
    //     hasErrors = true;
    //   }
    // });

    if (formData.yardShipping === "Own Shipping") {
      const ownShippingInfoKeys = Object.keys(
        formData.ownShippingInfo
      ) as Array<keyof typeof formData.ownShippingInfo>;
      ownShippingInfoKeys.forEach((field) => {
        const error = validateField(field, formData.ownShippingInfo[field]);
        if (error) {
          newErrors[`ownShippingInfo.${field}`] = error;
          hasErrors = true;
        }
      });
    }

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
  const [invoiceDate, setInvoiceData] = useState(false);
  // Send invoice function
  const handleSendInvoice = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setInvoiceData(true);
    TIME = new Date();

    try {
      // Prepare invoice data
      const invoiceData = {
        orderId: formData.id, // You can get this from URL params
        customerInfo: {
          name: formData.customerName,
          email: formData.email,
          mobile: formData.mobile,
          alternateMobile: formData.alternateMobile,
          partPrice: formData.partPrice,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          shippingAddressType: formData.shippingAddressType,
          company: formData.company,
          totalSellingPrice: formData.totalSellingPrice,
          vinNumber: formData.vinNumber,
          notes: formData.notes,
        },
        paymentInfo: {
          cardHolderName: formData.cardHolderName,
          cardNumber: formData.cardNumber,
          cardDate: formData.cardDate,
          cardCvv: formData.cardCvv,
          warranty: formData.warranty,
          // milesPromised: formData.milesPromised,
        },
        // productInfo: {
        //   make: formData.make,
        //   model: formData.model,
        //   year: formData.year,
        //   parts: formData.parts,
        //   specification: formData.specification,
        //   saleMadeBy: formData.saleMadeBy,
        // },
        productInfo: formData.products.map((product) => ({
          make: product.make,
          model: product.model,
          year: product.year,
          parts: product.parts,
          specification: product.specification,
          // warranty: product.warranty,
          milesPromised: product.milesPromised,
        })),
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
      console.log("invoiceData issssss:", invoiceData);

      // API call to send invoice
      const response = await fetch(`${URL}api/send-invoice`, {
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
        // Notes
        addCustomerNote(
          "Invoice Generated – Invoice prepared for the order.",
          "By BillingAutomation"
        );
        addCustomerNote(
          "Invoice Sent – Invoice emailed to customer.",
          "By BillingAutomation"
        );
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
  const handleSendPO = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setInvoiceData(true);
    TIME = new Date();

    try {
      // Prepare invoice data
      const invoiceData = {
        orderId: formData.id, // You can get this from URL params
        customerInfo: {
          name: formData.customerName,
          email: formData.email,
          mobile: formData.mobile,
          alternateMobile: formData.alternateMobile,
          partPrice: formData.partPrice,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          shippingAddressType: formData.shippingAddressType,
          company: formData.company,
          totalSellingPrice: formData.totalSellingPrice,
          vinNumber: formData.vinNumber,
          notes: formData.notes,
        },
        paymentInfo: {
          cardHolderName: formData.cardHolderName,
          cardNumber: formData.cardNumber,
          cardDate: formData.cardDate,
          cardCvv: formData.cardCvv,
          warranty: formData.warranty,
          // milesPromised: formData.milesPromised,
        },
        // productInfo: {
        //   make: formData.make,
        //   model: formData.model,
        //   year: formData.year,
        //   parts: formData.parts,
        //   specification: formData.specification,
        //   saleMadeBy: formData.saleMadeBy,
        // },
        productInfo: formData.products.map((product) => ({
          make: product.make,
          model: product.model,
          year: product.year,
          parts: product.parts,
          specification: product.specification,
          // warranty: product.warranty,
          milesPromised: product.milesPromised,
        })),
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
      // API call to send invoice
      const response = await fetch(`${URL}api/send-po`, {
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
          text: "PO sent successfully! Check the email for the PO.",
        });
        // Update invoice status
        setIsProcessing(false);
        // Notes
        addCustomerNote(
          "PO Generated – PO prepared for the order.",
          "By BillingAutomation"
        );
        addCustomerNote(
          "PO Sent – PO emailed to customer.",
          "By BillingAutomation"
        );
      } else {
        throw new Error(result.message || "Failed to send PO");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to send PO. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSave = async () => {
    if (orderId && orderId !== "create" && orderId !== "new") {
      await handleUpdateOrder();
    } else {
      await handleCreateOrder();
    }
  };

  const handleUpdateOrder = async () => {
    if (!validateAllFields()) {
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const cartItems = formData.products
        .map((item) => ({
          id: item.variantSku,
          name: `${item.make} ${item.model} ${item.year} ${item.parts}`,
          price: parseFloat(String(item.partPrice)) || 0,
          quantity: item.quantity || 1,
          // warranty: item.warranty,
          milesPromised: item.milesPromised,
          specification: item.specification,
          pictureUrl: item.pictureUrl || "",
          pictureStatus: item.pictureStatus || "PENDING",
        }))
        .filter((item) => !!item.id); // Ensure SKU is present

      // Ensure invoice fields are ISO strings or empty
      const payload = {
        ...formData,
        invoiceSentAt: formData.invoiceSentAt
          ? new Date(formData.invoiceSentAt).toISOString()
          : null,
        invoiceConfirmedAt: formData.invoiceConfirmedAt
          ? new Date(formData.invoiceConfirmedAt).toISOString()
          : null,
        paymentInfo: {
          paymentMethod: formData.merchantMethod || "",
          amount: parseFloat(formData.totalPrice as string) || 0,
          approvelCode: formData.approvalCode,
          charged: formData.charged,
          entity: formData.entity,
        },
        ownShippingInfo: formData.ownShippingInfo && {
          ...formData.ownShippingInfo,
          variance: formData.ownShippingInfo.variance || "",
        },
      };
      const result = await updateOrderFromAdmin(orderId, payload, cartItems);
      setMessage({
        type: "success",
        text: "Order updated successfully!",
      });
      setIsProcessing(false);
      console.log("Order updated:", result);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to update order. Please try again.",
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
      // Auto-process uploaded picture if it exists and hasn't been processed yet
      if (uploadedPicture && !formData.pictureUrl) {
        const base64Image = await convertToBase64(uploadedPicture);
        setFormData((prev) => ({
          ...prev,
          pictureUrl: base64Image,
          pictureStatus: "SENT",
        }));

        addCustomerNote(
          `Picture Uploaded – ${uploadedPicture.name} sent to customer (auto-processed during order creation).`,
          "By Agent"
        );
      }

      const cartItems = formData.products
        .map((item) => ({
          id: item.variantSku,
          name: `${item.make} ${item.model} ${item.year} ${item.parts}`,
          price: parseFloat(String(item.partPrice)) || 0,
          quantity: item.quantity || 1,
          // warranty: item.warranty,
          milesPromised: item.milesPromised,
          specification: item.specification,
          pictureUrl: item.pictureUrl || "",
          pictureStatus: item.pictureStatus || "PENDING",
        }))
        .filter((item) => !!item.id); // Ensure SKU is present

      // Get the first payment entry (or use default values if none exists)
      const paymentEntry = paymentEntries[0] || {};

      const updatedFormData = {
        ...formData,
        status: formData.status || "NA",
        customerNotes: customerNotes,
        yardNotes: yardNotes,
        approvalCode: paymentEntry.approvalCode || "",
        charged: paymentEntry.charged || "No",
        merchantMethod: paymentEntry.merchantMethod || "",
        invoiceSentAt: formData.invoiceSentAt
          ? new Date(formData.invoiceSentAt).toISOString()
          : null,
        invoiceConfirmedAt: formData.invoiceConfirmedAt
          ? new Date(formData.invoiceConfirmedAt).toISOString()
          : null,
        invoiceStatus: formData.invoiceStatus || "NOT_AVAILABLE",
      };
      const result = await createOrderFromAdmin(updatedFormData, cartItems);

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
    let chargedEntry: (typeof paymentEntries)[number] | undefined = undefined;
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
    chargedEntry = paymentEntries.find((p) => p.id === entryId);
    if (chargedEntry) {
      addCustomerNote(
        `Payment – ${chargedEntry.merchantMethod || "Method"} charged for $${
          chargedEntry.totalPrice || "0"
        }. Approval Code: ${chargedEntry.approvalCode || "123456"}.`,
        "Logged By System"
      );
    }
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

  // Auto log important Yard notes when key fields change
  // useEffect(() => {
  //   if (
  //     formData.trackingNumber &&
  //     formData.trackingNumber !== lastLogged.trackingNumber
  //   ) {
  //     addYardNote(
  //       `Tracking Number – Tracking ID Assigned: ${formData.trackingNumber}.`,
  //       "Added By System"
  //     );
  //     setLastLogged((p) => ({ ...p, trackingNumber: formData.trackingNumber }));
  //   }
  // }, [formData.trackingNumber, lastLogged.trackingNumber]);

  // Only log a new note when the user finishes input (on blur) or when the value is a valid, non-empty, and different from last logged.
  // We'll use a ref to track the last yardCost that was logged to avoid duplicate logs while typing.
  const lastLoggedYardCostRef = useRef<string>("");

  // useEffect(() => {
  //   // Only log if yardCost is not empty, is different from last logged, and is a valid number
  //   if (
  //     formData.yardCost &&
  //     formData.yardCost !== lastLoggedYardCostRef.current &&
  //     !isNaN(Number(formData.yardCost)) &&
  //     Number(formData.yardCost) > 0
  //   ) {
  //     addYardNote(
  //       `Price – Shipping Cost Recorded: $${Number(formData.yardCost).toFixed(
  //         2
  //       )}.`,
  //       "Logged By System"
  //     );
  //     setLastLogged((p) => ({ ...p, yardCost: formData.yardCost }));
  //     lastLoggedYardCostRef.current = formData.yardCost;
  //   }
  // }, [formData.yardCost]);

  // useEffect(() => {
  //   if (
  //     formData.carrierName &&
  //     formData.carrierName !== lastLogged.carrierName
  //   ) {
  //     addYardNote(
  //       `Carrier – Carrier Assigned: ${formData.carrierName}.`,
  //       "By ShippingAutomation"
  //     );
  //     setLastLogged((p) => ({ ...p, carrierName: formData.carrierName }));
  //   }
  // }, [lastLogged.carrierName, formData.carrierName]);

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

  // Notes system state
  type NoteEntry = {
    id: number;
    timestamp: Date;
    message: string;
    actor?: string;
  };

  const [customerNotes, setCustomerNotes] = useState<NoteEntry[]>([]);
  const [yardNotes, setYardNotes] = useState<NoteEntry[]>([]);
  const [customerNoteInput, setCustomerNoteInput] = useState("");
  const [yardNoteInput, setYardNoteInput] = useState("");

  const addCustomerNote = (message: string, actor?: string) => {
    console.log("Adding customer note:", { message, actor });
    const newNote = {
      id: Date.now() + Math.floor(Math.random() * 1000000),
      timestamp: new Date(),
      message,
      actor,
    };
    setCustomerNotes((prev) => {
      const updatedNotes = [newNote, ...prev];
      // setFormData(prev => ({
      //   ...prev ,
      //           customerNotes: updatedNotes
      // }))
      return updatedNotes;
    });
  };

  const addYardNote = (message: string, actor?: string) => {
    console.log("Adding yard note:", { message, actor });

    const newNote = {
      id: Date.now() + Math.floor(Math.random() * 1000000),
      timestamp: new Date(),
      message,
      actor,
    };
    setYardNotes((prev) => {
      const updatedNotes = [newNote, ...prev];
      // setFormData(prev => ({
      //   newNote
      //   ...prev ,
      //           yardNotes: updatedNotes
      // }))
      return updatedNotes;
    });
  };

  const formatDay = (d: Date | string | number) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  };

  const formatTime = (d: Date | string | number) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleManualAddCustomerNote = () => {
    if (!customerNoteInput.trim()) return;
    addCustomerNote(customerNoteInput.trim(), "By Agent");
    setCustomerNoteInput("");
  };

  const handleManualAddYardNote = () => {
    if (!yardNoteInput.trim()) return;
    addYardNote(yardNoteInput.trim(), "By Agent");
    setYardNoteInput("");
  };

  // Yard/PO/Tracking helpers
  // const handleSendPO = () => {
  //   addYardNote("PO Sent – Purchase Order emailed to yard.", "Added By System");
  // };

  const handleCreateBOL = () => {
    addYardNote(
      "Create BOL – Bill Of Lading Generated For Shipment.",
      "By LogisticsAutomation"
    );
  };

  const handleSendTracking = () => {
    if (
      formData.carrierName &&
      formData.carrierName !== lastLogged.carrierName
    ) {
      addYardNote(
        `Carrier – Carrier Assigned: ${formData.carrierName}.`,
        "By ShippingAutomation"
      );
      setLastLogged((p) => ({ ...p, carrierName: formData.carrierName }));
    }
    if (
      formData.trackingNumber &&
      formData.trackingNumber !== lastLogged.trackingNumber
    ) {
      addYardNote(
        `Tracking Number – Tracking ID Assigned: ${formData.trackingNumber}.`,
        "Added By System"
      );
      setLastLogged((p) => ({ ...p, trackingNumber: formData.trackingNumber }));
    }
    addYardNote(
      "Send Tracking Details – Tracking Details Emailed To Customer.",
      "By ShippingAutomation"
    );
  };

  const handleSendPicture = async () => {
    if (uploadedPicture) {
      // Create a URL for the uploaded file
      // const pictureUrl = window.URL.createObjectURL(uploadedPicture);

      // Convert the file to base64 to send it to the server
      const base64Image = await convertToBase64(uploadedPicture);

      // Update form data with picture information
      setFormData((prev) => ({
        ...prev,
        pictureUrl: base64Image,
        pictureStatus: "SENT",
      }));

      addCustomerNote(
        `Picture Uploaded – ${uploadedPicture.name} sent to customer.`,
        "By Agent"
      );
    } else {
      // Reset picture status if no file is selected
      setFormData((prev) => ({
        ...prev,
        pictureUrl: "",
        pictureStatus: "PENDING",
      }));
      addCustomerNote("Picture – No file selected.", "By Agent");
    }
  };
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Initialize a base note once
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    addCustomerNote(
      "Order Received – Customer placed the order online.",
      "Added By System"
    );
  }, []);

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
                    <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedPicture(e.target.files[0]);
                          }
                        }}
                      />
                      <svg
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="text-white"
                      >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mt-20">
                    <input
                      type="text"
                      className="md:text-xl font-semibold text-white bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500"
                      placeholder="Customer Name"
                      value={formData.customerName}
                      onChange={(e) =>
                        handleInputChange("customerName", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="text-white/60 bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500 mt-20 md:mt-0"
                      placeholder="Order Number"
                      value={formData.id}
                      onChange={(e) => handleInputChange("id", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-3">
                  <input
                    type="date"
                    className="text-white/60 text-sm bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500"
                    placeholder="Date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                  <select
                    className={`bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium focus:outline-none`}
                    value={formData.source}
                    onChange={(e) =>
                      handleInputChange("source", e.target.value)
                    }
                  >
                    <option value="">Source</option>
                    <option value="meta ads">Meta Ads</option>
                    <option value="meta organic">Meta Organic</option>
                    <option value="ucpc google ads">UCPC G Ads</option>
                    <option value="ucpc organic">UCPC Organic</option>
                    <option value="upr google ads">UPR G Ads</option>
                    <option value="upr organic">UPR Organic</option>
                    <option value="uap google ads">UAP G Ads</option>
                    <option value="uap organic">UAP Organic</option>
                    <option value="ap google ads">AP G Ads</option>
                    <option value="ap organic">AP Organic</option>
                  </select>
                  <select
                    className={`bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium focus:outline-none`}
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  >
                    <option value="order created">Order Created</option>
                    <option value="invoice sent">Invoice Sent</option>
                    <option value="invoice confirmed">Invoice Confirmed</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="balance due">Balance Due</option>
                    <option value="po sent">PO Sent</option>
                    <option value="po confirmed">PO Confirmed</option>
                    <option value="picture sent">Picture Sent</option>
                    <option value="tracking sent">Tracking Sent</option>
                    <option value="get w/d">Get W/D</option>
                    <option value="create bol">Create BOL</option>
                    <option value="send bol">Send BOL</option>
                    <option value="confirm bol">Confirm BOL</option>
                    <option value="cx picked the part">
                      CX Picked the part
                    </option>
                    <option value="delivery appointment done">
                      Delivery Appointment done
                    </option>
                    <option value="delivered">Delivered</option>
                  </select>
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
                  <div className="relative">
                    <label className="block text-white/60 text-sm mb-2">
                      Mobile *
                    </label>
                    <div className="relative" ref={priceOptionsRef}>
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
                      <button
                        type="button"
                        onClick={() => setShowAlternateMobileNumber(true)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p
                      className={`text-red-400 text-xs mt-1 h-4 ${
                        fieldErrors.mobile ? "" : "invisible"
                      }`}
                    >
                      {fieldErrors.mobile || "placeholder"}
                    </p>
                  </div>
                  {showAlternateMobileNumber && (
                    <div className="relative">
                      <label className="block text-white/60 text-sm mb-2">
                        Alternate Mobile *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          className={`w-full bg-[#0a1929] border rounded-lg px-4 py-3 text-white focus:outline-none ${
                            fieldErrors.alternateMobile
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-600 focus:border-blue-500"
                          }`}
                          placeholder="Enter alternate mobile number"
                          value={formData.alternateMobile}
                          onChange={(e) =>
                            handleInputChange("alternateMobile", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowAlternateMobileNumber(false);
                            handleInputChange("alternateMobile", "");
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                      <p
                        className={`text-red-400 text-xs mt-1 h-4 ${
                          fieldErrors.mobile ? "" : "invisible"
                        }`}
                      >
                        {fieldErrors.mobile || "placeholder"}
                      </p>
                    </div>
                  )}
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
              </div>
              {/* Dynamic additional price fields */}
              {(visiblePriceFields.taxesPrice ||
                visiblePriceFields.handlingPrice ||
                visiblePriceFields.processingPrice ||
                visiblePriceFields.corePrice) && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Card Info
                    </h3>
                    <button
                      onClick={() => {
                        setCardEntry(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add New Card
                    </button>
                  </div>
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
                          const err = validateField("cardDate", e.target.value);
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
                          const err = validateField("cardCvv", e.target.value);
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
                  {cardEntry && (
                    <div className="relative grid grid-cols-1 lg:grid-cols-4  gap-1">
                      <div>
                        <input
                          type="text"
                          className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                          placeholder="Card holder name"
                          value={formData.alternateCardHolderName}
                          onChange={(e) =>
                            handleInputChange(
                              "alternateCardHolderName",
                              e.target.value
                            )
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
                          value={formData.alternateCardNumber}
                          inputMode="numeric"
                          maxLength={23}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            handleInputChange("alternateCardNumber", formatted);
                          }}
                          onBlur={(e) => {
                            const err = validateField(
                              "alternateCardNumber",
                              e.target.value
                            );
                            if (err)
                              setFieldErrors((prev) => ({
                                ...prev,
                                alternateCardNumber: err,
                              }));
                          }}
                        />
                        <p
                          className={`text-red-400 text-xs mt-1 h-4 ${
                            fieldErrors.alternateCardNumber ? "" : "invisible"
                          }`}
                        >
                          {fieldErrors.alternateCardNumber || "placeholder"}
                        </p>
                        {!fieldErrors.alternateCardNumber &&
                          formData.alternateCardNumber && (
                            <p className="text-white/60 text-xs">
                              Detected card:{" "}
                              {getCardType(formData.alternateCardNumber) ||
                                "Unknown"}
                            </p>
                          )}
                      </div>
                      <div>
                        <input
                          type="text"
                          className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                          placeholder="Expire Date"
                          value={formData.alternateCardDate}
                          inputMode="numeric"
                          maxLength={7}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            handleInputChange("alternateCardDate", formatted);
                          }}
                          onBlur={(e) => {
                            const err = validateField(
                              "alternateCardDate",
                              e.target.value
                            );
                            if (err)
                              setFieldErrors((prev) => ({
                                ...prev,
                                alternateCardDate: err,
                              }));
                          }}
                        />
                        <p
                          className={`text-red-400 text-xs mt-1 h-4 ${
                            fieldErrors.alternateCardDate ? "" : "invisible"
                          }`}
                        >
                          {fieldErrors.alternateCardDate || "placeholder"}
                        </p>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                          placeholder="CVV"
                          value={formData.alternateCardCvv}
                          inputMode="numeric"
                          maxLength={
                            getCardType(formData.alternateCardNumber) ===
                            "American Express"
                              ? 4
                              : 3
                          }
                          onChange={(e) => {
                            const expected =
                              getCardType(formData.alternateCardNumber) ===
                              "American Express"
                                ? 4
                                : 3;
                            const digits = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, expected);
                            handleInputChange("alternateCardCvv", digits);
                          }}
                          onBlur={(e) => {
                            const err = validateField(
                              "alternateCardCvv",
                              e.target.value
                            );
                            if (err)
                              setFieldErrors((prev) => ({
                                ...prev,
                                alternateCardCvv: err,
                              }));
                          }}
                        />
                        <p
                          className={`text-red-400 text-xs mt-1 h-4 ${
                            fieldErrors.alternateCardCvv ? "" : "invisible"
                          }`}
                        >
                          {fieldErrors.alternateCardCvv || "placeholder"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCardEntry(false);
                          setFormData((prev) => ({
                            ...prev,
                            alternateCardNumber: "",
                            alternateCardHolderName: "",
                            alternateCardDate: "",
                            alternateCardCvv: "",
                          }));
                        }}
                        className=" absolute right-0 top-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded-full  flex items-center justify-center text-sm font-bold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
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

              {/* Product Details Section - Before Send Invoice Button */}
              <div className="flex items-center justify-between my-4">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Product Info
                </h3>
                <button
                  onClick={addProduct}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add New Product
                </button>
              </div>
              {formData.products.map((product, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[#0f1e35] rounded-lg p-4 shadow-lg  gap-6 my-2"
                >
                  {formData.products.length > 1 && (
                    <button
                      onClick={() => removeProduct(index)}
                      className="absolute right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove product"
                    >
                      <X size={16} />
                    </button>
                  )}
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
                        value={product.make}
                        onChange={(e) => {
                          handleProductInputChange(
                            index,
                            "make",
                            e.target.value
                          );
                          fetchProductVariants(index);
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
                        value={product.model}
                        onChange={(e) => {
                          handleProductInputChange(
                            index,
                            "model",
                            e.target.value
                          );
                          fetchProductVariants(index);
                        }}
                        disabled={!product.make}
                      >
                        <option value="">Select model</option>
                        {(MODELS[product.make] || []).map((model) => (
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
                        value={product.year}
                        onChange={(e) => {
                          handleProductInputChange(
                            index,
                            "year",
                            e.target.value
                          );
                          fetchProductVariants(index);
                        }}
                        disabled={
                          !product.model || availableYears[index]?.length === 0
                        }
                      >
                        <option value="">Select year</option>
                        {/* {availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))} */}
                        {availableYears[index]?.map((year) => (
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
                        value={product.parts}
                        onChange={(e) => {
                          // Only update state, let useEffect handle fetch/reset
                          handleProductInputChange(
                            index,
                            "parts",
                            e.target.value
                          );
                        }}
                      >
                        <option value="">Select parts</option>
                        <option>Engine</option>
                        <option>Transmission</option>
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
                        value={product.specification}
                        onChange={(e) => handleSpecificationChange(e, index)}
                        disabled={!product.productVariants?.length}
                      >
                        <option value="">Select Specification</option>
                        {(() => {
                          console.log(" Rendering specs for product:", product);
                          console.log(
                            " ProductVariants:",
                            product.productVariants
                          );
                          return product.productVariants?.map(
                            (variant, idx) => (
                              <option key={idx} value={variant.subPart.name}>
                                {variant.subPart.name}
                              </option>
                            )
                          );
                        })()}
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
                      Miles Promised
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none pr-10"
                        value={product.milesPromised}
                        onChange={(e) => handleMileageChange(e, index)}
                        placeholder="Enter miles or select from dropdown"
                        list={`miles-suggestions-${index}`}
                      />
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none"
                        size={16}
                      />
                      <datalist id={`miles-suggestions-${index}`}>
                        {product.selectedSubpart?.variants.map(
                          (variant, idx) => (
                            <option key={idx} value={variant.miles}>
                              {variant.miles} miles
                            </option>
                          )
                        )}
                      </datalist>
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mt-2">
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
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    VIN Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="VIN Number"
                    value={formData.vinNumber}
                    onChange={(e) =>
                      handleInputChange("vinNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    Note
                  </label>
                  <textarea
                    className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Example : Enter VIN Number .... "
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              </div>

              {/* Send Invoice Button */}
              <div className="flex justify-end gap-4">
                <button
                  className={` mt-8 w-40 h-10 px-2 py-1 rounded-lg font-medium transition-colors ${
                    isLoading || invoiceButtonState
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#006BA9] hover:bg-[#006BA9]/90 cursor-pointer"
                  } text-white`}
                  onClick={handleSendInvoice}
                  disabled={isLoading || invoiceButtonState}
                >
                  {isLoading ? "Sending Invoice..." : "Send Invoice"}
                </button>
                <div>
                  {/* <label className="block text-white/60 text-sm mb-2">
                    Invoice Status
                  </label> */}
                  <select
                    className="bg-[#0a1929] py-3 text-green-400 outline-none"
                    value={formData.invoiceStatus}
                    onChange={(e) => {
                      handleInputChange("invoiceStatus", e.target.value);
                      if (e.target.value == "no") {
                        setInvoiceButtonState(false);
                      } else if (e.target.value == "yes") {
                        setInvoiceButtonState(true);
                      } else {
                        setInvoiceButtonState(false);
                      }
                    }}
                  >
                    <option value="">Invoice Sent Status</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <div className="space-y-2">
                    {!invoiceButtonState && (
                      <div className="flex items-center justify-between bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3">
                        <span className="text-green-400 text-sm">
                          Invoice Sent
                        </span>

                        <span className="text-white/60 text-xs">
                          {/* 27Jun25 7:11pm */}
                          {invoiceDate &&
                            `${formatDay(TIME)} ${formatTime(TIME)}`}
                        </span>
                      </div>
                    )}
                    {invoiceButtonState && (
                      <div className="flex items-center justify-between bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3">
                        <span className="text-green-400 text-sm">
                          Invoice Sent
                        </span>

                        <div className="relative">
                          <input
                            type="date"
                            className="text-white text-sm placeholder:text-white"
                            value={formData.invoiceSentAt}
                            onChange={(e) =>
                              handleInputChange("invoiceSentAt", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-0.5 bg-[#0a1929] border border-gray-600 rounded-lg px-4 py-3 mb-2">
                      <span className="text-green-400 text-sm">
                        Invoice Confirm
                      </span>
                      {/* <span className="text-white/60 text-xs">
                          28Jun25 7:11pm
                        </span> */}
                      <input
                        type="date"
                        className="text-white text-sm ml-2 placeholder:text-white"
                        value={formData.invoiceConfirmedAt}
                        onChange={(e) =>
                          handleInputChange(
                            "invoiceConfirmedAt",
                            e.target.value
                          )
                        }
                      />
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
                    className="flex items-center gap-2 bg-[#006BA9] hover:bg-[#006BA9]/90 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus size={18} />
                    Add Payment
                  </button>
                </div>
              </div>
              {/* Yard Info Section */}
              <div className=" relative p-2 mt-6">
                <div className="relative flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    Yard Info
                  </h3>

                  <button
                    className="absolute right-0 top-20 hover:bg-red-600 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setStatusPopUp(!statusPopUp);
                    }}
                  >
                    <Minus size={18} />
                  </button>
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

                    <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          value={previousYards[selectedPrevYardIdx].yardAddress}
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
                          value={previousYards[selectedPrevYardIdx].yardMobile}
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
                <button
                  onClick={handleSendPO}
                  className="bg-[#006BA9] hover:bg-[#006BA9]/90 cursor-pointer mt-8 w-40 h-10 px-2 py-1 text-white  rounded-lg font-medium transition-colors"
                >
                  {isLoading ? "Sending PO..." : "Send PO"}
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
                      <span className="text-green-400 text-sm">PO Confirm</span>
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
                        onClick={handleSendPicture}
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
                          value={formData.ownShippingInfo.productType}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ownShippingInfo: {
                                ...prev.ownShippingInfo,
                                productType: e.target.value,
                              },
                            }))
                          }
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
                          value={formData.ownShippingInfo.packageType}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ownShippingInfo: {
                                ...prev.ownShippingInfo,
                                packageType: e.target.value,
                              },
                            }))
                          }
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
                        value={formData.ownShippingInfo.weight}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ownShippingInfo: {
                              ...prev.ownShippingInfo,
                              weight: e.target.value,
                            },
                          }))
                        }
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
                        value={formData.ownShippingInfo.dimensions}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ownShippingInfo: {
                              ...prev.ownShippingInfo,
                              dimensions: e.target.value,
                            },
                          }))
                        }
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
                        value={formData.ownShippingInfo.pickUpDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ownShippingInfo: {
                              ...prev.ownShippingInfo,
                              pickUpDate: e.target.value,
                            },
                          }))
                        }
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
                        value={formData.ownShippingInfo.carrier}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ownShippingInfo: {
                              ...prev.ownShippingInfo,
                              carrier: e.target.value,
                            },
                          }))
                        }
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
                        value={formData.ownShippingInfo.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ownShippingInfo: {
                              ...prev.ownShippingInfo,
                              price: e.target.value,
                            },
                          }))
                        }
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
                        value={formData.ownShippingInfo.variance}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ownShippingInfo: {
                              ...prev.ownShippingInfo,
                              variance: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleCreateBOL}
                        className="bg-[#006BA9] hover:bg-[#006BA9]/90 cursor-pointer mt-8 w-40 h-10 px-2 py-2 text-white  rounded-lg font-medium transition-colors"
                      >
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
                        value={formData.ownShippingInfo.bolNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ownShippingInfo: {
                              ...prev.ownShippingInfo,
                              bolNumber: e.target.value,
                            },
                          }))
                        }
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
                <button
                  onClick={handleSendTracking}
                  className="cursor-pointer mt-8 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-colors w-full"
                >
                  Send Tracking details
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 mb-8">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg cursor-pointer"
                onClick={handleSave}
              >
                Save
              </button>
              <button className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                Close
              </button>
            </div>

            {/* Notes Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Customer Notes */}
              <div className="bg-[#0a1929] rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-lg font-semibold">
                    Customer Notes
                  </h3>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-3">
                  <input
                    className="flex-1 bg-[#0f1e35] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                    placeholder="Notes"
                    value={customerNoteInput}
                    onChange={(e) => setCustomerNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleManualAddCustomerNote();
                      }
                    }}
                  />
                  <button
                    onClick={handleManualAddCustomerNote}
                    className="bg-[#006BA9] hover:bg-[#006BA9]/90 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="max-h-80 overflow-auto pr-1 space-y-3">
                  {customerNotes.length === 0 && (
                    <p className="text-white/60 text-sm">No notes yet</p>
                  )}
                  {customerNotes.map((n) => (
                    <div key={n.id} className="text-sm">
                      <div className="text-white/80">{n.message}</div>
                      <div className="text-white/40 text-xs">
                        {formatDay(n.timestamp)} {formatTime(n.timestamp)}
                        {n.actor ? `  |  ${n.actor}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yard Notes */}
              <div className="bg-[#0a1929] rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-lg font-semibold">
                    Yard Notes
                  </h3>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-3">
                  <input
                    className="flex-1 bg-[#0f1e35] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                    placeholder="Notes"
                    value={yardNoteInput}
                    onChange={(e) => setYardNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleManualAddYardNote();
                      }
                    }}
                  />
                  <button
                    onClick={handleManualAddYardNote}
                    className="bg-[#006BA9] hover:bg-[#006BA9]/90 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="max-h-80 overflow-auto pr-1 space-y-3">
                  {yardNotes.length === 0 && (
                    <p className="text-white/60 text-sm">No notes yet</p>
                  )}
                  {yardNotes.map((n) => (
                    <div key={n.id} className="text-sm">
                      <div className="text-white/80">{n.message}</div>
                      <div className="text-white/40 text-xs">
                        {formatDay(n.timestamp)} {formatTime(n.timestamp)}
                        {n.actor ? `  |  ${n.actor}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {statusPopUp && (
        <div className="fixed right-0 top-20 w-full h-full z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="z-50 bg-[#222c3a] w-[300px] h-[200px] rounded-lg p-4 flex flex-col justify-center items-center gap-2">
            <p className="text-white">
              Are you sure you want to remove this yard?if yes then enter the
              reason
            </p>
            <input
              className="w-full bg-[#0a1929] border border-gray-600 rounded-lg px-3 py-2 text-white"
              type="text"
              placeholder="Enter reason"
            />
            <button
              className="bg-[#006BA9] hover:bg-[#006BA9]/90 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              onClick={() => setStatusPopUp(false)}
            >
              Submit
            </button>
            <button
              className="bg-[#006BA9] hover:bg-[#006BA9]/90 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              onClick={() => setStatusPopUp(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </ProtectRoute>
  );
};

export default OrderDetails;
function setCartItems(arg0: any) {
  throw new Error("Function not implemented.");
}
