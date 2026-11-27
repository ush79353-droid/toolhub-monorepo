export type VolumeUnit = 'mL' | 'L';
export type TimeUnit = 'min' | 'h';
export type FlowVolumeUnit = 'mL' | 'L';
export type FlowTimeUnit = 'min' | 'h';

export interface IvFlowInput {
  dropFactorText: string;
  volumeText: string;
  volumeUnit: VolumeUnit;
  timeText: string;
  timeUnit: TimeUnit;
  flowVolumeUnit: FlowVolumeUnit;
  flowTimeUnit: FlowTimeUnit;
}

export interface IvFlowResult {
  volumeMl: number | null;
  timeMin: number | null;
  dropFactor: number | null;
  dropsPerMin: number | null;
  flowMlPerMin: number | null;
  formattedDrops: string;
  formattedFlow: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type IvFlowFieldErrors = {
  dropFactorText?: string;
  volumeText?: string;
  timeText?: string;
};

/** Screenshot defaults: gtts/mL, mL, min, result gtts/min and mL/min. */
export function createDefaultInput(): IvFlowInput {
  return {
    dropFactorText: '',
    volumeText: '',
    volumeUnit: 'mL',
    timeText: '',
    timeUnit: 'min',
    flowVolumeUnit: 'mL',
    flowTimeUnit: 'min',
  };
}

export function createEmptyInput(): IvFlowInput {
  return createDefaultInput();
}

export function inputsEqual(a: IvFlowInput, b: IvFlowInput): boolean {
  return (
    a.dropFactorText === b.dropFactorText &&
    a.volumeText === b.volumeText &&
    a.volumeUnit === b.volumeUnit &&
    a.timeText === b.timeText &&
    a.timeUnit === b.timeUnit &&
    a.flowVolumeUnit === b.flowVolumeUnit &&
    a.flowTimeUnit === b.flowTimeUnit
  );
}
