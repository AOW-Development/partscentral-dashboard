const API_URL = 'http://localhost:3001/api';

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

export const createOrderFromAdmin = async (formData: any, cartItems: any[]) => {
  // Debug: log ownShippingInfo and yardShipping before constructing orderData
  console.log('DEBUG ownShippingInfo:', formData.ownShippingInfo);
  console.log('DEBUG yardShipping:', formData.yardShipping);
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
  // Required fields for order creation
  billingInfo: {
    firstName: formData.cardHolderName?.split(' ')[0] || 'Unknown',
    lastName: formData.cardHolderName?.split(' ').slice(1).join(' ') || 'Customer',
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
    lastName: formData.cardHolderName?.split(' ').slice(1).join(' ') || 'Customer',
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
    firstName: formData.cardHolderName?.split(' ')[0] || 'Unknown',
    lastName: formData.cardHolderName?.split(' ').slice(1).join(' ') || 'Customer',
    company: formData.company || null,
    address: formData.shippingAddress || 'Unknown',
    city: formData.shippingCity || 'Unknown',
    state: formData.shippingState || 'CA',
    postalCode: formData.shippingPostalCode || '00000',
    country: 'US',
    type: formData.shippingAddressType || 'RESIDENTIAL'
  },
  
  cartItems: orderItems.map(item => {
    // Ensure we use the correct SKU field that matches the database
    const sku = item.productVariantId || item.sku || item.id;
    if (!sku) {
      console.error('Missing SKU for cart item:', item);
      throw new Error('Product variant SKU is required');
    }
    
    return {
      id: sku, // This will be used as the SKU in the where clause
      sku: sku, // Include both id and sku for compatibility
      quantity: item.quantity || 1,
      price: item.price,
      name: `Engine for ${sku.split('-').slice(0, 3).join(' ')}`,
      warranty: item.warranty || '30 Days',
      milesPromised: item.milesPromised,
      specification: item.specification || '',
      productVariantId: sku // Keep this for backward compatibility
    };
  }),
  
  paymentInfo: {
    paymentMethod: formData.merchantMethod || 'CARD', // Changed from 'method' to 'paymentMethod' to match backend
    status: 'PENDING',
    amount: parseFloat(formData.totalPrice) || 0,
    currency: 'USD',
    provider: 'STRIPE',
    cardData: formData.cardNumber ? {
      cardNumber: formData.cardNumber,
      cardholderName: formData.cardHolderName,
      expirationDate: formData.cardDate,
      securityCode: formData.cardCvv,
      // Add last4 for card display
      last4: formData.cardNumber.slice(-4),
      // Add card brand detection
      brand: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
    } : null,
  },
  
  // Required fields for order creation
  totalAmount: parseFloat(formData.totalPrice) || 0,
  subtotal: parseFloat(formData.partPrice) || 0,
  orderNumber: `PC-${Math.floor(Math.random() * 900000) + 100000}`,
  
  // Additional fields that might be needed
  // notes: formData.notes || '',
  notes: formData.customerNotes || '',
  carrierName: formData.carrierName || 'UNKNOWN',
  trackingNumber: formData.trackingNumber || `TRK-${Date.now()}`,
  saleMadeBy: formData.saleMadeBy || 'Admin',
  taxesAmount: parseFloat(formData.taxesPrice) || 0,
  shippingAmount: parseFloat(formData.yardCost) || 0,
  handlingFee: parseFloat(formData.handlingPrice) || 0,
  processingFee: parseFloat(formData.processingPrice) || 0,
  corePrice: parseFloat(formData.corePrice) || 0,
  milesPromised: parseFloat(formData.milesPromised) || 0,
  // console.log('formData.yardName in orderApi:', formData.yardName) ,
  // Include yard info in the order creation if provided
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
      // Include own shipping info as JSON if present
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
