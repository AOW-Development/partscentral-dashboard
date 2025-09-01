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
      firstName: formData.cardHolderName?.split(' ')[0] || 'Unknown',
      lastName: formData.cardHolderName?.split(' ').slice(1).join(' ') || '',
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
        pictureUrl: item.pictureUrl || '',
        pictureStatus: item.pictureStatus || 'PENDING',
        productVariantId: sku
      };
    }),
    
    // Order fields
    orderNumber: formData.id,
    totalAmount: parseFloat(formData.totalPrice) || 0,
    subtotal: parseFloat(formData.partPrice) || 0,
    source: formData.source,
    status: formData.status,
    year: parseInt(formData.year, 10) || null,
    taxesAmount: parseFloat(formData.taxesPrice) || 0,
    handlingFee: parseFloat(formData.handlingPrice) || 0,
    processingFee: parseFloat(formData.processingPrice) || 0,
    corePrice: parseFloat(formData.corePrice) || 0,
    // totalAmount: parseFloat(formData.totalSellingPrice) || 0,
    companyName: formData.company,
    shippingAddress: formData.shippingAddress,
    billingAddress: formData.billingAddress,
    notes: formData.notes,
    vinNumber: formData.vinNumber,
    orderDate: formData.date ? new Date(formData.date).toISOString() : null,
    carrierName: formData.carrierName,
    trackingNumber: formData.trackingNumber,
    invoiceStatus: formData.invoiceStatus,
    invoiceSentAt: formData.invoiceSentAt ? new Date(formData.invoiceSentAt).toISOString() : null,
    invoiceConfirmedAt: formData.invoiceConfirmedAt ? new Date(formData.invoiceConfirmedAt).toISOString() : null,
    customerNotes: formData.customerNotes,
    yardNotes: formData.yardNotes,
    ...(formData.products && formData.products.length > 0 ? { cartItems: formData.products } : {}),
    ...(formData.alternateMobile ? {
      customerInfo: {
        alternativePhone: formData.alternateMobile
      }
    } : {}),
    ...(formData.paymentInfo ? {
      paymentInfo: {
        method: formData.merchantMethod,
        approvelCode: formData.approvalCode,
        charged: formData.charged,
        entity: formData.entity,
        cardHolderName: formData.cardHolderName,
        cardNumber: formData.cardNumber,
        cardCvv: formData.cardCvv,
        cardDate: formData.cardDate,
        alternateCardHolderName: formData.alternateCardHolderName,
        alternateCardNumber: formData.alternateCardNumber,
        alternateCardDate: formData.alternateCardDate,
        alternateCardCvv: formData.alternateCardCvv,
      }
    } : {}),
    paymentInfo: {
      paymentMethod: formData.merchantMethod || '',
      status: 'PENDING',
      amount: parseFloat(formData.totalSellingPrice) || 0,
      currency: 'USD',
      provider: 'STRIPE',
      entity: formData.entity || null,
      approvelCode: formData.approvalCode,
      charged: formData.charged,
      cardData: formData.cardNumber ? {
        cardNumber: formData.cardNumber,
        cardholderName: formData.cardHolderName,
        expirationDate: formData.cardDate,
        securityCode: formData.cardCvv,
        last4: formData.cardNumber.slice(-4),
        brand: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
      } : null
    },
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
