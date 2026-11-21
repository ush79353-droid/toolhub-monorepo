import type { SupportedCurrency } from '@/tools/shared/currency';

export type BillingFrequency = 'monthly' | 'yearly' | 'weekly' | 'quarterly';

export type SubscriptionCategoryId =
  | 'streaming-tv'
  | 'ecommerce-delivery'
  | 'music-audio'
  | 'cloud-storage'
  | 'gaming'
  | 'software-productivity'
  | 'digital-tools'
  | 'other';

export const BILLING_FREQUENCY_OPTIONS: readonly {
  value: BillingFrequency;
  label: string;
}[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'quarterly', label: 'Quarterly' },
] as const;

export const SUBSCRIPTION_CATEGORIES: readonly {
  id: SubscriptionCategoryId;
  label: string;
  services: readonly string[];
}[] = [
  {
    id: 'streaming-tv',
    label: 'Streaming TV',
    services: [
      'Netflix',
      'Amazon Prime Video',
      'Disney+',
      'Hulu',
      'HBO Max / Max',
      'Apple TV+',
      'Paramount+',
      'Peacock',
      'YouTube Premium',
      'Other',
    ],
  },
  {
    id: 'ecommerce-delivery',
    label: 'E-Commerce & Delivery',
    services: [
      'Amazon Prime',
      'Walmart+',
      'Instacart+',
      'DoorDash DashPass',
      'Uber One',
      'Other',
    ],
  },
  {
    id: 'music-audio',
    label: 'Music & Audio',
    services: [
      'Spotify Premium',
      'Apple Music',
      'YouTube Music',
      'Amazon Music',
      'Audible',
      'Deezer',
      'Other',
    ],
  },
  {
    id: 'cloud-storage',
    label: 'Cloud Storage',
    services: [
      'Google One',
      'iCloud+',
      'Dropbox',
      'Microsoft OneDrive',
      'Box',
      'Other',
    ],
  },
  {
    id: 'gaming',
    label: 'Gaming',
    services: [
      'Xbox Game Pass',
      'PlayStation Plus',
      'Nintendo Switch Online',
      'EA Play',
      'Ubisoft+',
      'Other',
    ],
  },
  {
    id: 'software-productivity',
    label: 'Software & Productivity',
    services: [
      'Microsoft 365',
      'Adobe Creative Cloud',
      'Notion',
      'Evernote',
      'Grammarly',
      'Other',
    ],
  },
  {
    id: 'digital-tools',
    label: 'Digital Tools',
    services: ['ChatGPT', 'Claude', 'Canva Pro', 'Figma', 'Other'],
  },
  {
    id: 'other',
    label: 'Other',
    services: ['Other'],
  },
] as const;

export interface SubscriptionEntry {
  id: string;
  serviceKey: string;
  customName: string;
  amount: string;
  billingFrequency: BillingFrequency;
  selectedForCancellation: boolean;
}

export type SubscriptionEntriesByCategory = Record<
  SubscriptionCategoryId,
  SubscriptionEntry[]
>;

export interface SubscriptionWasteInput {
  currency: SupportedCurrency;
  readMeOpen: boolean;
  openCategories: Partial<Record<SubscriptionCategoryId, boolean>>;
  entries: SubscriptionEntriesByCategory;
}

export interface CategoryBreakdownRow {
  categoryId: SubscriptionCategoryId;
  label: string;
  monthlyTotal: number;
  annualTotal: number;
  activeCount: number;
}

export interface SubscriptionLineResult {
  id: string;
  categoryId: SubscriptionCategoryId;
  displayName: string;
  amount: number;
  billingFrequency: BillingFrequency;
  monthlyEquivalent: number;
  selectedForCancellation: boolean;
}

export interface SubscriptionWasteResult {
  lines: SubscriptionLineResult[];
  categoryBreakdown: CategoryBreakdownRow[];
  totalMonthlySpending: number;
  totalAnnualSpending: number;
  potentialMonthlySavings: number;
  potentialAnnualSavings: number;
  currency: SupportedCurrency;
}

export type SubscriptionWasteFieldErrors = {
  form?: string;
  entries?: Partial<Record<string, string>>;
};

let entrySeq = 0;

export function createEntryId(): string {
  entrySeq += 1;
  return `sub-${Date.now().toString(36)}-${entrySeq}`;
}

export function createEmptyEntry(
  serviceKey = '',
): SubscriptionEntry {
  return {
    id: createEntryId(),
    serviceKey,
    customName: '',
    amount: '',
    billingFrequency: 'monthly',
    selectedForCancellation: false,
  };
}

function emptyEntries(): SubscriptionEntriesByCategory {
  return {
    'streaming-tv': [],
    'ecommerce-delivery': [],
    'music-audio': [],
    'cloud-storage': [],
    gaming: [],
    'software-productivity': [],
    'digital-tools': [],
    other: [],
  };
}

export function createDefaultInput(): SubscriptionWasteInput {
  return {
    currency: 'USD',
    readMeOpen: true,
    openCategories: { 'streaming-tv': true },
    entries: {
      ...emptyEntries(),
      'streaming-tv': [
        {
          id: createEntryId(),
          serviceKey: 'Netflix',
          customName: '',
          amount: '20',
          billingFrequency: 'monthly',
          selectedForCancellation: false,
        },
        {
          id: createEntryId(),
          serviceKey: 'Amazon Prime Video',
          customName: '',
          amount: '45',
          billingFrequency: 'monthly',
          selectedForCancellation: false,
        },
      ],
    },
  };
}

export function createExampleInput(): SubscriptionWasteInput {
  return {
    currency: 'USD',
    readMeOpen: true,
    openCategories: {
      'streaming-tv': true,
      'music-audio': true,
      'cloud-storage': true,
    },
    entries: {
      ...emptyEntries(),
      'streaming-tv': [
        {
          id: createEntryId(),
          serviceKey: 'Netflix',
          customName: '',
          amount: '20',
          billingFrequency: 'monthly',
          selectedForCancellation: false,
        },
        {
          id: createEntryId(),
          serviceKey: 'Amazon Prime Video',
          customName: '',
          amount: '45',
          billingFrequency: 'monthly',
          selectedForCancellation: false,
        },
      ],
      'music-audio': [
        {
          id: createEntryId(),
          serviceKey: 'Spotify Premium',
          customName: '',
          amount: '10',
          billingFrequency: 'monthly',
          selectedForCancellation: false,
        },
      ],
      'cloud-storage': [
        {
          id: createEntryId(),
          serviceKey: 'Google One',
          customName: '',
          amount: '120',
          billingFrequency: 'yearly',
          selectedForCancellation: false,
        },
      ],
    },
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): SubscriptionWasteInput {
  return {
    currency,
    readMeOpen: true,
    openCategories: { 'streaming-tv': true },
    entries: emptyEntries(),
  };
}

export function categoryLabel(id: SubscriptionCategoryId): string {
  return SUBSCRIPTION_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function resolveDisplayName(entry: SubscriptionEntry): string {
  if (entry.serviceKey === 'Other' || entry.serviceKey === '') {
    return entry.customName.trim() || 'Custom service';
  }
  return entry.serviceKey;
}

export function hasSubscriptionChanges(input: SubscriptionWasteInput): boolean {
  return SUBSCRIPTION_CATEGORIES.some((cat) =>
    input.entries[cat.id].some(
      (entry) =>
        entry.serviceKey.trim() !== '' ||
        entry.customName.trim() !== '' ||
        entry.amount.trim() !== '' ||
        entry.selectedForCancellation,
    ),
  );
}
