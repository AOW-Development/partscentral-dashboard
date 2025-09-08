import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  OrderFormData, 
  ProductFormData, 
  PaymentEntry, 
  MessageState, 
  VisiblePriceFields, 
  FieldErrors,
  LoadingVariants,
  AvailableYears,
  PreviousYard,
  ProductEntry
} from '@/types/orderTypes';

interface OrderState {
  // Core order data
  formData: OrderFormData;
  initialFormData: OrderFormData | null;
  
  // Loading states
  loadingOrder: boolean;
  isLoading: boolean;
  isProcessing: boolean;
  isLoadingVariants: LoadingVariants;
  
  // UI states
  showAlternateMobileNumber: boolean;
  showCompany: boolean;
  showOwnShipping: boolean;
  showYardShippingCost: boolean;
  showPriceOptions: boolean;
  showPreviousYard: boolean;
  cardEntry: boolean;
  statusPopUp: boolean;
  invoiceButtonState: boolean;
  invoiceDate: boolean;
  hasUnsavedChanges: boolean;
  isSaveDialogOpen: boolean;
  
  // Form data
  totalPrice: number;
  variantError: string;
  reason: string;
  nextPath: string | null;
  
  // Complex state objects
  message: MessageState | null;
  visiblePriceFields: VisiblePriceFields;
  fieldErrors: FieldErrors;
  paymentEntries: PaymentEntry[];
  availableYears: AvailableYears;
  previousYards: PreviousYard[];
  productEntry: ProductEntry[];
  selectedPrevYardIdx: number;
  uploadedPicture: File | null;
  
  // Actions
  setFormData: (data: OrderFormData | ((prev: OrderFormData) => OrderFormData)) => void;
  setInitialFormData: (data: OrderFormData | null) => void;
  setLoadingOrder: (loading: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setIsProcessing: (processing: boolean) => void;
  setShowAlternateMobileNumber: (show: boolean) => void;
  setShowCompany: (show: boolean) => void;
  setShowOwnShipping: (show: boolean) => void;
  setShowYardShippingCost: (show: boolean) => void;
  setShowPriceOptions: (show: boolean) => void;
  setMessage: (message: MessageState | null) => void;
  setFieldErrors: (errors: FieldErrors | ((prev: FieldErrors) => FieldErrors)) => void;
  setPaymentEntries: (entries: PaymentEntry[] | ((prev: PaymentEntry[]) => PaymentEntry[])) => void;
  updateFormField: (field: keyof OrderFormData, value: any) => void;
  updateProduct: (index: number, product: ProductFormData) => void;
  addProduct: (product: ProductFormData) => void;
  removeProduct: (index: number) => void;
  resetForm: () => void;
}

// Default form data
const defaultFormData: OrderFormData = {
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
      pictureStatus: "PENDING",
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
  warranty: "",
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
  customerNotes: [],
  yardNotes: [],
  invoiceStatus: "",
  invoiceSentAt: "",
  invoiceConfirmedAt: "",
  vinNumber: "",
  notes: "",
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
};

const defaultVisiblePriceFields: VisiblePriceFields = {
  partPrice: true,
  taxesPrice: false,
  handlingPrice: false,
  processingPrice: false,
  corePrice: false,
  totalSellingPrice: true,
  totalPrice: true,
};

export const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
      // Initial state
      formData: defaultFormData,
      initialFormData: null,
      loadingOrder: true,
      isLoading: false,
      isProcessing: true,
      isLoadingVariants: {},
      showAlternateMobileNumber: false,
      showCompany: false,
      showOwnShipping: false,
      showYardShippingCost: false,
      showPriceOptions: false,
      showPreviousYard: false,
      cardEntry: false,
      statusPopUp: false,
      invoiceButtonState: false,
      invoiceDate: false,
      hasUnsavedChanges: false,
      isSaveDialogOpen: false,
      totalPrice: 0,
      variantError: "",
      reason: "",
      nextPath: null,
      message: null,
      visiblePriceFields: defaultVisiblePriceFields,
      fieldErrors: {},
      paymentEntries: [
        {
          id: 1,
          merchantMethod: "",
          cardHolderName: "",
          cardNumber: "",
          cardDate: "",
          cardCvv: "",
          approvalCode: "",
          entity: "",
          charged: "",
          totalPrice: "",
        },
      ],
      availableYears: {},
      previousYards: [
        { yardName: "", yardMobile: "", yardAddress: "", yardEmail: "" },
        { yardName: "", yardMobile: "", yardAddress: "", yardEmail: "" },
        { yardName: "", yardMobile: "", yardAddress: "", yardEmail: "" },
        { yardName: "", yardMobile: "", yardAddress: "", yardEmail: "" },
        { yardName: "", yardMobile: "", yardAddress: "", yardEmail: "" },
      ],
      productEntry: [{ count: 1 }],
      selectedPrevYardIdx: 0,
      uploadedPicture: null,

      // Actions
      setFormData: (data) => 
        set((state) => ({
          formData: typeof data === 'function' ? data(state.formData) : data,
          hasUnsavedChanges: true,
        })),

      setInitialFormData: (data) => set({ initialFormData: data }),
      
      setLoadingOrder: (loading) => set({ loadingOrder: loading }),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      
      setShowAlternateMobileNumber: (show) => set({ showAlternateMobileNumber: show }),
      
      setShowCompany: (show) => set({ showCompany: show }),
      
      setShowOwnShipping: (show) => set({ showOwnShipping: show }),
      
      setShowYardShippingCost: (show) => set({ showYardShippingCost: show }),
      
      setShowPriceOptions: (show) => set({ showPriceOptions: show }),
      
      setMessage: (message) => set({ message }),
      
      setFieldErrors: (errors) => 
        set((state) => ({
          fieldErrors: typeof errors === 'function' ? errors(state.fieldErrors) : errors,
        })),

      setPaymentEntries: (entries) =>
        set((state) => ({
          paymentEntries: typeof entries === 'function' ? entries(state.paymentEntries) : entries,
        })),

      updateFormField: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
          hasUnsavedChanges: true,
        })),

      updateProduct: (index, product) =>
        set((state) => ({
          formData: {
            ...state.formData,
            products: state.formData.products.map((p, i) => (i === index ? product : p)),
          },
          hasUnsavedChanges: true,
        })),

      addProduct: (product) =>
        set((state) => ({
          formData: {
            ...state.formData,
            products: [...state.formData.products, product],
          },
          hasUnsavedChanges: true,
        })),

      removeProduct: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            products: state.formData.products.filter((_, i) => i !== index),
          },
          hasUnsavedChanges: true,
        })),

      resetForm: () => set({ 
        formData: defaultFormData,
        hasUnsavedChanges: false,
        fieldErrors: {},
        message: null,
      }),
    }),
    {
      name: 'order-store',
    }
  )
);
