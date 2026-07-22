export type ProductCategory = 'cameras' | 'plan' | 'sensors' | 'accessories';

export interface ProductVariant {
  id: string;
  label: string;
  swatch: string;
  /** Product thumbnail rendered inside the variant chip (optional). */
  thumb?: string;
}

export interface ProductDefinition {
  id: string;
  category: ProductCategory;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number;
  badge?: string;
  kind: 'camera' | 'sensor' | 'plan' | 'accessory';
  /** Product photo path served from /public (optional; falls back to drawn artwork). */
  image?: string;
  /** Unit suffix appended after the price, e.g. "/mo". */
  priceSuffix?: string;
  /** Required item — quantity is fixed and the stepper is disabled. */
  locked?: boolean;
  variants?: ProductVariant[];
  defaultVariantId?: string;
}

export interface CategoryDefinition {
  id: ProductCategory;
  step: number;
  title: string;
  subtitle: string;
  icon: 'camera' | 'plan' | 'sensor' | 'shield';
}

export interface CatalogData {
  categories: CategoryDefinition[];
  products: ProductDefinition[];
}

export interface ProductSelection {
  activeVariantId: string | null;
  quantitiesByVariant: Record<string, number>;
}

export interface BuilderState {
  activeStepId: ProductCategory | null;
  selections: Record<string, ProductSelection>;
}

export interface SeedState {
  activeStepId?: ProductCategory | null;
  selections: Record<string, ProductSelection>;
}

export interface CategoryViewModel {
  definition: CategoryDefinition;
  products: Array<{
    definition: ProductDefinition;
    selection: ProductSelection;
    activeVariant: ProductVariant | null;
    quantity: number;
    isSelected: boolean;
  }>;
  selectedCount: number;
  isOpen: boolean;
}

export interface ReviewLineItemViewModel {
  key: string;
  definition: ProductDefinition;
  variant: ProductVariant | null;
  quantity: number;
  lineTotal: number;
  originalLineTotal: number;
}

export interface ReviewGroupViewModel {
  title: string;
  items: ReviewLineItemViewModel[];
}

export interface BuilderViewModel {
  categories: CategoryViewModel[];
  reviewGroups: ReviewGroupViewModel[];
  subtotal: number;
  originalSubtotal: number;
  savings: number;
  activeStepId: ProductCategory | null;
}

export interface BuilderActions {
  setActiveStep: (categoryId: ProductCategory | null) => void;
  selectVariant: (productId: string, variantId: string) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  incrementSpecificQuantity: (productId: string, variantId: string | null) => void;
  decrementSpecificQuantity: (productId: string, variantId: string | null) => void;
  saveConfiguration: () => void;
}

export interface BuilderStoreValue {
  state: BuilderState;
  viewModel: BuilderViewModel;
  actions: BuilderActions;
}