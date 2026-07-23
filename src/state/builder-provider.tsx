import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { CatalogData, SeedState, BuilderStoreValue, BuilderState, ProductCategory } from '@/types/builder';
import { createBuilderViewModel, normalizeBuilderState } from '@/state/create-builder-view-model';

const STORAGE_KEY = 'bundle-builder-state-v1';

const BuilderContext = createContext<BuilderStoreValue | null>(null);

type BuilderAction =
  | { type: 'setActiveStep'; categoryId: ProductCategory | null }
  | { type: 'selectVariant'; productId: string; variantId: string }
  | { type: 'incrementQuantity'; productId: string }
  | { type: 'decrementQuantity'; productId: string }
  | { type: 'incrementSpecificQuantity'; productId: string; variantId: string | null }
  | { type: 'decrementSpecificQuantity'; productId: string; variantId: string | null }
  | { type: 'replaceState'; state: BuilderState };

function readStoredState(): Partial<BuilderState> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as Partial<BuilderState>;
  } catch {
    return null;
  }
}

function reducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'setActiveStep':
      return { ...state, activeStepId: action.categoryId };
    case 'selectVariant': {
      const currentSelection = state.selections[action.productId];

      if (!currentSelection) {
        return state;
      }

      return {
        ...state,
        selections: {
          ...state.selections,
          [action.productId]: {
            ...currentSelection,
            activeVariantId: action.variantId,
          },
        },
      };
    }
    case 'incrementQuantity': {
      const currentSelection = state.selections[action.productId];

      if (!currentSelection) {
        return state;
      }

      const targetVariantId = currentSelection.activeVariantId ?? 'default';
      const currentQuantity = currentSelection.quantitiesByVariant[targetVariantId] ?? 0;

      return {
        ...state,
        selections: {
          ...state.selections,
          [action.productId]: {
            ...currentSelection,
            quantitiesByVariant: {
              ...currentSelection.quantitiesByVariant,
              [targetVariantId]: currentQuantity + 1,
            },
          },
        },
      };
    }
    case 'incrementSpecificQuantity': {
      const currentSelection = state.selections[action.productId];

      if (!currentSelection) {
        return state;
      }

      const targetVariantId = action.variantId ?? 'default';
      const currentQuantity = currentSelection.quantitiesByVariant[targetVariantId] ?? 0;

      return {
        ...state,
        selections: {
          ...state.selections,
          [action.productId]: {
            ...currentSelection,
            quantitiesByVariant: {
              ...currentSelection.quantitiesByVariant,
              [targetVariantId]: currentQuantity + 1,
            },
          },
        },
      };
    }
    case 'decrementQuantity': {
      const currentSelection = state.selections[action.productId];

      if (!currentSelection) {
        return state;
      }

      const targetVariantId = currentSelection.activeVariantId ?? 'default';
      const currentQuantity = currentSelection.quantitiesByVariant[targetVariantId] ?? 0;

      if (currentQuantity <= 0) {
        return state;
      }

      return {
        ...state,
        selections: {
          ...state.selections,
          [action.productId]: {
            ...currentSelection,
            quantitiesByVariant: {
              ...currentSelection.quantitiesByVariant,
              [targetVariantId]: currentQuantity - 1,
            },
          },
        },
      };
    }
    case 'decrementSpecificQuantity': {
      const currentSelection = state.selections[action.productId];

      if (!currentSelection) {
        return state;
      }

      const targetVariantId = action.variantId ?? 'default';
      const currentQuantity = currentSelection.quantitiesByVariant[targetVariantId] ?? 0;

      if (currentQuantity <= 0) {
        return state;
      }

      return {
        ...state,
        selections: {
          ...state.selections,
          [action.productId]: {
            ...currentSelection,
            quantitiesByVariant: {
              ...currentSelection.quantitiesByVariant,
              [targetVariantId]: currentQuantity - 1,
            },
          },
        },
      };
    }
    case 'replaceState':
      return action.state;
    default:
      return state;
  }
}

export function BuilderProvider({
  catalog,
  seedState,
  children,
}: {
  catalog: CatalogData;
  seedState: SeedState;
  children: React.ReactNode;
}) {
  const initialState = useMemo(() => {
    const storedState = readStoredState();
    return normalizeBuilderState(catalog, storedState ?? seedState);
  }, [catalog, seedState]);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'replaceState', state: normalizeBuilderState(catalog, readStoredState() ?? seedState) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = useMemo(
    () => ({
      setActiveStep: (categoryId: ProductCategory | null) => dispatch({ type: 'setActiveStep', categoryId }),
      selectVariant: (productId: string, variantId: string) => dispatch({ type: 'selectVariant', productId, variantId }),
      incrementQuantity: (productId: string) => dispatch({ type: 'incrementQuantity', productId }),
      decrementQuantity: (productId: string) => dispatch({ type: 'decrementQuantity', productId }),
      incrementSpecificQuantity: (productId: string, variantId: string | null) =>
        dispatch({ type: 'incrementSpecificQuantity', productId, variantId }),
      decrementSpecificQuantity: (productId: string, variantId: string | null) =>
        dispatch({ type: 'decrementSpecificQuantity', productId, variantId }),
      saveConfiguration: () => {
        if (typeof window === 'undefined') {
          return;
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },
    }),
    [state],
  );

  const viewModel = useMemo(() => createBuilderViewModel(catalog, state), [catalog, state]);

  return <BuilderContext.Provider value={{ state, viewModel, actions }}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const context = useContext(BuilderContext);

  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }

  return context;
}

export function useBuilderActions() {
  return useBuilder().actions;
}