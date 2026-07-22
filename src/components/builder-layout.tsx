import { useBuilder } from '@/state/builder-provider';
import { BuilderAccordion } from '@/components/builder-accordion';
import { ReviewPanel } from '@/components/review-panel';

export function BuilderLayout() {
  const { viewModel } = useBuilder();

  return (
    <main className="min-h-screen bg-panel text-ink">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile-only intro heading (absent from the desktop Figma frame). */}
        <h1 className="mb-[20px] text-center text-[31.875px] font-extrabold leading-[1.1] tracking-[-0.064px] text-graphite xl:hidden">
          Let&rsquo;s get started!
        </h1>

        <div className="grid grid-cols-1 gap-0 xl:grid-cols-[minmax(0,1fr)_399px] xl:gap-[30px]">
          {/* Full-bleed on mobile so the accordion dividers reach the screen edges. */}
          <section className="-mx-4 sm:-mx-6 lg:-mx-8 xl:mx-0">
            <BuilderAccordion categories={viewModel.categories} />
          </section>

          {/* On mobile the review flows continuously and full-bleed from the steps above;
              on desktop it becomes a sticky card beside the accordion. */}
          <aside className="-mx-4 sm:-mx-6 lg:-mx-8 xl:mx-0 xl:self-start xl:sticky xl:top-8">
            <ReviewPanel viewModel={viewModel} />
          </aside>
        </div>
      </div>
    </main>
  );
}
