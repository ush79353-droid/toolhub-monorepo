export type PregnancyStatus = 'pregnant' | 'planning';

export type Plurality = 'one' | 'twins' | 'triplets';

/**
 * IVF dating mode (screenshot “Type of transmission”).
 * Own/donor eggs: ACOG retrieval/fertilization dating (+266).
 * Day-3 / Day-5: ACOG transfer dating (+263 / +261).
 */
export type IvfTransferType =
  | 'own_eggs'
  | 'donor_eggs'
  | 'day3_transfer'
  | 'day5_transfer';

export interface IvfDueDateInput {
  pregnancyStatus: PregnancyStatus;
  plurality: Plurality;
  transferType: IvfTransferType;
  /** ISO YYYY-MM-DD — transfer date or retrieval/fertilization date by mode. */
  eventDate: string;
}

export type IvfDueDateFieldErrors = {
  form?: string;
  eventDate?: string;
};

export interface IvfDueDateResult {
  dueDateIso: string;
  formattedDueDate: string;
  eventDateIso: string;
  daysAdded: number;
  eventLabel: string;
  transferType: IvfTransferType;
  pregnancyStatus: PregnancyStatus;
  plurality: Plurality;
  pluralityNote: string;
  planningNote: string | null;
  formulaNote: string;
  disclaimer: string;
}

/** Screenshot defaults: pregnant, one baby, Day-3 transfer, blank dates. */
export function createDefaultInput(): IvfDueDateInput {
  return {
    pregnancyStatus: 'pregnant',
    plurality: 'one',
    transferType: 'day3_transfer',
    eventDate: '',
  };
}

export function createEmptyInput(): IvfDueDateInput {
  return createDefaultInput();
}

/** Fixture: Day-3 transfer 2026-01-01 → EDD 2026-09-21 (+263). */
export function createExampleInput(): IvfDueDateInput {
  return {
    pregnancyStatus: 'pregnant',
    plurality: 'one',
    transferType: 'day3_transfer',
    eventDate: '2026-01-01',
  };
}

export function inputsEqual(a: IvfDueDateInput, b: IvfDueDateInput): boolean {
  return (
    a.pregnancyStatus === b.pregnancyStatus &&
    a.plurality === b.plurality &&
    a.transferType === b.transferType &&
    a.eventDate === b.eventDate
  );
}
