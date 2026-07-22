import type {
  BuilderState,
  BuilderViewModel,
  CatalogData,
  ProductDefinition,
  ProductSelection,
  ProductVariant,
  ReviewLineItemViewModel,
} from '@/types/builder';

const categoryTitles: Record<string, string> = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
  plan: 'Plan',
};

const reviewGroupOrder: Array<BuilderState['activeStepId']> = ['cameras', 'sensors', 'accessories', 'plan'];

function getActiveVariant(
  product: ProductDefinition,
  selection: ProductSelection,
): ProductVariant | null {
  if (!product.variants?.length) {
    return null;
  }

  const activeVariantId = selection.activeVariantId ?? product.defaultVariantId ?? product.variants[0]?.id ?? null;

  return product.variants.find((variant) => variant.id === activeVariantId) ?? product.variants[0] ?? null;
}

function getSelectionQuantity(selection: ProductSelection, variantId: string | null): number {
  if (variantId === null) {
    return selection.quantitiesByVariant.default ?? 0;
  }

  return selection.quantitiesByVariant[variantId] ?? 0;
}

function getProductQuantity(product: ProductDefinition, selection: ProductSelection, activeVariant: ProductVariant | null): number {
  if (!product.variants?.length) {
    return selection.quantitiesByVariant.default ?? 0;
  }

  return getSelectionQuantity(selection, activeVariant?.id ?? null);
}

function getProductTotalQuantity(product: ProductDefinition, selection: ProductSelection): number {
  if (!product.variants?.length) {
    return selection.quantitiesByVariant.default ?? 0;
  }

  return product.variants.reduce((total, variant) => total + (selection.quantitiesByVariant[variant.id] ?? 0), 0);
}

function normalizeSelection(product: ProductDefinition, selection?: ProductSelection): ProductSelection {
  if (product.variants?.length) {
    const quantitiesByVariant = Object.fromEntries(
      product.variants.map((variant) => [variant.id, selection?.quantitiesByVariant[variant.id] ?? 0]),
    );

    const activeVariantId =
      selection?.activeVariantId && product.variants.some((variant) => variant.id === selection.activeVariantId)
        ? selection.activeVariantId
        : product.defaultVariantId ?? product.variants[0]?.id ?? null;

    return {
      activeVariantId,
      quantitiesByVariant,
    };
  }

  return {
    activeVariantId: null,
    quantitiesByVariant: {
      default: selection?.quantitiesByVariant.default ?? 0,
    },
  };
}

export function getDefaultBuilderState(catalog: CatalogData, activeStepId: BuilderState['activeStepId'] = catalog.categories[0]?.id ?? null): BuilderState {
  const selections = Object.fromEntries(
    catalog.products.map((product) => [product.id, normalizeSelection(product)]),
  );

  return {
    activeStepId,
    selections,
  };
}

export function normalizeBuilderState(catalog: CatalogData, state: Partial<BuilderState> | null | undefined): BuilderState {
  const fallback = getDefaultBuilderState(catalog, state?.activeStepId ?? catalog.categories[0]?.id ?? null);

  return {
    activeStepId:
      state?.activeStepId && catalog.categories.some((category) => category.id === state.activeStepId)
        ? state.activeStepId
        : fallback.activeStepId,
    selections: Object.fromEntries(
      catalog.products.map((product) => [product.id, normalizeSelection(product, state?.selections?.[product.id])]),
    ),
  };
}

export function createBuilderViewModel(catalog: CatalogData, state: BuilderState): BuilderViewModel {
  const categories = catalog.categories.map((categoryDefinition) => {
    const products = catalog.products
      .filter((product) => product.category === categoryDefinition.id)
      .map((product) => {
        const selection = state.selections[product.id] ?? normalizeSelection(product);
        const activeVariant = getActiveVariant(product, selection);
        const quantity = getProductQuantity(product, selection, activeVariant);
        const totalQuantity = getProductTotalQuantity(product, selection);

        return {
          definition: product,
          selection,
          activeVariant,
          quantity,
          isSelected: totalQuantity > 0,
        };
      });

    return {
      definition: categoryDefinition,
      products,
      selectedCount: products.filter((product) => product.isSelected).length,
      isOpen: state.activeStepId === categoryDefinition.id,
    };
  });

  const reviewGroups = reviewGroupOrder.map((categoryId) => {
    const categoryDefinition = catalog.categories.find((category) => category.id === categoryId);

    if (!categoryDefinition) {
      return { title: '', items: [] };
    }

    const items: ReviewLineItemViewModel[] = catalog.products
      .filter((product) => product.category === categoryDefinition.id)
      .flatMap((product) => {
        const selection = state.selections[product.id] ?? normalizeSelection(product);

        if (product.variants?.length) {
          return product.variants.flatMap((variant) => {
            const quantity = selection.quantitiesByVariant[variant.id] ?? 0;

            if (quantity <= 0) {
              return [];
            }

            return [
              {
                key: `${product.id}-${variant.id}`,
                definition: product,
                variant,
                quantity,
                lineTotal: quantity * product.price,
                originalLineTotal: quantity * product.compareAtPrice,
              },
            ];
          });
        }

        const quantity = selection.quantitiesByVariant.default ?? 0;

        if (quantity <= 0) {
          return [];
        }

        return [
          {
            key: `${product.id}-default`,
            definition: product,
            variant: null,
            quantity,
            lineTotal: quantity * product.price,
            originalLineTotal: quantity * product.compareAtPrice,
          },
        ];
      });

    return {
      title: categoryTitles[categoryDefinition.id],
      items,
    };
  });

  const subtotal = reviewGroups.reduce(
    (total, group) => total + group.items.reduce((groupTotal, item) => groupTotal + item.lineTotal, 0),
    0,
  );

  const originalSubtotal = reviewGroups.reduce(
    (total, group) => total + group.items.reduce((groupTotal, item) => groupTotal + item.originalLineTotal, 0),
    0,
  );

  return {
    categories,
    reviewGroups,
    subtotal,
    originalSubtotal,
    savings: originalSubtotal - subtotal,
    activeStepId: state.activeStepId,
  };
}