import type { SupportedCurrency } from '@/tools/shared/currency';

/** Which value the engine solves for. The other two are inputs. */
export type AdrSolveFor = 'adr' | 'revenue' | 'roomsSold';

export interface AdrInput {
  solveFor: AdrSolveFor;
  /** Room revenue only. Null when this value is the unknown. */
  roomRevenue: number | null;
  /** Sold room-nights. Null when this value is the unknown. */
  roomsSold: number | null;
  /** Average daily rate per sold room-night. Null when this value is the unknown. */
  adr: number | null;
  /** Direct available room-nights. Null when omitted. */
  availableRoomNights: number | null;
  /** Reporting-period length. Null when omitted. */
  daysInPeriod: number | null;
  /** Physical keys, not room-nights. Null when omitted. */
  physicalRooms: number | null;
  currency: SupportedCurrency;
}

export interface AdrResult {
  solveFor: AdrSolveFor;
  roomRevenue: number;
  roomsSold: number;
  adr: number;
  /** True when solved room-nights are not a whole number. */
  roomsSoldIsFractional: boolean;
  availableRoomNights: number | null;
  occupancyPercent: number | null;
  revpar: number | null;
  currency: SupportedCurrency;
}

export type AdrField =
  | 'roomRevenue'
  | 'roomsSold'
  | 'adr'
  | 'availableRoomNights'
  | 'daysInPeriod'
  | 'physicalRooms';

export type AdrFieldErrors = Partial<Record<AdrField, string>>;

export const MAX_MONEY = 1_000_000_000_000;
export const MAX_ROOM_NIGHTS = 100_000_000;
export const MAX_PHYSICAL_ROOMS = 100_000;
export const MAX_DAYS = 3_660;

export const DEFAULT_ADR_CURRENCY = 'PKR' as const;
