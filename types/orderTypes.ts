// Import external types
import { GroupedVariant } from "@/utils/productApi";

// === Core Order Types ===

export interface NoteEntry {
  id: number;
  timestamp: Date;
  message: string;
  actor?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  milesPromised?: string;
  specification?: string;
}

export interface ProductFormData {
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
}

export interface OwnShippingInfo {
  productType: string;
  packageType: string;
  weight: string;
  dimensions: string;
  pickUpDate: string;
  carrier: string;
  price: string;
  variance: string;
  bolNumber: string;
}

export interface OrderFormData {
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
  ownShippingInfo: OwnShippingInfo;
}

// === Payment Types ===

export interface PaymentEntry {
  id: number;
  merchantMethod: string;
  cardHolderName: string;
  cardNumber: string;
  cardDate: string;
  cardCvv: string;
  approvalCode: string;
  entity: string;
  charged: string;
  totalPrice: string | number;
  chargeClicked?: boolean;
}

// === UI State Types ===

export interface MessageState {
  text: string;
  type: "success" | "error" | "info";
}

export interface VisiblePriceFields {
  partPrice: boolean;
  taxesPrice: boolean;
  handlingPrice: boolean;
  processingPrice: boolean;
  corePrice: boolean;
  totalSellingPrice: boolean;
  totalPrice: boolean;
}

export interface FieldErrors {
  [key: string]: string;
}

// === Yard Types ===

export interface PreviousYard {
  yardName: string;
  yardMobile: string;
  yardAddress: string;
  yardEmail: string;
}

// === Product Entry Types ===

export interface ProductEntry {
  count: number;
}

// === Loading State Types ===

export interface LoadingVariants {
  [index: number]: boolean;
}

export interface AvailableYears {
  [makeModel: string]: string[];
}