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
  yardRefund: string;
  yardRefundAmount: string;
  hasReplacement: string; 
  carrierName: string; 
  trackingNumber: string; 
  eta: string; 
  yardName: string; 
  attnName: string; 
  yardAddress: string; 
  yardPhone: string; 
  yardEmail: string; 
  warranty: string; 
  yardMiles: string; 
  shipping: string; 
  replacementPrice: string;
  taxesPrice?: string; 
  handlingPrice?: string; 
  processingPrice?: string; 
  corePrice?: string; 
  yardCost?: string; 
  returnShippingPrice: string;
  productReturned: string;
  pictureStatus: string;
  redeliveryCarrierName: string; 
  redeliveryTrackingNumber: string; 
  poStatus: string; 
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
  yardRefund: "",
  yardRefundAmount: "",
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