const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number) {
  return formatter.format(value);
}

export function formatCountLabel(count: number) {
  return count === 1 ? '1 selected' : `${count} selected`;
}
