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

export const updateOrderFromAdmin = async (orderId: string, formData: any, cartItems: CartItem[]) => {
  const orderData: any = {
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
        productVariantId: sku
      };
    }),
        customerNotes: formData.customerNotes || '',
    yardNotes: formData.yardNotes || '',
    carrierName: formData.carrierName || 'UNKNOWN',
    trackingNumber: formData.trackingNumber || `TRK-${Date.now()}`,
    saleMadeBy: formData.saleMadeBy || 'Admin',
    taxesAmount: parseFloat(formData.taxesPrice) || 0,
    shippingAmount: parseFloat(formData.yardCost) || 0,
    handlingFee: parseFloat(formData.handlingPrice) || 0,
    processingFee: parseFloat(formData.processingPrice) || 0,
    corePrice: parseFloat(formData.corePrice) || 0,
    milesPromised: parseFloat(formData.milesPromised) || 0,
  };

  if (formData.yardName) {
    orderData.yardInfo = {
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
    };
  }

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating order from admin:', error);
    throw error;
  }
};
