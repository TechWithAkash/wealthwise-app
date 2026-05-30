/**
 * A platform-safe, bulletproof currency formatter that works on Web, iOS, and Android
 * without relying on buggy or crash-prone native Intl implementations.
 */
export const formatCurrency = (amount: number, currencyCode = 'INR') => {
  // Graceful fallback for non-numbers
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }

  const symbols: { [key: string]: string } = {
    INR: '₹',
    USD: '$',
    EUR: '€',
  };
  const symbol = symbols[currencyCode.toUpperCase()] || symbols.INR;

  // Format to 2 decimal places
  const parts = amount.toFixed(2).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  let formattedInt = '';

  if (currencyCode.toUpperCase() === 'INR') {
    // Indian standard numbering format (e.g. 12,480.50, or 1,00,000.00)
    const lastThree = integerPart.slice(-3);
    const otherParts = integerPart.slice(0, -3);
    if (otherParts !== '') {
      formattedInt = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    } else {
      formattedInt = lastThree;
    }
  } else {
    // Western standard numbering format (e.g. 12,480.50)
    formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return `${symbol}${formattedInt}.${decimalPart}`;
};

export default formatCurrency;
