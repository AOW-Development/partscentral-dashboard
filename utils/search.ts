// Define types here directly, no imports needed
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
//   productVariants?: GroupedVariant[];
//   selectedSubpart?: GroupedVariant | null;
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
  attnName: string;
  yardMobile: string;
  yardAddress: string;
  yardEmail: string;
  yardPrice: string | number;
  yardWarranty: string;
  yardMiles: string | number;
  yardShipping: string;
  yardCost: string;
  pictureStatus: string;
  pictureUrl: string;
  carrierName: string;
  trackingNumber: string;
  customerNotes: any;
  yardNotes: any;
  invoiceStatus: string;
  invoiceSentAt: string;
  invoiceConfirmedAt: string;
  poStatus: string;
  poSentAt: string;
  poConfirmedAt: string;
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

// Utils stay the same
function normalize(value: any): string {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase();
}

function fieldMatches(fieldValue: any, query: string): boolean {
  return normalize(fieldValue).includes(query.toLowerCase());
}

function productMatches(product: ProductFormData, query: string): boolean {
  return Object.values(product).some((val) => fieldMatches(val, query));
}

export function searchOrders(
  orders: OrderFormData[],
  query: string
): OrderFormData[] {
  if (!query.trim()) return orders;

  return orders.filter((order) => {
    const orderFieldsMatch = Object.entries(order).some(([key, val]) => {
      if (key === "products" || key === "ownShippingInfo") return false;
      return fieldMatches(val, query);
    });

    const shippingInfoMatch = order.ownShippingInfo
      ? Object.values(order.ownShippingInfo).some((val) =>
          fieldMatches(val, query)
        )
      : false;

    const productMatch = order.products.some((p) =>
      productMatches(p, query)
    );

    return orderFieldsMatch || shippingInfoMatch || productMatch;
  });
}
