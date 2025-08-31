export const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance) => {
  if (!balance) return '0.0000';
  const num = parseFloat(balance);
  if (isNaN(num)) return '0.0000';
  return num.toFixed(4);
};

export const formatNumber = (number) => {
  return Number(number).toLocaleString();
};
