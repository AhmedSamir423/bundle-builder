import type { BuilderViewModel } from '@/types/builder';
import { ChevronIcon, CategoryIcon } from '@/components/icons';
import { ProductCard } from '@/components/product-card';
import { formatCountLabel } from '@/lib/format';
import { useBuilderActions } from '@/state/builder-provider';

export function BuilderAccordion({ categories }: Pick<BuilderViewModel, 'categories'>) {
  const actions = useBuilderActions();

  return (
    <div className="flex flex-col gap-[15px]">
      {categories.map((category, index) => {
        const isOpen = category.isOpen;
        const nextCategoryId = categories[index + 1]?.definition.id ?? null;
        const nextTitle = categories[index + 1]?.definition.title ?? 'Review';
        const stepLabel = `Step ${category.definition.step} of ${categories.length}`;

        const header = (
          <button
            type="button"
            onClick={() => actions.setActiveStep(isOpen ? null : category.definition.id)}
            className="flex w-full items-center gap-[3px] text-left"
          >
            <div className="flex min-w-0 flex-1 items-center gap-[8px]">
              <CategoryIcon kind={category.definition.icon} />
              <h2 className="min-w-0 flex-1 truncate text-[22px] font-semibold leading-none text-ink">
                {category.definition.title}
              </h2>
            </div>

            {isOpen ? (
              <span className="flex shrink-0 items-center gap-[4px] text-accent">
                <span className="text-[14px] font-medium leading-[16px]">
                  {formatCountLabel(category.selectedCount)}
                </span>
                <ChevronIcon direction="up" />
              </span>
            ) : (
              <span className="shrink-0 text-ink">
                <ChevronIcon direction="down" />
              </span>
            )}
          </button>
        );

        if (!isOpen) {
          return (
            <section key={category.definition.id} className="flex flex-col gap-[5px]">
              <p className="px-[15px] text-[10px] font-medium uppercase tracking-[1.6px] text-[#484848]">
                {stepLabel}
              </p>
              <div className="border-y-[0.5px] border-[#1f1f1f] px-[15px] py-[20px]">{header}</div>
            </section>
          );
        }

        return (
          <section key={category.definition.id} className="rounded-[10px] bg-panelAlt pt-[15px]">
            <p className="px-[15px] text-[12px] font-medium uppercase tracking-[1.6px] text-[#484848]">
              {stepLabel}
            </p>

            <div className="mt-[15px] flex flex-col gap-[15px] border-t-[0.5px] border-[#1f1f1f] px-[15px] py-[20px]">
              {header}

              <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
                {category.products.map((product, productIndex) => {
                  const isLastOdd =
                    category.products.length % 2 === 1 && productIndex === category.products.length - 1;

                  return (
                    <div
                      key={product.definition.id}
                      className={isLastOdd ? 'sm:col-span-2 sm:mx-auto sm:w-[calc(50%-7.5px)]' : ''}
                    >
                      <ProductCard product={product} />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => actions.setActiveStep(nextCategoryId)}
                  className="inline-flex h-[39px] items-center justify-center rounded-[7px] border border-accent px-[24px] py-[5px] text-[18px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
                >
                  Next: {nextTitle}
                </button>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
