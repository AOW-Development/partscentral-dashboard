const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type CartItem = {
  id: string;
  sku?: string;
  quantity: number;
  price: number;
  taxesPrice?: number;
  handlingPrice?: number;
  processingPrice?: number;
  corePrice?: number;
  warranty?: string;
  milesPromised?: string | number;
  specification?: string;
  pictureUrl?: string;
  pictureStatus?: string;
  source?: string;
  [key: string]: any; // For any additional properties
};

const mapWarrantyToPrismaEnum = (warranty: string): string => {
  switch (warranty) {
    case "30 Days":
      return "WARRANTY_30_DAYS";
    case "60 Days":
      return "WARRANTY_60_DAYS";
    case "90 Days":
      return "WARRANTY_90_DAYS";
    case "6 Months":
      return "WARRANTY_6_MONTHS";
    case "1 Year":
      return "WARRANTY_1_YEAR";
    default:
      return ""; // Default or handle error
  }
};


export const updateOrderWithPicture = async (
  orderId: string,
  pictureStatus: string,
  pictureUrl: string
) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pictureStatus,
        pictureUrl
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update order picture");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order picture:", error);
    throw error;
  }
};

export const updateOrderFromAdmin = async (
  orderId: string,
  formData: any,
  cartItems: CartItem[],
  paymentEntries: any[] = [],
  previousYards: any[] = []
) => {
  const orderData = {
    billingInfo: {
      firstName: formData.cardHolderName?.split(" ")[0] || "",
      lastName: formData.cardHolderName?.split(" ").slice(1).join(" ") || "",
      address: formData.billingAddress || "",
      city: formData.billingCity || formData.shippingCity || "",
      state: formData.billingState || formData.shippingState || "CA",
      postalCode:
        formData.billingPostalCode || formData.shippingPostalCode || "00000",
      country: "US",
      phone: formData.mobile || "",
      email: formData.email || "",
      company: formData.billingCompany || formData.company || null,
      addressType:
        formData.billingAddressType ||
        formData.shippingAddressType ||
        "RESIDENTIAL",
    },
    shippingInfo: {
      firstName: formData.cardHolderName?.split(" ")[0] || "",
      lastName: formData.cardHolderName?.split(" ").slice(1).join(" ") || "",
      address: formData.shippingAddress || "",
      city: formData.shippingCity || "",
      state: formData.shippingState || "CA",
      postalCode: formData.shippingPostalCode || "",
      country: "US",
      phone: formData.mobile || "",
      email: formData.email || "",
      company: formData.company || null,
      addressType: formData.shippingAddressType || "RESIDENTIAL",
    },
    customerInfo: {
      email: formData.email || "",
      phone: formData.mobile || "",
      alternativePhone: formData.alternateMobile,
      firstName: formData.customerName || "unknown name provided",
      company: formData.company || null,
      address: formData.shippingAddress || "",
      city: formData.shippingCity || "",
      state: formData.shippingState || "CA",
      postalCode: formData.shippingPostalCode || "00000",
      country: "US",
      type: formData.shippingAddressType || "RESIDENTIAL",
    },
    cartItems: cartItems.map((item) => {
      const sku = item.id;
      if (!sku) {
        console.error("Missing SKU for cart item:", item);
        throw new Error("Product variant SKU is required");
      }
      return {
        id: sku,
        sku: sku,
        quantity: item.quantity || 1,
        price: item.price,
        taxesPrice: item.taxesPrice || 0,
        handlingPrice: item.handlingPrice || 0,
        processingPrice: item.processingPrice || 0,
        corePrice: item.corePrice || 0,
        name: `Engine for ${sku.split("-").slice(0, 3).join(" ")}`,
        milesPromised: item.milesPromised,
        specification: item.specification || "",
        productVariantId: sku,
        // pictureUrl: item.pictureUrl || "",
        // pictureStatus: item.pictureStatus || "PENDING",
      };
    }),
    paymentInfo:
      paymentEntries.length > 0
        ? paymentEntries.map((entry) => ({
            ...entry,
            amount: entry.totalPrice, // Map totalPrice to amount for backend
            cardData: formData.cardNumber
              ? {
                  cardNumber: formData.cardNumber,
                  cardholderName: formData.cardHolderName,
                  expirationDate: formData.cardDate,
                  securityCode: formData.cardCvv,
                  last4: formData.cardNumber.slice(-4),
                  brand: formData.cardNumber.startsWith("4")
                    ? "Visa"
                    : "Mastercard",
                }
              : null,
            alternateCardData: formData.alternateCardNumber
              ? {
                  cardNumber: formData.alternateCardNumber,
                  cardholderName: formData.alternateCardHolderName,
                  expirationDate: formData.alternateCardDate,
                  securityCode: formData.alternateCardCvv,
                  last4: formData.alternateCardNumber.slice(-4),
                  brand: formData.alternateCardNumber.startsWith("4")
                    ? "Visa"
                    : "Mastercard",
                }
              : null,
          }))
        : {
            paymentMethod: formData.merchantMethod || "",
            status: "PENDING",
            amount: formData.paymentAmount || formData.totalPrice || 0,
            currency: "USD",
            provider: "STRIPE",
            entity: formData.entity || null,
            cardData: formData.cardNumber
              ? {
                  cardNumber: formData.cardNumber,
                  cardholderName: formData.cardHolderName,
                  expirationDate: formData.cardDate,
                  securityCode: formData.cardCvv,
                  last4: formData.cardNumber.slice(-4),
                  brand: formData.cardNumber.startsWith("4")
                    ? "Visa"
                    : "Mastercard",
                }
              : null,
            alternateCardData: formData.alternateCardNumber
              ? {
                  cardNumber: formData.alternateCardNumber,
                  cardholderName: formData.alternateCardHolderName,
                  expirationDate: formData.alternateCardDate,
                  securityCode: formData.alternateCardCvv,
                  last4: formData.alternateCardNumber.slice(-4),
                  brand: formData.alternateCardNumber.startsWith("4")
                    ? "Visa"
                    : "Mastercard",
                }
              : null,
            approvelCode: formData.approvalCode,
            charged: formData.charged,
            cardChargedDate: formData.cardChargedDate,
          },
    internalNotes: formData.internalNotes,
    totalAmount: parseFloat(formData.totalPrice as string) || 0,
    subtotal: parseFloat(formData.partPrice as string) || 0,
    orderNumber: formData.id,
    carrierName: formData.carrierName || "",
    trackingNumber: formData.trackingNumber || "",
    estimatedDeliveryDate: formData.estimatedDeliveryDate
      ? new Date(formData.estimatedDeliveryDate).toISOString()
      : null,
    saleMadeBy: formData.saleMadeBy || "Admin",
    taxesAmount: parseFloat(formData.taxesPrice as string) || 0,
    shippingAmount: parseFloat(formData.yardCost as string) || 0,
    handlingFee: parseFloat(formData.handlingPrice as string) || 0,
    processingFee: parseFloat(formData.processingPrice as string) || 0,
    corePrice: parseFloat(formData.corePrice as string) || 0,
    customerNotes: formData.customerNotes,
    yardNotes: formData.yardNotes,
    year: formData.year,
    shippingAddress: formData.shippingAddress,
    billingAddress: formData.billingAddress,
    companyName: formData.company,
    source: formData.source,
    status: formData.status,
    vinNumber: formData.vinNumber,
    notes: formData.notes,
    warranty: mapWarrantyToPrismaEnum(formData.warranty || ""),
    invoiceSentAt: formData.invoiceSentAt
      ? new Date(formData.invoiceSentAt).toISOString()
      : null,
    invoiceStatus: formData.invoiceStatus,
    invoiceConfirmedAt: formData.invoiceConfirmedAt
      ? new Date(formData.invoiceConfirmedAt).toISOString()
      : null,
    poSentAt: formData.poSentAt
      ? new Date(formData.poSentAt).toISOString()
      : null,
    poStatus: formData.poStatus,
    poConfirmAt: formData.poConfirmedAt
      ? new Date(formData.poConfirmedAt).toISOString()
      : null,
    orderDate: formData.date
      ? new Date(formData.date).toISOString()
      : new Date().toISOString(),
    addressType: formData.shippingAddressType,
    orderCategoryStatus: formData.orderCategoryStatus || null,
    problematicIssueType: formData.problematicIssueType || null,
    ...(formData.yardName && {
      yardInfo: {
        yardName: formData.yardName,
        attnName: formData.attnName,
        yardAddress: formData.yardAddress || "",
        yardMobile: formData.yardMobile || "",
        yardEmail: formData.yardEmail || "",
        yardPrice: parseFloat(formData.yardPrice as string) || 0,
        yardWarranty: mapWarrantyToPrismaEnum(
          formData.yardWarranty || ""
        ),
        yardMiles: parseFloat(formData.yardMiles as string) || 0,
        yardShippingType: formData.yardShipping || "OWN_SHIPPING",
        yardShippingCost: parseFloat(formData.yardCost as string) || 0,
        reason: formData.reason || "No reason provided",
        yardTaxesPrice: parseFloat(formData.taxesYardPrice as string) || 0,
        yardHandlingFee: parseFloat(formData.handlingYardPrice as string) || 0,
        yardProcessingFee:
          parseFloat(formData.processingYardPrice as string) || 0,
        yardCorePrice: parseFloat(formData.coreYardPrice as string) || 0,
        ...(formData.yardShipping === "Own Shipping" && formData.ownShippingInfo
          ? { yardOwnShippingInfo: formData.ownShippingInfo }
          : {}),
      },
    }),
    
  };

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order from admin:", error);
    throw error;
  }
};