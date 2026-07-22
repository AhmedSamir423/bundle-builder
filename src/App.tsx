import { BuilderProvider } from '@/state/builder-provider';
import { BuilderLayout } from '@/components/builder-layout';
import catalog from '@/data/catalog.json';
import seedState from '@/data/seed-state.json';

export default function App() {
  return (
    <BuilderProvider catalog={catalog} seedState={seedState}>
      <BuilderLayout />
    </BuilderProvider>
  );
}