import { useBuilder } from '@/state/builder-provider';
import { BuilderAccordion } from '@/components/builder-accordion';
import { ReviewPanel } from '@/components/review-panel';

export function BuilderLayout() {
  const { viewModel } = useBuilder();

  return (
    <main className="min-h-screen bg-panel text-ink">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile-only intro heading (absent from the tablet/desktop Figma frames). */}
        <h1 className="mb-[20px] text-center text-[31.875px] font-extrabold leading-[1.1] tracking-[-0.064px] text-graphite md:hidden">
          Let&rsquo;s get started!
        </h1>

        {/* Desktop (xl): two columns side by side. Tablet/mobile: single column with the
            review stacked below the builder. */}
        <div className="grid grid-cols-1 gap-0 md:gap-[30px] xl:grid-cols-[minmax(0,1fr)_399px]">
          {/* Full-bleed only on mobile (<768px) so dividers reach the screen edges; inset above. */}
          <section className="-mx-4 sm:-mx-6 md:mx-0">
            <BuilderAccordion categories={viewModel.categories} />
          </section>

          <aside className="-mx-4 sm:-mx-6 md:mx-0 xl:sticky xl:top-8 xl:self-start">
            <ReviewPanel viewModel={viewModel} />
          </aside>
        </div>
      </div>
    </main>
  );
}
