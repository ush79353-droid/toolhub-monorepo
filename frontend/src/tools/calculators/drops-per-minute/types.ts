export type VolumeUnit = 'mL' | 'L';
export type TimeUnit = 'min' | 'h';

export interface DropsPerMinuteInput {
  volumeText: string;
  volumeUnit: VolumeUnit;
  timeText: string;
  timeUnit: TimeUnit;
  dropFactorText: string;
}

export interface DropsPerMinuteResult {
  dropsPerMinute: number | null;
  dropsPerHour: number | null;
  mlPerHour: number | null;
  formattedDropsPerMinute: string;
  formattedDropsPerHour: string;
  formattedMlPerHour: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type DropsPerMinuteFieldErrors = {
  volumeText?: string;
  timeText?: string;
  dropFactorText?: string;
};

/** Screenshot defaults: blank volume/time; drop factor 15 gtts/mL; mL + min. */
export function createDefaultInput(): DropsPerMinuteInput {
  return {
    volumeText: '',
    volumeUnit: 'mL',
    timeText: '',
    timeUnit: 'min',
    dropFactorText: '15',
  };
}

export function createEmptyInput(): DropsPerMinuteInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: DropsPerMinuteInput,
  b: DropsPerMinuteInput,
): boolean {
  return (
    a.volumeText === b.volumeText &&
    a.volumeUnit === b.volumeUnit &&
    a.timeText === b.timeText &&
    a.timeUnit === b.timeUnit &&
    a.dropFactorText === b.dropFactorText
  );
}
