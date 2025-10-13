import { create } from "zustand";

// ======================================
// COMMON FIELDS - Shared across all problem types
// ======================================
export interface CommonFields {
  requestFromCustomer: string; // "Refund" | "Replacement"
  returnShipping: string; // "Not required" | "Yard Shipping" | "Own Shipping"
  customerRefund: string; // "Yes" | "No"
  yardRefund: string; // "Yes" | "No"
  amount: string; // Customer refund amount
  yardAmount: string; // Yard refund amount
  returnShippingPrice: string; // Only for "Own Shipping"
  productReturned: string; // "Yes" | "No"
  photos: File[]; // Uploaded photos
  bolFile: File | null; // Bill of Lading file
}

// ======================================
// DAMAGED PRODUCT - No additional fields beyond common
// ======================================
export interface DamagedProductFields {
  // Damaged product uses only common fields
}

// ======================================
// DEFECTIVE PRODUCT - Has problem category and description
// ======================================
export interface DefectiveProductFields {
  problemCategory: string; // "Other" | "Damaged" | "Wrong Part" | "Defective" | "Missing"
  description: string; // Description of defective parts
  serviceDocument: File[]; // Service document uploads
}

// ======================================
// WRONG PRODUCT - Has vehicle information
// ======================================
export interface WrongProductFields {
  make: string; // Vehicle make
  model: string; // Vehicle model
  year: string; // Vehicle year
  specification: string; // Part specification
}

// ======================================
// REPLACEMENT FORM DATA - Used when requestFromCustomer = "Replacement"
// ======================================
export interface ReplacementFormData {
  // Does yard have replacement?
  hasReplacement: string; // "Yes" | "No"

  // If Yes - Re-delivery tracking
  carrierName: string;
  trackingNumber: string;
  eta: string;

  // If No - New yard information
  yardRefund: string; // "Yes" | "No"
  yardRefundAmount: string;
  yardName: string;
  attnName: string;
  yardAddress: string;
  yardPhone: string;
  yardEmail: string;
  warranty: string; // "30 Days" | "60 Days" | "90 Days" | "6 Months" | "1 Year"
  yardMiles: string;
  shipping: string; // "Own Shipping" | "Yard Shipping"

  // Pricing
  replacementPrice: string;
  taxesPrice?: string;
  handlingPrice?: string;
  processingPrice?: string;
  corePrice?: string;
  yardCost?: string; // Yard shipping cost

  // PO and Picture Status
  pictureStatus: string; // "Yes" | "No"
  poStatus: string;

  // Re-delivery tracking (for replacement from new yard)
  redeliveryCarrierName: string;
  redeliveryTrackingNumber: string;
}

// ======================================
// MAIN STORE STATE
// ======================================
interface ProblematicPartsState {
  // Track which form is active
  activeFormType: "damaged" | "defective" | "wrong" | null;

  // Edit mode tracking
  problematicPartId: string | null; // For update operations
  orderId: string | null; // Current order ID

  // Submission state
  isSubmitting: boolean;
  submitError: string | null;

  // Common fields (shared by all form types)
  common: CommonFields;

  // Form-specific fields
  damaged: DamagedProductFields;
  defective: DefectiveProductFields;
  wrong: WrongProductFields;

  // Replacement data (shared by all forms when requestFromCustomer = "Replacement")
  replacement: ReplacementFormData;

  // Actions
  setActiveFormType: (type: "damaged" | "defective" | "wrong") => void;
  setProblematicPartId: (id: string | null) => void;
  setOrderId: (id: string | null) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitError: (error: string | null) => void;
  setCommonField: (field: keyof CommonFields, value: any) => void;
  setDamagedField: (field: keyof DamagedProductFields, value: any) => void;
  setDefectiveField: (field: keyof DefectiveProductFields, value: any) => void;
  setWrongField: (field: keyof WrongProductFields, value: any) => void;
  setReplacementField: (field: keyof ReplacementFormData, value: any) => void;

  // Load existing data
  loadProblematicPart: (data: any) => void;

  // Reset functions
  resetAll: () => void;
  resetCommon: () => void;
  resetReplacement: () => void;
}

// ======================================
// INITIAL STATES
// ======================================
const initialCommon: CommonFields = {
  requestFromCustomer: "",
  returnShipping: "",
  customerRefund: "",
  yardRefund: "",
  amount: "",
  yardAmount: "",
  returnShippingPrice: "",
  productReturned: "",
  photos: [],
  bolFile: null,
};

const initialDamaged: DamagedProductFields = {};

const initialDefective: DefectiveProductFields = {
  problemCategory: "",
  description: "",
  serviceDocument: [],
};

const initialWrong: WrongProductFields = {
  make: "",
  model: "",
  year: "",
  specification: "",
};

const initialReplacement: ReplacementFormData = {
  hasReplacement: "",
  carrierName: "",
  trackingNumber: "",
  eta: "",
  yardRefund: "",
  yardRefundAmount: "",
  yardName: "",
  attnName: "",
  yardAddress: "",
  yardPhone: "",
  yardEmail: "",
  warranty: "",
  yardMiles: "",
  shipping: "",
  replacementPrice: "",
  taxesPrice: "",
  handlingPrice: "",
  processingPrice: "",
  corePrice: "",
  yardCost: "",
  pictureStatus: "",
  poStatus: "",
  redeliveryCarrierName: "",
  redeliveryTrackingNumber: "",
};

// ======================================
// ZUSTAND STORE
// ======================================
export const useProblematicPartsStore = create<ProblematicPartsState>(
  (set) => ({
    activeFormType: null,
    problematicPartId: null,
    orderId: null,
    isSubmitting: false,
    submitError: null,
    common: initialCommon,
    damaged: initialDamaged,
    defective: initialDefective,
    wrong: initialWrong,
    replacement: initialReplacement,

    setActiveFormType: (type) => set({ activeFormType: type }),
    setProblematicPartId: (id) => set({ problematicPartId: id }),
    setOrderId: (id) => set({ orderId: id }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setSubmitError: (error) => set({ submitError: error }),

    setCommonField: (field, value) =>
      set((state) => ({
        common: { ...state.common, [field]: value },
      })),

    setDamagedField: (field, value) =>
      set((state) => ({
        damaged: { ...state.damaged, [field]: value },
      })),

    setDefectiveField: (field, value) =>
      set((state) => ({
        defective: { ...state.defective, [field]: value },
      })),

    setWrongField: (field, value) =>
      set((state) => ({
        wrong: { ...state.wrong, [field]: value },
      })),

    setReplacementField: (field, value) =>
      set((state) => ({
        replacement: { ...state.replacement, [field]: value },
      })),

    resetAll: () =>
      set({
        activeFormType: null,
        problematicPartId: null,
        orderId: null,
        isSubmitting: false,
        submitError: null,
        common: initialCommon,
        damaged: initialDamaged,
        defective: initialDefective,
        wrong: initialWrong,
        replacement: initialReplacement,
      }),

    loadProblematicPart: (data) =>
      set((state) => {
        if (!data) return state;

        // Map problem type
        const problemTypeMap: Record<
          string,
          "damaged" | "defective" | "wrong"
        > = {
          DAMAGED: "damaged",
          DEFECTIVE: "defective",
          WRONG_PRODUCT: "wrong",
        };

        const activeFormType = problemTypeMap[data.problemType] || "damaged";

        // Load common fields
        const common: CommonFields = {
          requestFromCustomer: data.requestFromCustomer || "",
          returnShipping: data.returnShipping || "",
          customerRefund: data.customerRefund || "",
          yardRefund: data.yardRefund || "",
          amount: data.amount?.toString() || "",
          yardAmount: data.yardAmount?.toString() || "",
          returnShippingPrice: data.returnShippingPrice?.toString() || "",
          productReturned: data.productReturned || "",
          photos: [], // Files can't be loaded from DB
          bolFile: null,
        };

        // Load form-specific fields
        let defective = state.defective;
        let wrong = state.wrong;

        if (activeFormType === "defective") {
          defective = {
            problemCategory: data.problemCategory || "",
            description: data.description || "",
            serviceDocument: [],
          };
        } else if (activeFormType === "wrong") {
          wrong = {
            make: data.make || "",
            model: data.model || "",
            year: data.year || "",
            specification: data.specification || "",
          };
        }

        // Load replacement data
        let replacement = state.replacement;
        if (data.replacement) {
          replacement = {
            hasReplacement: data.replacement.hasReplacement || "",
            carrierName: data.replacement.carrierName || "",
            trackingNumber: data.replacement.trackingNumber || "",
            eta: data.replacement.eta || "",
            yardRefund: data.replacement.yardRefund || "",
            yardRefundAmount:
              data.replacement.yardRefundAmount?.toString() || "",
            yardName: data.replacement.yardName || "",
            attnName: data.replacement.attnName || "",
            yardAddress: data.replacement.yardAddress || "",
            yardPhone: data.replacement.yardPhone || "",
            yardEmail: data.replacement.yardEmail || "",
            warranty: data.replacement.warranty || "",
            yardMiles: data.replacement.yardMiles || "",
            shipping: data.replacement.shipping || "",
            replacementPrice:
              data.replacement.replacementPrice?.toString() || "",
            taxesPrice: data.replacement.taxesPrice?.toString() || "",
            handlingPrice: data.replacement.handlingPrice?.toString() || "",
            processingPrice: data.replacement.processingPrice?.toString() || "",
            corePrice: data.replacement.corePrice?.toString() || "",
            yardCost: data.replacement.yardCost?.toString() || "",
            pictureStatus: data.replacement.pictureStatus || "",
            poStatus: data.replacement.poStatus || "",
            redeliveryCarrierName: data.replacement.redeliveryCarrierName || "",
            redeliveryTrackingNumber:
              data.replacement.redeliveryTrackingNumber || "",
          };
        }

        return {
          activeFormType,
          problematicPartId: data.id,
          orderId: data.orderId,
          common,
          defective,
          wrong,
          replacement,
        };
      }),

    resetCommon: () => set({ common: initialCommon }),
    resetReplacement: () => set({ replacement: initialReplacement }),
  })
);

// For backward compatibility (if needed elsewhere)
export const useDamagedProductStore = useProblematicPartsStore;
