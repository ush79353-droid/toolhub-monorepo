import type { SupportedCurrency } from '@/tools/shared/currency';

/** Independent FX money line (amount string + currency). Guests never use this. */
export interface MoneyAmount {
  amount: string;
  currency: SupportedCurrency;
}

export interface CustomExpenseLine {
  id: string;
  label: string;
  amount: string;
  currency: SupportedCurrency;
}

export type SectionId =
  | 'weddingInfo'
  | 'brideGroom'
  | 'subcontractors'
  | 'venueFood'
  | 'ceremony'
  | 'transport'
  | 'custom';

export interface WeddingBudgetInput {
  plannedBudget: MoneyAmount;
  guestCount: string;
  // Bride and Groom
  bridesDress: MoneyAmount;
  jewellery: MoneyAmount;
  groomsSuit: MoneyAmount;
  weddingRings: MoneyAmount;
  hairAndMakeup: MoneyAmount;
  // Subcontractors
  weddingStationery: MoneyAmount;
  photographyVideo: MoneyAmount;
  florist: MoneyAmount;
  weddingPlanner: MoneyAmount;
  // Venue, food and drinks
  venue: MoneyAmount;
  rehearsalDinner: MoneyAmount;
  catering: MoneyAmount;
  weddingCake: MoneyAmount;
  musiciansDj: MoneyAmount;
  liquors: MoneyAmount;
  // Ceremony
  ceremonySite: MoneyAmount;
  officiant: MoneyAmount;
  // Transportation and accommodation
  hotel: MoneyAmount;
  limoTransport: MoneyAmount;
  customExpenses: CustomExpenseLine[];
  openSections: Record<SectionId, boolean>;
}

export type BudgetBalanceStatus = 'balanced' | 'under' | 'over';

export interface WeddingBudgetResult {
  calcCurrency: SupportedCurrency;
  brideGroomTotal: number;
  subcontractorsTotal: number;
  venueFoodTotal: number;
  ceremonyTotal: number;
  transportTotal: number;
  customTotal: number;
  totalWeddingCost: number;
  /** Null when guest count is not a positive number (no Infinity/NaN). */
  costPerGuest: number | null;
  budgetBalance: number;
  balanceStatus: BudgetBalanceStatus;
  statusMessage: string;
  formattedBrideGroomTotal: string;
  formattedSubcontractorsTotal: string;
  formattedVenueFoodTotal: string;
  formattedCeremonyTotal: string;
  formattedTransportTotal: string;
  formattedCustomTotal: string;
  formattedTotalWeddingCost: string;
  formattedCostPerGuest: string;
  formattedBudgetBalance: string;
  summaryText: string;
}

export type WeddingBudgetFieldErrors = {
  plannedBudget?: string;
  guestCount?: string;
  bridesDress?: string;
  jewellery?: string;
  groomsSuit?: string;
  weddingRings?: string;
  hairAndMakeup?: string;
  weddingStationery?: string;
  photographyVideo?: string;
  florist?: string;
  weddingPlanner?: string;
  venue?: string;
  rehearsalDinner?: string;
  catering?: string;
  weddingCake?: string;
  musiciansDj?: string;
  liquors?: string;
  ceremonySite?: string;
  officiant?: string;
  hotel?: string;
  limoTransport?: string;
  customExpenses?: string;
  form?: string;
};

export type ExpenseFieldKey = Exclude<
  keyof WeddingBudgetInput,
  'guestCount' | 'customExpenses' | 'openSections' | 'plannedBudget'
>;

export const EXPENSE_FIELD_KEYS: readonly ExpenseFieldKey[] = [
  'bridesDress',
  'jewellery',
  'groomsSuit',
  'weddingRings',
  'hairAndMakeup',
  'weddingStationery',
  'photographyVideo',
  'florist',
  'weddingPlanner',
  'venue',
  'rehearsalDinner',
  'catering',
  'weddingCake',
  'musiciansDj',
  'liquors',
  'ceremonySite',
  'officiant',
  'hotel',
  'limoTransport',
] as const;

function money(amount = '0', currency: SupportedCurrency = 'PKR'): MoneyAmount {
  return { amount, currency };
}

export function createCustomExpenseLine(
  partial?: Partial<CustomExpenseLine>
): CustomExpenseLine {
  return {
    id:
      partial?.id ??
      `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    label: partial?.label ?? '',
    amount: partial?.amount ?? '0',
    currency: partial?.currency ?? 'PKR',
  };
}

export function createDefaultInput(): WeddingBudgetInput {
  return {
    plannedBudget: money('0'),
    guestCount: '100',
    bridesDress: money(),
    jewellery: money(),
    groomsSuit: money(),
    weddingRings: money(),
    hairAndMakeup: money(),
    weddingStationery: money(),
    photographyVideo: money(),
    florist: money(),
    weddingPlanner: money(),
    venue: money(),
    rehearsalDinner: money(),
    catering: money(),
    weddingCake: money(),
    musiciansDj: money(),
    liquors: money(),
    ceremonySite: money(),
    officiant: money(),
    hotel: money(),
    limoTransport: money(),
    customExpenses: [],
    openSections: {
      weddingInfo: true,
      brideGroom: true,
      subcontractors: true,
      venueFood: true,
      ceremony: true,
      transport: true,
      custom: false,
    },
  };
}

export function inputsEqual(a: WeddingBudgetInput, b: WeddingBudgetInput): boolean {
  const moneyEq = (x: MoneyAmount, y: MoneyAmount) =>
    x.amount === y.amount && x.currency === y.currency;
  if (!moneyEq(a.plannedBudget, b.plannedBudget)) return false;
  if (a.guestCount !== b.guestCount) return false;
  for (const key of EXPENSE_FIELD_KEYS) {
    if (!moneyEq(a[key], b[key])) return false;
  }
  if (a.customExpenses.length !== b.customExpenses.length) return false;
  for (let i = 0; i < a.customExpenses.length; i++) {
    const x = a.customExpenses[i]!;
    const y = b.customExpenses[i]!;
    if (
      x.id !== y.id ||
      x.label !== y.label ||
      x.amount !== y.amount ||
      x.currency !== y.currency
    ) {
      return false;
    }
  }
  return true;
}
