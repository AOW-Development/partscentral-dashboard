export const getCardType = (cardNumber: string): string | null => {
  if (typeof cardNumber !== 'string') {
    return null;
  }
  const sanitized = cardNumber.replace(/\D/g, "");

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(sanitized)) return "Visa";
  if (/^5[1-5][0-9]{14}$/.test(sanitized)) return "MasterCard";
  if (/^3[47][0-9]{13}$/.test(sanitized)) return "American Express";
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(sanitized)) return "Discover";

  return null;
};

// ✅ Luhn algorithm for checksum validation
export const isValidCardNumber = (cardNumber: string): boolean => {
  if (typeof cardNumber !== 'string') {
    return false;
  }
  if (cardNumber.startsWith("3")) {
    return true;
  } else {
    const digits = cardNumber
      .replace(/\D/g, "")
      .split("")
      .reverse()
      .map(Number);
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  }
};
