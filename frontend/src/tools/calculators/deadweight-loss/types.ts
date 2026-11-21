import type { SupportedCurrency } from '@/tools/shared/currency';

export type DeadweightLossMode = 'triangle' | 'tax' | 'linear';

export type QuantityUnitLabel = 'units' | 'items' | 'products' | 'transactions';

export interface DeadweightLossInput {
  mode: DeadweightLossMode;
  currency: SupportedCurrency;
  quantityUnit: QuantityUnitLabel;
  // Triangle
  originalPrice: string;
  newPrice: string;
  originalQuantity: string;
  newQuantity: string;
  // Tax
  efficientQuantity: string;
  afterTaxQuantity: string;
  taxWedge: string;
  // Linear inverse demand P=a−bQ, supply P=c+dQ
  demandIntercept: string;
  demandSlope: string;
  supplyIntercept: string;
  supplySlope: string;
  distortedQuantity: string;
}

export interface GraphPoint {
  q: number;
  p: number;
}

export interface DeadweightLossGraph {
  kind: 'triangle' | 'linear';
  /** Closed polygon in quantity/price space for DWL shade (data coords). */
  dwlPolygon: GraphPoint[];
  /** Optional demand/supply samples for linear mode. */
  demandPoints?: GraphPoint[];
  supplyPoints?: GraphPoint[];
  qEfficient: number;
  qDistorted: number;
  pLow: number;
  pHigh: number;
  qMax: number;
  pMax: number;
  labels: {
    title: string;
    note: string;
  };
}

export interface DeadweightLossResult {
  mode: DeadweightLossMode;
  currency: SupportedCurrency;
  quantityUnit: QuantityUnitLabel;
  priceDifference: number | null;
  quantityDifference: number | null;
  deadweightLoss: number;
  taxRevenue: number | null;
  equilibriumQuantity: number | null;
  equilibriumPrice: number | null;
  formattedDeadweightLoss: string;
  formattedPriceDifference: string | null;
  formattedQuantityDifference: string | null;
  formattedTaxRevenue: string | null;
  formattedEquilibriumQuantity: string | null;
  formattedEquilibriumPrice: string | null;
  formulaBreakdown: string;
  explanation: string;
  assumptionNote: string;
  graph: DeadweightLossGraph;
}

export type DeadweightLossFieldErrors = {
  form?: string;
  originalPrice?: string;
  newPrice?: string;
  originalQuantity?: string;
  newQuantity?: string;
  efficientQuantity?: string;
  afterTaxQuantity?: string;
  taxWedge?: string;
  demandIntercept?: string;
  demandSlope?: string;
  supplyIntercept?: string;
  supplySlope?: string;
  distortedQuantity?: string;
};

export function createDefaultInput(): DeadweightLossInput {
  return {
    mode: 'triangle',
    currency: 'USD',
    quantityUnit: 'units',
    originalPrice: '10',
    newPrice: '14',
    originalQuantity: '1000',
    newQuantity: '800',
    efficientQuantity: '1000',
    afterTaxQuantity: '800',
    taxWedge: '4',
    demandIntercept: '20',
    demandSlope: '0.01',
    supplyIntercept: '0',
    supplySlope: '0.01',
    distortedQuantity: '800',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'USD',
  quantityUnit: QuantityUnitLabel = 'units'
): DeadweightLossInput {
  return {
    mode: 'triangle',
    currency,
    quantityUnit,
    originalPrice: '',
    newPrice: '',
    originalQuantity: '',
    newQuantity: '',
    efficientQuantity: '',
    afterTaxQuantity: '',
    taxWedge: '',
    demandIntercept: '',
    demandSlope: '',
    supplyIntercept: '',
    supplySlope: '',
    distortedQuantity: '',
  };
}
