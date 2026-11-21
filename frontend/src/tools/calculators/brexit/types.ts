import {
  DEFAULT_CURRENT_WEEKLY_LOSS_GBP,
  DEFAULT_GOVERNMENT_SPENDING_GBP,
  DEFAULT_SPENDING_DETAILS,
  REFERENDUM_ISO,
  type OpportunityId,
} from './constants';

export type CostRateUnit = 'sec' | 'day' | 'wk' | 'yr';

export interface SpendingDetailsInput {
  euReferendum: string;
  generalElections: string;
  mpWindingUp: string;
  departmentSpending: string;
  euElections2019: string;
  otherDocumented: string;
}

export interface BrexitInput {
  /** ISO local datetime string for datetime-local input (referendum start). */
  sinceIsoLocal: string;
  /** ISO local datetime string for "till" end (empty = live now). */
  tillIsoLocal: string;
  /** Whether till tracks wall clock. */
  tillFollowsNow: boolean;
  currentCost: string;
  currentCostUnit: CostRateUnit;
  governmentSpending: string;
  showCostDetails: boolean;
  spendingDetails: SpendingDetailsInput;
}

export interface OpportunityQuantity {
  id: OpportunityId;
  label: string;
  group: string;
  unitCostGbp: number;
  quantity: number;
  note?: string;
}

export interface BrexitResult {
  sinceMs: number;
  tillMs: number;
  currentWeeklyLossGbp: number;
  governmentSpendingGbp: number;
  pre2020LossGbp: number;
  post2020LossGbp: number;
  costSoFarGbp: number;
  franceRubbishEquiv: number | null;
  opportunities: OpportunityQuantity[];
  formattedCostSoFar: string;
  formattedCurrentWeekly: string;
  formattedGovernmentSpending: string;
  explanation: string;
  sourceSummary: string;
}

export type BrexitFieldErrors = {
  form?: string;
  sinceIsoLocal?: string;
  tillIsoLocal?: string;
  currentCost?: string;
  governmentSpending?: string;
  spendingDetails?: string;
};

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function referendumLocalDefault(): string {
  // Display the canonical referendum instant in the user's local zone.
  return toDatetimeLocalValue(new Date(REFERENDUM_ISO));
}

export function createDefaultInput(now = new Date()): BrexitInput {
  const d = DEFAULT_SPENDING_DETAILS;
  return {
    sinceIsoLocal: referendumLocalDefault(),
    tillIsoLocal: toDatetimeLocalValue(now),
    tillFollowsNow: true,
    currentCost: String(DEFAULT_CURRENT_WEEKLY_LOSS_GBP),
    currentCostUnit: 'wk',
    governmentSpending: String(DEFAULT_GOVERNMENT_SPENDING_GBP),
    showCostDetails: false,
    spendingDetails: {
      euReferendum: String(d.euReferendum),
      generalElections: String(d.generalElections),
      mpWindingUp: String(d.mpWindingUp),
      departmentSpending: String(d.departmentSpending),
      euElections2019: String(d.euElections2019),
      otherDocumented: String(d.otherDocumented),
    },
  };
}

export function createEmptyInput(): BrexitInput {
  return {
    sinceIsoLocal: '',
    tillIsoLocal: '',
    tillFollowsNow: false,
    currentCost: '',
    currentCostUnit: 'wk',
    governmentSpending: '',
    showCostDetails: false,
    spendingDetails: {
      euReferendum: '',
      generalElections: '',
      mpWindingUp: '',
      departmentSpending: '',
      euElections2019: '',
      otherDocumented: '',
    },
  };
}

export function spendingDetailsSum(details: SpendingDetailsInput): number | null {
  const keys: (keyof SpendingDetailsInput)[] = [
    'euReferendum',
    'generalElections',
    'mpWindingUp',
    'departmentSpending',
    'euElections2019',
    'otherDocumented',
  ];
  let sum = 0;
  for (const key of keys) {
    const cleaned = details[key].trim().replace(/,/g, '');
    if (cleaned === '') continue;
    const n = Number(cleaned);
    if (!Number.isFinite(n) || n < 0) return null;
    sum += n;
  }
  return sum;
}
