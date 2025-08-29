const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type CartItem = {
  id: string;
  sku?: string;
  quantity: number;
  price: number;
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
    case '30 Days': return 'WARRANTY_30_DAYS';
    case '60 Days': return 'WARRANTY_60_DAYS';
    case '90 Days': return 'WARRANTY_90_DAYS';
    case '6 Months': return 'WARRANTY_6_MONTHS';
    case '1 Year': return 'WARRANTY_1_YEAR';
    default: return 'WARRANTY_30_DAYS'; // Default or handle error
  }
};

export const createOrderFromAdmin = async (formData: any, cartItems: CartItem[]) => {
  // Debug: log ownShippingInfo and yardShipping before constructing orderData
  console.log('DEBUG ownShippingInfo:', formData.ownShippingInfo);
  console.log('DEBUG yardShipping:', formData.yardShipping);

  console.log('Form data before submission:', {
    customerNotes: formData.customerNotes,
    yardNotes: formData.yardNotes
  });
  // Prepare order items with required fields
  const orderItems = cartItems.map(item => ({
    productVariantId: item.id, // This should be the variant SKU
    quantity: item.quantity || 1,
    price: item.price,
    warranty: item.warranty,
    milesPromised: item.milesPromised,
    specification: item.specification,
    pictureUrl: formData.pictureUrl || "",
    pictureStatus: formData.pictureStatus || 'PENDING',
    source: 'ADMIN',
  }));

  // Prepare the order data in the exact format expected by the backend
const orderData = {
  billingInfo: {
    firstName: formData.cardHolderName?.split(' ')[0] || 'Unknown',
    lastName: formData.cardHolderName?.split(' ').slice(1).join(' ') || '',
    address: formData.billingAddress || formData.shippingAddress || 'Unknown',
    city: formData.billingCity || formData.shippingCity || 'Unknown',
    state: formData.billingState || formData.shippingState || 'CA',
    postalCode: formData.billingPostalCode || formData.shippingPostalCode || '00000',
    country: 'US',
    phone: formData.mobile || '000-000-0000',
    email: formData.email || 'no-email@example.com',
    company: formData.billingCompany || formData.company || null,
    addressType: formData.billingAddressType || formData.shippingAddressType || 'RESIDENTIAL'
  },
  shippingInfo: {
    firstName: formData.cardHolderName?.split(' ')[0] || 'Unknown',
    lastName: formData.cardHolderName?.split(' ').slice(1).join(' ') || '',
    address: formData.shippingAddress || 'Unknown',
    city: formData.shippingCity || 'Unknown',
    state: formData.shippingState || 'CA',
    postalCode: formData.shippingPostalCode || '00000',
    country: 'US',
    phone: formData.mobile || '000-000-0000',
    email: formData.email || 'no-email@example.com',
    company: formData.company || null,
    addressType: formData.shippingAddressType || 'RESIDENTIAL'
  },
  customerInfo: {
    email: formData.email || 'no-email@example.com',
    phone: formData.mobile || '000-000-0000',
    alternativePhone: formData. alternateMobile ,
    firstName: formData.customerName?.split(' ')[0] || 'Unknown',
    // lastName: formData.cardHolderName?.split(' ').slice(1).join(' ') || '',
    company: formData.company || null,
    address: formData.shippingAddress || 'Unknown',
    city: formData.shippingCity || 'Unknown',
    state: formData.shippingState || 'CA',
    postalCode: formData.shippingPostalCode || '00000',
    country: 'US',
    type: formData.shippingAddressType || 'RESIDENTIAL'
  },
  cartItems: cartItems.map(item => {
    const sku = item.id;
    if (!sku) {
      console.error('Missing SKU for cart item:', item);
      throw new Error('Product variant SKU is required');
    }
    return {
      id: sku,
      sku: sku,
      quantity: item.quantity || 1,
      price: item.price,
      name: `Engine for ${sku.split('-').slice(0, 3).join(' ')}`,
      warranty: item.warranty || '30 Days',
      milesPromised: item.milesPromised,
      specification: item.specification || '',
      productVariantId: sku,
pictureUrl: item.pictureUrl || formData.pictureUrl || '',
      pictureStatus: item.pictureStatus || formData.pictureStatus || 'PENDING',
    };
  }),
  paymentInfo: {
    paymentMethod: formData.merchantMethod || '',
    status: 'PENDING',
    amount: parseFloat(formData.totalPrice) || 0,
    currency: 'USD',
    provider: 'STRIPE',
    entity: formData.entity || null,
    cardData: formData.cardNumber ? {
      cardNumber: formData.cardNumber,
      cardholderName: formData.cardHolderName,
      expirationDate: formData.cardDate,
      securityCode: formData.cardCvv,
      last4: formData.cardNumber.slice(-4),
      brand: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
    } : null,
    alternateCardData: formData.alternateCardNumber ? {
      cardNumber: formData.alternateCardNumber,
      cardholderName: formData.alternateCardHolderName,
      expirationDate: formData.alternateCardDate,
      securityCode: formData.alternateCardCvv,
      last4: formData.alternateCardNumber.slice(-4),
      brand: formData.alternateCardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
    } : null,
    approvelCode: formData.approvalCode,
    charged: formData.charged,
  },
  totalAmount: parseFloat(formData.totalPrice) || 0,
  subtotal: parseFloat(formData.partPrice) || 0,
  orderNumber: formData.id,
  carrierName: formData.carrierName || 'UNKNOWN',
  trackingNumber: formData.trackingNumber || `TRK-${Date.now()}`,
  saleMadeBy: formData.saleMadeBy || 'Admin',
  taxesAmount: parseFloat(formData.taxesPrice) || 0,
  shippingAmount: parseFloat(formData.yardCost) || 0,
  handlingFee: parseFloat(formData.handlingPrice) || 0,
  processingFee: parseFloat(formData.processingPrice) || 0,
  corePrice: parseFloat(formData.corePrice) || 0,
  milesPromised: parseFloat(formData.milesPromised) || 0,
  customerNotes: formData.customerNotes,
  yardNotes: formData.yardNotes,
  year: parseInt(formData.year, 10),
  shippingAddress: formData.shippingAddress,
  billingAddress: formData.billingAddress,
  companyName: formData.company,
  source: formData.source,
  status: formData.status,
  vinNumber: formData.vinNumber,
  notes: formData.notes,
  orderDate: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
  addressType: formData.shippingAddressType,
  ...(formData.yardName && {
    yardInfo: {
      yardName: formData.yardName,
      yardAddress: formData.yardAddress || 'Unknown',
      yardMobile: formData.yardMobile || '000-000-0000',
      yardEmail: formData.yardEmail || 'no-email@example.com',
      yardPrice: parseFloat(formData.yardPrice) || 0,
      yardWarranty: mapWarrantyToPrismaEnum(formData.yardWarranty || '30 Days'),
      yardMiles: parseFloat(formData.yardMiles) || 0,
      yardShippingType: formData.yardShipping || 'OWN_SHIPPING',
      yardShippingCost: parseFloat(formData.yardCost) || 0,
      reason: formData.reason || 'No reason provided',
      ...(formData.yardShipping === 'Own Shipping' && formData.ownShippingInfo ? { yardOwnShippingInfo: formData.ownShippingInfo } : {})
    }
  })
};
console.log('formData.yardName in orderApi:', formData.yardName)
try {
    console.log('Sending order data:', JSON.stringify(orderData, null, 2));
    
    // Create the order with nested yard info if provided
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You might need to add an Authorization header if your API is protected
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order from admin:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch order');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};
