const API_URL = 'http://localhost:3001/api';

export const createOrderFromAdmin = async (formData: any, cartItems: any[]) => {
  const payload = {
    billingInfo: {
      firstName: formData.cardHolderName.split(' ')[0],
      lastName: formData.cardHolderName.split(' ').slice(1).join(' '),
      phone: formData.mobile,
      address: formData.billingAddress,
      country: 'US', // Assuming US
    },
    shippingInfo: {
      firstName: formData.cardHolderName.split(' ')[0],
      lastName: formData.cardHolderName.split(' ').slice(1).join(' '),
      phone: formData.mobile,
      address: formData.shippingAddress,
      country: 'US', // Assuming US
      company: formData.company,
    },
    customerInfo: {
      email: formData.email,
      firstName: formData.cardHolderName.split(' ')[0],
      lastName: formData.cardHolderName.split(' ').slice(1).join(' '),
    },
    cartItems: cartItems, // This will need to be populated based on the admin's selections
    paymentInfo: {
      paymentMethod: formData.merchantMethod,
      cardData: {
        cardNumber: formData.cardNumber,
        cardholderName: formData.cardHolderName,
        expirationDate: formData.cardDate,
        securityCode: formData.cardCvv,
      },
    },
    orderNumber: `PC-${Math.floor(Math.random() * 900000) + 100000}`,
    totalAmount: formData.totalPrice,
    subtotal: formData.partPrice,
    source: 'ADMIN',
    notes: formData.notes,
    carrierName: formData.carrierName,
    trackingNumber: formData.trackingNumber,
    saleMadeBy: formData.saleMadeBy,
    yardInfo: {
      yardName: formData.yardName,
      yardAddress: formData.yardAddress,
      yardMobile: formData.yardMobile,
      yardEmail: formData.yardEmail,
      yardPrice: parseFloat(formData.yardPrice) || null,
      yardWarranty: formData.yardWarranty,
      yardMiles: parseFloat(formData.yardMiles) || null,
      yardShippingType: formData.yardShipping,
      yardShippingCost: parseFloat(formData.yardCost) || null,
    },
    taxesAmount: parseFloat(formData.taxesPrice) || null,
    handlingFee: parseFloat(formData.handlingPrice) || null,
    processingFee: parseFloat(formData.processingPrice) || null,
    corePrice: parseFloat(formData.corePrice) || null,
    milesPromised: parseFloat(formData.milesPromised) || null,
    addressType: formData.shippingAddressType,
    companyName: formData.company,
  };

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You might need to add an Authorization header if your API is protected
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order from admin:', error);
    throw error;
  }
};
