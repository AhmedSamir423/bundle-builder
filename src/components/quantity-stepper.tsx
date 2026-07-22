import { cn } from '@/lib/cn';

type QuantityStepperProps = {
  quantity: number;
  compact?: boolean;
  locked?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
};

function MinusGlyph() {
  return (
    <svg viewBox="0 0 8 2" className="w-[8px]" fill="none" aria-hidden="true">
      <path d="M0 1H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusGlyph() {
  return (
    <svg viewBox="0 0 8 8" className="w-[8px]" fill="none" aria-hidden="true">
      <path d="M4 0V8M0 4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function QuantityStepper({
  quantity,
  compact = false,
  locked = false,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  const buttonBase = 'grid place-items-center size-[20px] rounded-[4px] transition-colors';
  const canDecrement = quantity > 0 && !locked;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-[4px] py-[4px]',
        compact ? 'w-[72px] justify-between' : 'w-[80px] justify-center gap-[10px]',
      )}
      aria-label={`Quantity ${quantity}`}
    >
      <button
        type="button"
        disabled={!canDecrement}
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={cn(
          buttonBase,
          locked
            ? 'border border-line bg-surface text-subtle'
            : canDecrement
              ? 'border-2 border-lineSoft bg-panel text-ink hover:border-accent/40'
              : 'border-2 border-surface bg-surface text-line',
          compact && !locked && 'border-0 bg-panel',
        )}
      >
        <MinusGlyph />
      </button>

      <span
        className={cn(
          'text-center tabular-nums text-ink',
          compact ? 'w-[8px] text-[14px] font-semibold leading-[16px]' : 'min-w-[10px] text-[16px] font-medium leading-[20px]',
        )}
      >
        {quantity}
      </span>

      <button
        type="button"
        disabled={locked}
        onClick={onIncrement}
        aria-label="Increase quantity"
        className={cn(
          buttonBase,
          locked
            ? 'border border-line bg-surface text-subtle'
            : compact
              ? 'bg-panel text-ink hover:bg-surface'
              : 'bg-surface text-ink hover:bg-accent hover:text-white',
        )}
      >
        <PlusGlyph />
      </button>
    </div>
  );
}
