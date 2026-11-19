/**
 * Historical US federal AMT parameters for tax years 2022 and 2023.
 *
 * Official sources:
 * - Instructions for Form 6251 (2022) — exemption, phaseout, MFS add-on,
 *   26%/28% taxable-excess ceilings and offsets
 * - Instructions for Form 6251 (2023) — same structure, inflation-updated amounts
 * - Rev. Proc. 2021-45 (§3.12 / §55) — TY 2022 inflation adjustments
 * - Rev. Proc. 2022-38 (§3.12 / §55) — TY 2023 inflation adjustments
 */
import type { AmtFilingStatus, AmtTaxYear } from './types';

export interface AmtStatusParams {
  /** Base AMT exemption under §55(d)(1). */
  exemption: number;
  /** AMTI above which the exemption phases out at 25%. */
  phaseoutStart: number;
  /**
   * AMTI at which the exemption is fully phased out.
   * For MFS, also the threshold that triggers the line-4 add-on rule.
   */
  phaseoutComplete: number;
  /**
   * MFS only: AMTI at or above which the full exemption is added back to line 4.
   * 0 when not applicable (single / MFJ).
   */
  mfsAddonFullAt: number;
  /** Taxable excess at or below which the 26% rate applies. */
  rate26Ceiling: number;
  /** Dollars subtracted when using the 28% method (keeps continuity at the 26% ceiling). */
  rate28Offset: number;
}

export const AMT_PARAMS: Record<AmtTaxYear, Record<AmtFilingStatus, AmtStatusParams>> = {
  2022: {
    single: {
      exemption: 75_900,
      phaseoutStart: 539_900,
      phaseoutComplete: 776_100,
      mfsAddonFullAt: 0,
      rate26Ceiling: 206_100,
      rate28Offset: 4_122,
    },
    'married-joint': {
      exemption: 118_100,
      phaseoutStart: 1_079_800,
      phaseoutComplete: 1_552_200,
      mfsAddonFullAt: 0,
      rate26Ceiling: 206_100,
      rate28Offset: 4_122,
    },
    'married-separate': {
      exemption: 59_050,
      phaseoutStart: 539_900,
      phaseoutComplete: 776_100,
      mfsAddonFullAt: 1_012_300,
      rate26Ceiling: 103_050,
      rate28Offset: 2_061,
    },
  },
  2023: {
    single: {
      exemption: 81_300,
      phaseoutStart: 578_150,
      phaseoutComplete: 903_350,
      mfsAddonFullAt: 0,
      rate26Ceiling: 220_700,
      rate28Offset: 4_414,
    },
    'married-joint': {
      exemption: 126_500,
      phaseoutStart: 1_156_300,
      phaseoutComplete: 1_662_300,
      mfsAddonFullAt: 0,
      rate26Ceiling: 220_700,
      rate28Offset: 4_414,
    },
    'married-separate': {
      exemption: 63_250,
      phaseoutStart: 578_150,
      phaseoutComplete: 831_150,
      mfsAddonFullAt: 1_084_150,
      rate26Ceiling: 110_350,
      rate28Offset: 2_207,
    },
  },
};

export const DISCLOSURE_TENTATIVE =
  'Tentative AMT estimate after permitted credits — not additional AMT owed. Additional AMT generally equals max(0, tentative minimum tax − regular tax), and regular tax is not collected on this form.';

export const DISCLOSURE_AMTI =
  'AMTI is the authoritative base (Form 6251 line 4 style). AGI + non-deductible taxes is only a suggested starting point when AMT adjustments or preference items apply.';

export const DISCLOSURE_SCOPE =
  'Educational historical estimate for tax years 2022 and 2023 only. Capital-gain preferential AMT worksheets and foreign earned income worksheets are out of scope. Not tax advice.';
