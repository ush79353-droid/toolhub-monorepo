import type { SdltBuyerScenario, SdltResidency } from './rates';

export type { SdltBuyerScenario, SdltResidency };

export interface StampDutyLandTaxUkInput {
  buyerScenario: SdltBuyerScenario;
  residency: SdltResidency;
  /** Property price (£) as typed string. */
  propertyPrice: string;
}

export interface SdltBandBreakdownRow {
  label: string;
  portion: number;
  rate: number;
  tax: number;
  formattedPortion: string;
  formattedRate: string;
  formattedTax: string;
}

export interface StampDutyLandTaxUkResult {
  propertyPrice: number;
  buyerScenario: SdltBuyerScenario;
  residency: SdltResidency;
  scheduleId: string;
  scheduleLabel: string;
  usedFirstTimeBuyerRelief: boolean;
  usedHigherRates: boolean;
  nonResidentSurchargeApplied: boolean;
  stampDuty: number;
  formattedStampDuty: string;
  formattedPropertyPrice: string;
  bands: SdltBandBreakdownRow[];
  steps: string[];
  interpretation: string;
  explanation: string;
  disclaimer: string;
}

export type StampDutyLandTaxUkFieldErrors = {
  form?: string;
  propertyPrice?: string;
};

export function createDefaultInput(): StampDutyLandTaxUkInput {
  return {
    buyerScenario: 'first_time_buyer',
    residency: 'uk',
    propertyPrice: '',
  };
}

export function createEmptyInput(): StampDutyLandTaxUkInput {
  return createDefaultInput();
}

/** GOV.UK FTB worked example: £500,000 → £10,000 SDLT. */
export function createExampleInput(): StampDutyLandTaxUkInput {
  return {
    buyerScenario: 'first_time_buyer',
    residency: 'uk',
    propertyPrice: '500000',
  };
}
