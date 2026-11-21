/**
 * Lottery-specific state tax wrapper around Mega Millions TY 2025 state configs.
 *
 * California: state lottery winnings are generally exempt from California
 * personal income tax (Cal. Rev. & Tax. Code § 17147.5). Powerball jackpots
 * claimed as CA lottery prizes are treated as $0 CA state income tax here.
 *
 * Other jurisdictions reuse the shared progressive/flat/none tables.
 * Local taxes (e.g. NYC) remain omitted.
 */

import { calculateStateIncomeTax as calculateBaseStateIncomeTax } from '../mega-millions-payout/tax/state';
import type { FilingStatus as MegaFilingStatus } from '../mega-millions-payout/types';
import type { FilingStatus, UsStateCode } from './types';

const LOTTERY_STATE_EXEMPT: ReadonlySet<UsStateCode> = new Set(['CA']);

export function calculateLotteryStateIncomeTax(
  amount: number,
  state: UsStateCode,
  filingStatus: FilingStatus,
  taxYear: number,
): { tax: number; available: boolean; note?: string } {
  if (LOTTERY_STATE_EXEMPT.has(state)) {
    return {
      tax: 0,
      available: true,
      note:
        'California generally exempts state lottery winnings from CA personal income tax; estimate shows $0 state income tax.',
    };
  }
  return calculateBaseStateIncomeTax(
    amount,
    state,
    filingStatus as MegaFilingStatus,
    taxYear,
  );
}
