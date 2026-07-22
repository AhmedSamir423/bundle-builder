import { formatCurrency } from '@/lib/format';

export function Currency({ value }: { value: number }) {
  return <>{formatCurrency(value)}</>;
}