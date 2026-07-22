import type { BuilderViewModel, ReviewLineItemViewModel } from '@/types/builder';
import { Currency } from '@/components/currency';
import { ProductArtwork } from '@/components/product-artwork';
import { QuantityStepper } from '@/components/quantity-stepper';
import { formatCurrency } from '@/lib/format';
import { useBuilderActions } from '@/state/builder-provider';

type ReviewPanelProps = {
  viewModel: BuilderViewModel;
};

const truckIcon = '/brand/fast-shipping.svg';
const satisfactionBadge = '/brand/satisfaction-badge.png';

function LinePrice({ item }: { item: ReviewLineItemViewModel }) {
  const isFree = item.lineTotal === 0;
  const hasDiscount = item.originalLineTotal > item.lineTotal;

  return (
    <div className="flex shrink-0 flex-col items-end whitespace-nowrap text-[14px] tracking-[0.07px]">
      {hasDiscount ? (
        <span className="font-medium leading-[16px] text-muted line-through">
          <Currency value={item.originalLineTotal} />
        </span>
      ) : null}
      <span className="font-semibold leading-[16px] text-accent">
        {isFree ? 'FREE' : (
          <>
            <Currency value={item.lineTotal} />
            {item.definition.priceSuffix}
          </>
        )}
      </span>
    </div>
  );
}

export function ReviewPanel({ viewModel }: ReviewPanelProps) {
  const actions = useBuilderActions();
  const groups = viewModel.reviewGroups.filter((group) => group.items.length > 0);
  const monthly = viewModel.subtotal / 12;

  return (
    <div className="rounded-[10px] bg-panelAlt pt-[15px]">
      <p className="px-[15px] text-[12px] font-medium uppercase tracking-[1.6px] text-[#484848]">Review</p>

      <div className="flex flex-col gap-[10px] px-[20px] pb-[31px] pt-[20px]">
        <div className="flex flex-col gap-[5px] tracking-[0.6px]">
          <h2 className="text-[22px] font-semibold leading-none text-graphite">Your security system</h2>
          <p className="text-[14px] font-medium leading-[1.3] text-graphite/75">
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </div>

        <div className="flex flex-col gap-[10px]">
          {groups.map((group) => {
            const isPlan = group.title === 'Plan';

            return (
              <section key={group.title} className="flex flex-col gap-[8px] border-t border-line pt-[15px]">
                <p className="text-[12px] font-normal uppercase tracking-[0.36px] text-subtle">{group.title}</p>

                {isPlan
                  ? group.items.map((item) => {
                      const [firstWord, ...rest] = item.definition.title.split(' ');
                      return (
                        <div key={item.key} className="flex items-start justify-between">
                          <div className="flex items-center gap-[3px]">
                            {item.definition.image ? (
                              <img src={item.definition.image} alt="" aria-hidden="true" className="h-[24px] w-[20px] object-contain" />
                            ) : null}
                            <p className="text-[16px] font-bold leading-none tracking-[-0.03px] text-black">
                              {firstWord}{' '}
                              <span className="text-accent">{rest.join(' ')}</span>
                            </p>
                          </div>
                          <LinePrice item={item} />
                        </div>
                      );
                    })
                  : (
                    <div className="flex flex-col gap-[12px]">
                      {group.items.map((item) => (
                        <div key={item.key} className="flex items-center gap-[16px]">
                          <div className="flex min-w-0 flex-1 items-center gap-[12px]">
                            <div className="size-[41px] shrink-0 overflow-hidden rounded-[5px] bg-panel">
                              <ProductArtwork kind={item.definition.kind} src={item.definition.image} compact />
                            </div>
                            <p className="min-w-0 flex-1 text-[14px] font-medium leading-[16px] tracking-[0.07px] text-ink">
                              {item.definition.title}
                            </p>
                            <QuantityStepper
                              quantity={item.quantity}
                              compact
                              locked={item.definition.locked}
                              onDecrement={() =>
                                actions.decrementSpecificQuantity(item.definition.id, item.variant?.id ?? null)
                              }
                              onIncrement={() =>
                                actions.incrementSpecificQuantity(item.definition.id, item.variant?.id ?? null)
                              }
                            />
                          </div>
                          <LinePrice item={item} />
                        </div>
                      ))}
                    </div>
                  )}
              </section>
            );
          })}

          {/* Shipping — presentational row, always free */}
          <section className="flex flex-col gap-[8px] border-t border-line pt-[15px]">
            <div className="flex items-center gap-[16px]">
              <div className="flex min-w-0 flex-1 items-center gap-[12px]">
                <div className="flex size-[41px] shrink-0 items-center justify-center rounded-[5px] bg-panel">
                  <img src={truckIcon} alt="" aria-hidden="true" className="size-[29px] object-contain" />
                </div>
                <p className="min-w-0 flex-1 text-[14px] font-medium leading-[16px] tracking-[0.07px] text-ink">
                  Fast Shipping
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end whitespace-nowrap text-[14px] tracking-[0.07px]">
                <span className="font-medium leading-[16px] text-muted line-through">$5.99</span>
                <span className="font-semibold leading-[16px] text-accent">FREE</span>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center justify-between">
              <img src={satisfactionBadge} alt="100% Wyze satisfaction guarantee" className="size-[78px] shrink-0 object-contain" />
              <div className="flex flex-col items-end gap-[8px]">
                <span className="rounded-[3px] bg-accent px-[8px] py-[5px] text-[12px] font-medium tracking-[-0.6px] text-white">
                  as low as {formatCurrency(monthly)}/mo
                </span>
                <div className="flex items-baseline gap-[8px] whitespace-nowrap">
                  <span className="text-[18px] font-medium leading-[20px] tracking-[0.045px] text-muted line-through">
                    <Currency value={viewModel.originalSubtotal} />
                  </span>
                  <span className="text-[24px] font-bold leading-[32px] tracking-[-0.03px] text-accent">
                    <Currency value={viewModel.subtotal} />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[4px] pt-[10px]">
              <p className="text-center text-[12px] font-semibold tracking-[-0.056px] text-success">
                Congrats! You&rsquo;re saving <Currency value={viewModel.savings} /> on your security bundle!
              </p>
              <button
                type="button"
                onClick={actions.saveConfiguration}
                className="w-full rounded-[4px] bg-accent px-[16px] py-[13px] text-center text-[17px] font-bold text-white transition-colors hover:bg-accent/90"
              >
                Checkout
              </button>
            </div>
          </div>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              actions.saveConfiguration();
            }}
            className="block text-center text-[14px] italic leading-[1.2] tracking-[-0.016px] text-[#484848] underline"
          >
            Save my system for later
          </a>
        </div>
      </div>
    </div>
  );
}
