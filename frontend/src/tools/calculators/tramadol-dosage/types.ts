export type AgeBand = 'under_17' | 'adult' | 'over_75';
export type PainKind = 'acute' | 'chronic';
export type TabletStrengthMg = 100 | 150 | 200 | 300;
export type LastEdited = 'dailyMg' | 'tablets';

export type DoseStatus =
  | 'awaiting'
  | 'contraindicated_age'
  | 'ready'
  | 'not_divisible'
  | 'over_max';

export interface TramadolDosageInput {
  ageBand: AgeBand;
  organInsufficiency: boolean;
  painKind: PainKind;
  tabletStrengthMg: TabletStrengthMg;
  /** Clinician-prescribed daily amount (mg). */
  dailyMg: string;
  tablets: string;
  lastEdited: LastEdited | null;
}

export interface TramadolDosageResult {
  status: DoseStatus;
  educationalMaxMg: number | null;
  dailyMg: number | null;
  tablets: number | null;
  formattedDailyMg: string | null;
  formattedTablets: string | null;
  statusNote: string | null;
  maxNote: string | null;
  titrationBlockedNote: string;
  disclaimer: string;
  sourceNote: string;
}

export type TramadolDosageFieldErrors = {
  form?: string;
  dailyMg?: string;
  tablets?: string;
};

export function createDefaultInput(): TramadolDosageInput {
  return {
    ageBand: 'adult',
    organInsufficiency: false,
    painKind: 'chronic',
    tabletStrengthMg: 100,
    dailyMg: '',
    tablets: '',
    lastEdited: null,
  };
}

export function createEmptyInput(): TramadolDosageInput {
  return createDefaultInput();
}

/** Conversion fixture: 300 mg/day @ 100 mg → 3 tablets (within chronic max). */
export function createExampleInput(): TramadolDosageInput {
  return {
    ageBand: 'adult',
    organInsufficiency: false,
    painKind: 'chronic',
    tabletStrengthMg: 100,
    dailyMg: '300',
    tablets: '3',
    lastEdited: 'dailyMg',
  };
}

export function inputsEqual(
  a: TramadolDosageInput,
  b: TramadolDosageInput,
): boolean {
  return (
    a.ageBand === b.ageBand &&
    a.organInsufficiency === b.organInsufficiency &&
    a.painKind === b.painKind &&
    a.tabletStrengthMg === b.tabletStrengthMg &&
    a.dailyMg === b.dailyMg &&
    a.tablets === b.tablets &&
    a.lastEdited === b.lastEdited
  );
}
