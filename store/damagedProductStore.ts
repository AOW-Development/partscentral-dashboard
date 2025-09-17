import { create } from "zustand";

export interface DamagedProductForm {
  // Existing fields
  requestFromCustomer: string;
  returnShipping: string;
  customerRefund: string;
  yardRefund: string;
  amount: string;
  yardAmount: string;
  photos: File[];
  bolFile: File | null;
  returnShippingPrice: string;
  productReturned: string;

  // New fields for ReplacementForm
  carrierName: string;
  trackingNumber: string;
  eta: string;
  replacementPrice: string;
}

interface DamagedProductState {
  formData: DamagedProductForm;
  setField: (field: keyof DamagedProductForm, value: any) => void;
  resetForm: () => void;
}

const initialState: DamagedProductForm = {
  // Existing initial values
  requestFromCustomer: "",
  returnShipping: "",
  customerRefund: "",
  yardRefund: "",
  amount: "",
  yardAmount: "",
  photos: [],
  bolFile: null,
  returnShippingPrice: "",
  productReturned: "",

  // New initial values for ReplacementForm
  carrierName: "",
  trackingNumber: "",
  eta: "",
  replacementPrice: "0.00", // Initializing as "0.00" to match your blur logic
};

export const useDamagedProductStore = create<DamagedProductState>((set) => ({
  formData: initialState,
  setField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  resetForm: () => set({ formData: initialState }),
}));