/** Qp/Qs pulmonary-to-systemic shunt ratio — educational worksheet. */

export type QpQsMethod = 'echo' | 'fick' | 'direct';

export type DiameterUnit = 'mm' | 'cm';
export type VtiUnit = 'cm';
export type FlowUnit = 'L_min' | 'mL_min';
export type O2ContentUnit = 'mL_dL';

export interface QpQsInput {
  method: QpQsMethod;
  /** Echocardiography */
  rvotDiameter: number | null;
  rvotDiameterUnit: DiameterUnit;
  rvotVti: number | null;
  rvotVtiUnit: VtiUnit;
  lvotDiameter: number | null;
  lvotDiameterUnit: DiameterUnit;
  lvotVti: number | null;
  lvotVtiUnit: VtiUnit;
  /** Fick (oxygen content, mL O₂/dL) */
  systemicArterialContent: number | null;
  mixedVenousContent: number | null;
  pulmonaryVenousContent: number | null;
  pulmonaryArterialContent: number | null;
  o2ContentUnit: O2ContentUnit;
  /** Direct flows */
  qpFlow: number | null;
  qsFlow: number | null;
  flowUnit: FlowUnit;
}

export interface QpQsResult {
  qpQsRatio: number;
  formattedRatio: string;
  methodLabel: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type QpQsFieldErrors = {
  form?: string;
  rvotDiameter?: string;
  rvotVti?: string;
  lvotDiameter?: string;
  lvotVti?: string;
  systemicArterialContent?: string;
  mixedVenousContent?: string;
  pulmonaryVenousContent?: string;
  pulmonaryArterialContent?: string;
  qpFlow?: string;
  qsFlow?: string;
};

export function createEmptyInput(): QpQsInput {
  return {
    method: 'echo',
    rvotDiameter: null,
    rvotDiameterUnit: 'mm',
    rvotVti: null,
    rvotVtiUnit: 'cm',
    lvotDiameter: null,
    lvotDiameterUnit: 'mm',
    lvotVti: null,
    lvotVtiUnit: 'cm',
    systemicArterialContent: null,
    mixedVenousContent: null,
    pulmonaryVenousContent: null,
    pulmonaryArterialContent: null,
    o2ContentUnit: 'mL_dL',
    qpFlow: null,
    qsFlow: null,
    flowUnit: 'L_min',
  };
}

/** Equal RVOT/LVOT geometry → Qp/Qs = 1 (echo). */
export function createEchoExampleInput(): QpQsInput {
  return {
    ...createEmptyInput(),
    method: 'echo',
    rvotDiameter: 26,
    rvotDiameterUnit: 'mm',
    rvotVti: 18,
    lvotDiameter: 26,
    lvotDiameterUnit: 'mm',
    lvotVti: 18,
  };
}

/** Matched arteriovenous O₂ step-ups → ratio 1 (Fick). */
export function createFickExampleInput(): QpQsInput {
  return {
    ...createEmptyInput(),
    method: 'fick',
    systemicArterialContent: 20,
    mixedVenousContent: 15,
    pulmonaryVenousContent: 20,
    pulmonaryArterialContent: 15,
  };
}

export function createDirectExampleInput(): QpQsInput {
  return {
    ...createEmptyInput(),
    method: 'direct',
    qpFlow: 5,
    qsFlow: 5,
    flowUnit: 'L_min',
  };
}

export function createExampleInput(): QpQsInput {
  return createEchoExampleInput();
}

export function inputsEqual(a: QpQsInput, b: QpQsInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}