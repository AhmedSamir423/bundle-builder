import type { BuilderViewModel } from '@/types/builder';
import { Currency } from '@/components/currency';
import { ProductArtwork } from '@/components/product-artwork';
import { QuantityStepper } from '@/components/quantity-stepper';
import { VariantChipRow } from '@/components/variant-chip-row';
import { ProductLink } from '@/components/product-link';
import { cn } from '@/lib/cn';
import { useBuilderActions } from '@/state/builder-provider';

type ProductCardProps = {
  product: BuilderViewModel['categories'][number]['products'][number];
};

export function ProductCard({ product }: ProductCardProps) {
  const actions = useBuilderActions();
  const { definition, isSelected, quantity } = product;
  const hasDiscount = definition.compareAtPrice > definition.price;

  return (
    <article
      className={cn(
        // Vertical card (image on top) up to the desktop breakpoint; horizontal (image left) at xl.
        'flex h-full flex-col items-center justify-center gap-[19px] rounded-[10px] bg-panel px-[11px] py-[15px] transition-colors',
        'xl:flex-row xl:justify-start xl:gap-[15px] xl:p-[11px]',
        isSelected ? 'border-2 border-accent/70' : 'border-2 border-transparent',
      )}
    >
      <div className="relative aspect-[214/124] w-full shrink-0 overflow-hidden rounded-[5px] bg-panel xl:aspect-auto xl:h-[137px] xl:w-[101px]">
        <ProductArtwork kind={definition.kind} src={definition.image} />
        {definition.badge ? (
          <span className="absolute left-0 top-0 rounded-[10px] bg-accent px-[6px] py-[2px] text-[12px] font-semibold text-white">
            {definition.badge}
          </span>
        ) : null}
      </div>

      <div className="flex w-full min-w-0 flex-col gap-[10px] xl:flex-1">
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[18px] font-semibold leading-none tracking-[-0.1px] text-graphite xl:text-[16px]">
            {definition.title}
          </h3>
          <p className="text-[14px] font-medium leading-[1.3] tracking-[0.4px] text-graphite/75 xl:text-[12px]">
            {definition.description} <ProductLink />
          </p>
        </div>

        {definition.variants?.length ? (
          <VariantChipRow
            variants={definition.variants}
            activeVariantId={product.selection.activeVariantId}
            onSelectVariant={(variantId) => actions.selectVariant(definition.id, variantId)}
          />
        ) : null}

        <div className="flex w-full items-end justify-between gap-[10px]">
          <QuantityStepper
            quantity={quantity}
            onDecrement={() => actions.decrementQuantity(definition.id)}
            onIncrement={() => actions.incrementQuantity(definition.id)}
          />
          <div className="flex flex-col items-end gap-[3px] text-right text-[16px] leading-none tracking-[0.6px]">
            {hasDiscount ? (
              <span className="font-normal leading-none text-danger line-through">
                <Currency value={definition.compareAtPrice} />
              </span>
            ) : null}
            <span className="font-normal leading-none text-[#575757]">
              <Currency value={definition.price} />
              {definition.priceSuffix}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
