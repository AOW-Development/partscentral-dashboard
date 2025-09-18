import { create } from "zustand";

// --- Shared fields (used by both refund & replacement) ---
export interface SharedFields {
  returnShipping: string;
}

// --- Refund form data ---
export interface DamagedProductForm {
  requestFromCustomer: string;
  customerRefund: string;
  yardRefund: string;
  amount: string;
  yardAmount: string;
  photos: File[];
  bolFile: File | null;
  returnShippingPrice: string;
  productReturned: string;
}

// --- Replacement form data ---
export interface ReplacementFormData {
  hasReplacement: string; // "Yes" | "No" | ""
  carrierName: string; // Used for the 'Yes' option
  trackingNumber: string; // Used for the 'Yes' option
  eta: string; // Used for the 'Yes' option
  yardName: string; // Used for the 'No' option
  attnName: string; // Added to store the attention name
  yardAddress: string; // Used for the 'No' option
  yardPhone: string; // Used for the 'No' option
  yardEmail: string; // Used for the 'No' option
  warranty: string; // Used for the 'No' option
  yardMiles: string; // Added to store the miles
  shipping: string; // Renamed from 'offering' to match design, used for 'No'
  replacementPrice: string;
  taxesPrice?: string; // Added new price field
  handlingPrice?: string; // Added new price field
  processingPrice?: string; // Added new price field
  corePrice?: string; // Added new price field
  yardCost?: string; // Added to store yard shipping cost
  returnShippingPrice: string;
  productReturned: string;
  pictureStatus: string; // New field for the 'No' option
  redeliveryCarrierName: string; // New field for the 'No' option's tracking details
  redeliveryTrackingNumber: string; // New field for the 'No' option's tracking details
  poStatus: string; // New field to store PO status
}

interface DamagedProductState {
  shared: SharedFields;
  formData: DamagedProductForm;
  replacementData: ReplacementFormData;
  setSharedField: (field: keyof SharedFields, value: any) => void;
  setField: (field: keyof DamagedProductForm, value: any) => void;
  setReplacementField: (field: keyof ReplacementFormData, value: any) => void;
  resetForm: () => void;
  resetReplacement: () => void;
}

// --- Initial states ---
const initialShared: SharedFields = {
  returnShipping: "",
};

const initialFormData: DamagedProductForm = {
  requestFromCustomer: "",
  customerRefund: "",
  yardRefund: "",
  amount: "",
  yardAmount: "",
  photos: [],
  bolFile: null,
  returnShippingPrice: "",
  productReturned: "",
};

const initialReplacementData: ReplacementFormData = {
  hasReplacement: "",
  carrierName: "",
  trackingNumber: "",
  eta: "",
  yardName: "",
  attnName: "", // Initialized with an empty string
  yardAddress: "",
  yardPhone: "",
  yardEmail: "",
  warranty: "",
  yardMiles: "", // Initialized with an empty string
  shipping: "",
  replacementPrice: "",
  taxesPrice: "",
  handlingPrice: "",
  processingPrice: "",
  corePrice: "",
  yardCost: "",
  returnShippingPrice: "",
  productReturned: "",
  pictureStatus: "",
  redeliveryCarrierName: "",
  redeliveryTrackingNumber: "",
  poStatus: "",
};

// --- Store ---
export const useDamagedProductStore = create<DamagedProductState>((set) => ({
  shared: initialShared,
  formData: initialFormData,
  replacementData: initialReplacementData,

  setSharedField: (field, value) =>
    set((state) => ({
      shared: { ...state.shared, [field]: value },
    })),

  setField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  setReplacementField: (field, value) =>
    set((state) => ({
      replacementData: { ...state.replacementData, [field]: value },
    })),

  resetForm: () => set({ formData: initialFormData }),
  resetReplacement: () => set({ replacementData: initialReplacementData }),
}));