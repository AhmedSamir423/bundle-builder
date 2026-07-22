import type { ProductVariant } from '@/types/builder';
import { cn } from '@/lib/cn';

type VariantChipRowProps = {
  variants: ProductVariant[];
  activeVariantId: string | null;
  onSelectVariant: (variantId: string) => void;
};

export function VariantChipRow({ variants, activeVariantId, onSelectVariant }: VariantChipRowProps) {
  return (
    <div className="flex flex-wrap gap-[6px]">
      {variants.map((variant) => {
        const isActive = activeVariantId === variant.id;

        return (
          <button
            key={variant.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectVariant(variant.id)}
            className={cn(
              'inline-flex h-[26px] shrink-0 items-center justify-center gap-[2px] rounded-[2px] border-[0.5px] px-[4px] transition-colors',
              isActive
                ? 'border-success bg-success/[0.06]'
                : 'border-[#cccccc] bg-panel hover:border-accent/40',
            )}
          >
            {variant.thumb ? (
              <img
                src={variant.thumb}
                alt=""
                aria-hidden="true"
                className="size-[20px] shrink-0 rounded-[5px] object-contain"
              />
            ) : (
              <span
                className="size-[14px] shrink-0 rounded-full border border-white/60"
                style={{ backgroundColor: variant.swatch }}
              />
            )}
            <span className="whitespace-nowrap text-[10px] font-medium text-graphite">{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
