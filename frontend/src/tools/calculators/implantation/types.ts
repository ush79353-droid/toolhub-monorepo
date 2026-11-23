/**
 * Implantation Calculator — dual-panel state (natural + IVF), screenshot-first.
 * Reproductive inputs stay client-side only.
 */

export type OvulationKnowledge = 'yes' | 'no';

export interface NaturalImplantationInput {
  knowsOvulation: OvulationKnowledge;
  ovulationIso: string;
  /** Shown when knowsOvulation is `no`. */
  cycleLengthDaysText: string;
  lastPeriodIso: string;
}

export interface IvfImplantationInput {
  transferIso: string;
}

export interface ImplantationInput {
  natural: NaturalImplantationInput;
  ivf: IvfImplantationInput;
}

export interface ImplantationWindow {
  startIso: string;
  endIso: string;
  typicalIso: string;
  formattedStart: string;
  formattedEnd: string;
  formattedTypical: string;
}

export interface ImplantationResult {
  natural: {
    ready: boolean;
    ovulationIso: string | null;
    ovulationEstimated: boolean;
    window: ImplantationWindow | null;
  };
  ivf: {
    ready: boolean;
    transferIso: string | null;
    window: ImplantationWindow | null;
    embryoAgeSpecified: false;
  };
  sourceLabel: string;
  disclaimer: string;
  naturalNote: string | null;
  ivfNote: string | null;
}

export type ImplantationFieldErrors = {
  form?: string;
  naturalOvulation?: string;
  naturalCycle?: string;
  naturalLmp?: string;
  ivfTransfer?: string;
};

export function createEmptyNaturalInput(): NaturalImplantationInput {
  return {
    knowsOvulation: 'yes',
    ovulationIso: '',
    cycleLengthDaysText: '28',
    lastPeriodIso: '',
  };
}

export function createEmptyIvfInput(): IvfImplantationInput {
  return { transferIso: '' };
}

export function createEmptyInput(): ImplantationInput {
  return {
    natural: createEmptyNaturalInput(),
    ivf: createEmptyIvfInput(),
  };
}

export function inputsEqual(a: ImplantationInput, b: ImplantationInput): boolean {
  return (
    a.natural.knowsOvulation === b.natural.knowsOvulation &&
    a.natural.ovulationIso === b.natural.ovulationIso &&
    a.natural.cycleLengthDaysText === b.natural.cycleLengthDaysText &&
    a.natural.lastPeriodIso === b.natural.lastPeriodIso &&
    a.ivf.transferIso === b.ivf.transferIso
  );
}