import { useBuilder } from '@/state/builder-provider';
import { BuilderAccordion } from '@/components/builder-accordion';
import { ReviewPanel } from '@/components/review-panel';

export function BuilderLayout() {
  const { viewModel } = useBuilder();

  return (
    <main className="min-h-screen bg-panel text-ink">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-[30px] xl:grid-cols-[minmax(0,1fr)_399px]">
          <section>
            <BuilderAccordion categories={viewModel.categories} />
          </section>

          <aside className="xl:sticky xl:top-8 xl:self-start">
            <ReviewPanel viewModel={viewModel} />
          </aside>
        </div>
      </div>
    </main>
  );
}
