const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// TYPE DEFINITIONS

export interface CreateProblematicPartPayload {
  orderId: string;
  problemType: "damaged" | "defective" | "wrong";

  // Common fields
  requestFromCustomer?: string;
  returnShipping?: string;
  customerRefund?: string;
  yardRefund?: string;
  amount?: string | number;
  yardAmount?: string | number;
  returnShippingPrice?: string | number;
  productReturned?: string;
  photos?: string[];
  bolFile?: string;

  // Defective specific
  problemCategory?: string;
  description?: string;
  serviceDocuments?: string[];

  // Wrong product specific
  make?: string;
  model?: string;
  year?: string;
  parts?: string;
  specification?: string;

  // Replacement data
  replacement?: ReplacementPayload;

  // Metadata
  notes?: string;
  metadata?: any;
}

export interface ReplacementPayload {
  hasReplacement?: string;
  carrierName?: string;
  trackingNumber?: string;
  eta?: string;
  yardRefund?: string;
  yardRefundAmount?: string | number;
  yardName?: string;
  attnName?: string;
  yardAddress?: string;
  yardPhone?: string;
  yardEmail?: string;
  warranty?: string;
  yardMiles?: string;
  shipping?: string;
  replacementPrice?: string | number;
  taxesPrice?: string | number;
  handlingPrice?: string | number;
  processingPrice?: string | number;
  corePrice?: string | number;
  yardCost?: string | number;
  pictureStatus?: string;
  poStatus?: string;
  poSentAt?: Date | string;
  poConfirmedAt?: Date | string;
  redeliveryCarrierName?: string;
  redeliveryTrackingNumber?: string;
  metadata?: any;
}

// CREATE OR UPDATE PROBLEMATIC PART

/**
 * Creates or updates a problematic part
 * If problematicPartId is provided, it will update the existing record
 * Otherwise, it will create a new record
 */
export const createOrUpdateProblematicPart = async (
  payload: CreateProblematicPartPayload,
  problematicPartId?: string
): Promise<any> => {
  try {
    console.log("Submitting problematic part:", { payload, problematicPartId });

    const url = problematicPartId
      ? `${API_URL}/problematic-parts/${problematicPartId}`
      : `${API_URL}/problematic-parts`;

    const method = problematicPartId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save problematic part");
    }

    const data = await response.json();
    console.log("Problematic part saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error saving problematic part:", error);
    throw error;
  }
};

// GET PROBLEMATIC PARTS BY ORDER ID

export const getProblematicPartsByOrderId = async (
  orderId: string
): Promise<any[]> => {
  try {
    const response = await fetch(
      `${API_URL}/problematic-parts/order/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch problematic parts");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching problematic parts:", error);
    throw error;
  }
};

// GET PROBLEMATIC PART BY ID

export const getProblematicPartById = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/problematic-parts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch problematic part");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching problematic part:", error);
    throw error;
  }
};

// DELETE PROBLEMATIC PART

export const deleteProblematicPart = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/problematic-parts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete problematic part");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting problematic part:", error);
    throw error;
  }
};

// HELPER: Build Payload from Zustand Store

/**
 * Converts Zustand store state to API payload
 */
export const buildPayloadFromStore = (
  orderId: string,
  activeFormType: "damaged" | "defective" | "wrong",
  common: any,
  formSpecific: any,
  replacement?: any
): CreateProblematicPartPayload => {
  const payload: CreateProblematicPartPayload = {
    orderId,
    problemType: activeFormType,

    // Common fields
    requestFromCustomer: common.requestFromCustomer,
    returnShipping: common.returnShipping,
    customerRefund: common.customerRefund,
    yardRefund: common.yardRefund,
    amount: common.amount,
    yardAmount: common.yardAmount,
    returnShippingPrice: common.returnShippingPrice,
    productReturned: common.productReturned,
    photos: common.photos,
    bolFile: common.bolFile,
  };

  // Add form-specific fields
  if (activeFormType === "defective") {
    payload.problemCategory = formSpecific.problemCategory;
    payload.description = formSpecific.description;
    payload.serviceDocuments = formSpecific.serviceDocument;
  } else if (activeFormType === "wrong") {
    payload.make = formSpecific.make;
    payload.model = formSpecific.model;
    payload.year = formSpecific.year;
    payload.parts = formSpecific.parts;
    payload.specification = formSpecific.specification;
  }

  // Add replacement data if applicable
  if (common.requestFromCustomer === "Replacement" && replacement) {
    payload.replacement = {
      hasReplacement: replacement.hasReplacement,
      carrierName: replacement.carrierName,
      trackingNumber: replacement.trackingNumber,
      eta: replacement.eta,
      yardRefund: replacement.yardRefund,
      yardRefundAmount: replacement.yardRefundAmount,
      yardName: replacement.yardName,
      attnName: replacement.attnName,
      yardAddress: replacement.yardAddress,
      yardPhone: replacement.yardPhone,
      yardEmail: replacement.yardEmail,
      warranty: replacement.warranty,
      yardMiles: replacement.yardMiles,
      shipping: replacement.shipping,
      replacementPrice: replacement.replacementPrice,
      taxesPrice: replacement.taxesPrice,
      handlingPrice: replacement.handlingPrice,
      processingPrice: replacement.processingPrice,
      corePrice: replacement.corePrice,
      yardCost: replacement.yardCost,
      pictureStatus: replacement.pictureStatus,
      poStatus: replacement.poStatus,
      poSentAt: replacement.poSentAt,
      poConfirmedAt: replacement.poConfirmedAt,
      redeliveryCarrierName: replacement.redeliveryCarrierName,
      redeliveryTrackingNumber: replacement.redeliveryTrackingNumber,
    };
  }

  return payload;
};
