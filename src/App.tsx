import { BuilderProvider } from '@/state/builder-provider';
import { BuilderLayout } from '@/components/builder-layout';
import type { CatalogData, SeedState } from '@/types/builder';
import catalogJson from '@/data/catalog.json';
import seedStateJson from '@/data/seed-state.json';

// JSON modules are inferred with widened primitives (e.g. `id: string` rather than
// the `ProductCategory` union), so we assert the authored shapes once, here, keeping
// a single typed boundary for the seed data.
const catalog = catalogJson as unknown as CatalogData;
const seedState = seedStateJson as unknown as SeedState;

export default function App() {
  return (
    <BuilderProvider catalog={catalog} seedState={seedState}>
      <BuilderLayout />
    </BuilderProvider>
  );
}