'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Gauge, RotateCcw, Settings2 } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_DRIVETRAIN_EFFICIENCIES,
  DEFAULT_SHIFT_DELAYS,
  DEFAULT_ZERO_TO_SIXTY_INPUT,
  type Drivetrain,
  type LaunchQuality,
  type PowerUnit,
  type RoadSurface,
  type TireCategory,
  type Transmission,
  type WeightUnit,
  type ZeroToSixtyFieldErrors,
  type ZeroToSixtyInput,
} from './types';
import { convertPower, convertWeight } from './units';

export interface ZeroToSixtyDraft {
  enginePower: string;
  powerUnit: PowerUnit;
  vehicleWeight: string;
  weightUnit: WeightUnit;
  drivetrain: Drivetrain;
  transmission: Transmission;
  tireCategory: TireCategory;
  roadSurface: RoadSurface;
  roadGradientPercent: string;
  launchQuality: LaunchQuality;
  drivetrainEfficiencyPercent: string;
  shiftDelaySeconds: string;
  driverCargoWeight: string;
  dragCoefficient: string;
  frontalAreaSqM: string;
  rollingResistanceCoeff: string;
}

export function inputToDraft(input: ZeroToSixtyInput): ZeroToSixtyDraft {
  return {
    enginePower: String(input.enginePower),
    powerUnit: input.powerUnit,
    vehicleWeight: String(input.vehicleWeight),
    weightUnit: input.weightUnit,
    drivetrain: input.drivetrain,
    transmission: input.transmission,
    tireCategory: input.tireCategory,
    roadSurface: input.roadSurface,
    roadGradientPercent: String(input.roadGradientPercent),
    launchQuality: input.launchQuality,
    drivetrainEfficiencyPercent: String(input.drivetrainEfficiencyPercent),
    shiftDelaySeconds: String(input.shiftDelaySeconds),
    driverCargoWeight: String(input.driverCargoWeight),
    dragCoefficient: String(input.dragCoefficient),
    frontalAreaSqM: String(input.frontalAreaSqM),
    rollingResistanceCoeff: String(input.rollingResistanceCoeff),
  };
}

function parseNumber(raw: string): number {
  const cleaned = raw.trim();
  if (cleaned === '') return NaN;
  return Number(cleaned);
}

export function draftToInput(draft: ZeroToSixtyDraft): ZeroToSixtyInput {
  return {
    enginePower: parseNumber(draft.enginePower),
    powerUnit: draft.powerUnit,
    vehicleWeight: parseNumber(draft.vehicleWeight),
    weightUnit: draft.weightUnit,
    drivetrain: draft.drivetrain,
    transmission: draft.transmission,
    tireCategory: draft.tireCategory,
    roadSurface: draft.roadSurface,
    roadGradientPercent: parseNumber(draft.roadGradientPercent),
    launchQuality: draft.launchQuality,
    drivetrainEfficiencyPercent: parseNumber(draft.drivetrainEfficiencyPercent),
    shiftDelaySeconds: parseNumber(draft.shiftDelaySeconds),
    driverCargoWeight: parseNumber(draft.driverCargoWeight),
    dragCoefficient: parseNumber(draft.dragCoefficient),
    frontalAreaSqM: parseNumber(draft.frontalAreaSqM),
    rollingResistanceCoeff: parseNumber(draft.rollingResistanceCoeff),
  };
}

interface ZeroToSixtyFormProps {
  draft: ZeroToSixtyDraft;
  errors: ZeroToSixtyFieldErrors;
  onChange: (patch: Partial<ZeroToSixtyDraft>) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function ZeroToSixtyForm({
  draft,
  errors,
  onChange,
  onSubmit,
  onReset,
}: ZeroToSixtyFormProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Handle switching power unit preserving physical quantity
  const handlePowerUnitToggle = (newUnit: PowerUnit) => {
    if (newUnit === draft.powerUnit) return;
    const currentVal = parseNumber(draft.enginePower);
    if (Number.isFinite(currentVal) && currentVal > 0) {
      const converted = convertPower(currentVal, draft.powerUnit, newUnit);
      onChange({
        powerUnit: newUnit,
        enginePower: String(Math.round(converted * 10) / 10),
      });
    } else {
      onChange({ powerUnit: newUnit });
    }
  };

  // Handle switching weight unit preserving physical quantity
  const handleWeightUnitToggle = (newUnit: WeightUnit) => {
    if (newUnit === draft.weightUnit) return;
    const currentVal = parseNumber(draft.vehicleWeight);
    const currentCargo = parseNumber(draft.driverCargoWeight);
    const patch: Partial<ZeroToSixtyDraft> = { weightUnit: newUnit };

    if (Number.isFinite(currentVal) && currentVal > 0) {
      const converted = convertWeight(currentVal, draft.weightUnit, newUnit);
      patch.vehicleWeight = String(Math.round(converted));
    }
    if (Number.isFinite(currentCargo) && currentCargo > 0) {
      const convertedCargo = convertWeight(currentCargo, draft.weightUnit, newUnit);
      patch.driverCargoWeight = String(Math.round(convertedCargo));
    }
    onChange(patch);
  };

  // When changing drivetrain, optionally update efficiency to recommended default
  const handleDrivetrainChange = (drivetrain: Drivetrain) => {
    const patch: Partial<ZeroToSixtyDraft> = { drivetrain };
    const prevDefault = DEFAULT_DRIVETRAIN_EFFICIENCIES[draft.drivetrain];
    const currentEff = parseNumber(draft.drivetrainEfficiencyPercent);
    if (!Number.isFinite(currentEff) || currentEff === prevDefault) {
      patch.drivetrainEfficiencyPercent = String(DEFAULT_DRIVETRAIN_EFFICIENCIES[drivetrain]);
    }
    onChange(patch);
  };

  // When changing transmission, optionally update shift delay to recommended default
  const handleTransmissionChange = (transmission: Transmission) => {
    const patch: Partial<ZeroToSixtyDraft> = { transmission };
    const prevDefault = DEFAULT_SHIFT_DELAYS[draft.transmission];
    const currentDelay = parseNumber(draft.shiftDelaySeconds);
    if (!Number.isFinite(currentDelay) || Math.abs(currentDelay - prevDefault) < 0.001) {
      patch.shiftDelaySeconds = String(DEFAULT_SHIFT_DELAYS[transmission]);
    }
    onChange(patch);
  };

  const handleResetAdvanced = () => {
    onChange({
      drivetrainEfficiencyPercent: String(DEFAULT_DRIVETRAIN_EFFICIENCIES[draft.drivetrain]),
      shiftDelaySeconds: String(DEFAULT_SHIFT_DELAYS[draft.transmission]),
      driverCargoWeight: '0',
      dragCoefficient: String(DEFAULT_ZERO_TO_SIXTY_INPUT.dragCoefficient),
      frontalAreaSqM: String(DEFAULT_ZERO_TO_SIXTY_INPUT.frontalAreaSqM),
      rollingResistanceCoeff: String(DEFAULT_ZERO_TO_SIXTY_INPUT.rollingResistanceCoeff),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      {/* SECTION A: Engine and Vehicle */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent border-b border-border pb-1.5">
          Engine & Vehicle Specifications
        </h3>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Engine Power */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="engine-power" className="text-[13px] font-medium text-accent">
                Engine Power <InfoTooltip label="Engine Power" text="Peak engine output at the flywheel or motor output shaft." />
              </label>
              <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => handlePowerUnitToggle('hp')}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    draft.powerUnit === 'hp'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-accent'
                  }`}
                >
                  hp
                </button>
                <button
                  type="button"
                  onClick={() => handlePowerUnitToggle('kW')}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    draft.powerUnit === 'kW'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-accent'
                  }`}
                >
                  kW
                </button>
              </div>
            </div>
            <Input
              id="engine-power"
              type="number"
              step="any"
              min="1"
              max="5000"
              value={draft.enginePower}
              onChange={(e) => onChange({ enginePower: e.target.value })}
              className="h-11 rounded-lg border-border bg-white text-sm"
              placeholder="e.g. 300"
            />
            {errors.enginePower && (
              <p className="text-xs font-medium text-destructive">{errors.enginePower}</p>
            )}
          </div>

          {/* Vehicle Weight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="vehicle-weight" className="text-[13px] font-medium text-accent">
                Vehicle Weight <InfoTooltip label="Vehicle Weight" text="Mass used by the model. Include driver and fuel here, or add them under Advanced. Extra cargo defaults to 0 and is added on top." />
              </label>
              <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleWeightUnitToggle('lb')}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    draft.weightUnit === 'lb'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-accent'
                  }`}
                >
                  lb
                </button>
                <button
                  type="button"
                  onClick={() => handleWeightUnitToggle('kg')}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    draft.weightUnit === 'kg'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-accent'
                  }`}
                >
                  kg
                </button>
              </div>
            </div>
            <Input
              id="vehicle-weight"
              type="number"
              step="any"
              min="1"
              max="100000"
              value={draft.vehicleWeight}
              onChange={(e) => onChange({ vehicleWeight: e.target.value })}
              className="h-11 rounded-lg border-border bg-white text-sm"
              placeholder="e.g. 3500"
            />
            {errors.vehicleWeight && (
              <p className="text-xs font-medium text-destructive">{errors.vehicleWeight}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Drivetrain */}
          <div className="space-y-1.5">
            <label htmlFor="drivetrain" className="text-[13px] font-medium text-accent">
              Drivetrain <InfoTooltip label="Drivetrain" text="Driven wheels determine available normal traction force and dynamic weight transfer." />
            </label>
            <Select
              id="drivetrain"
              value={draft.drivetrain}
              onChange={(e) => handleDrivetrainChange(e.target.value as Drivetrain)}
              className="h-11 rounded-lg border-border bg-white text-sm"
            >
              <option value="rwd">Rear-Wheel Drive (RWD)</option>
              <option value="awd">All-Wheel Drive (AWD)</option>
              <option value="fwd">Front-Wheel Drive (FWD)</option>
            </Select>
            {errors.drivetrain && (
              <p className="text-xs font-medium text-destructive">{errors.drivetrain}</p>
            )}
          </div>

          {/* Transmission */}
          <div className="space-y-1.5">
            <label htmlFor="transmission" className="text-[13px] font-medium text-accent">
              Transmission <InfoTooltip label="Transmission" text="Determines gear shifting interruptions and launch coupling characteristics." />
            </label>
            <Select
              id="transmission"
              value={draft.transmission}
              onChange={(e) => handleTransmissionChange(e.target.value as Transmission)}
              className="h-11 rounded-lg border-border bg-white text-sm"
            >
              <option value="automatic">Automatic (Torque Converter)</option>
              <option value="dct">Dual-Clutch Transmission (DCT)</option>
              <option value="manual">Manual (Clutch Shift)</option>
              <option value="cvt">Continuously Variable (CVT)</option>
            </Select>
            {errors.transmission && (
              <p className="text-xs font-medium text-destructive">{errors.transmission}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION B: Performance Conditions */}
      <div className="space-y-3.5 pt-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent border-b border-border pb-1.5">
          Road & Traction Conditions
        </h3>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Tire Category */}
          <div className="space-y-1.5">
            <label htmlFor="tire-category" className="text-[13px] font-medium text-accent">
              Tires / Grip <InfoTooltip label="Tire Category" text="Compound grip coefficient (&mu;) available between rubber and surface." />
            </label>
            <Select
              id="tire-category"
              value={draft.tireCategory}
              onChange={(e) => onChange({ tireCategory: e.target.value as TireCategory })}
              className="h-11 rounded-lg border-border bg-white text-sm"
            >
              <option value="standard">Standard Street Tires</option>
              <option value="performance">Performance Street Tires (Summer)</option>
              <option value="track">Track-Oriented Tires (Semi-Slick)</option>
            </Select>
            {errors.tireCategory && (
              <p className="text-xs font-medium text-destructive">{errors.tireCategory}</p>
            )}
          </div>

          {/* Road Surface */}
          <div className="space-y-1.5">
            <label htmlFor="road-surface" className="text-[13px] font-medium text-accent">
              Surface Condition <InfoTooltip label="Road Surface" text="Dry asphalt provides maximum grip; wet asphalt significantly lowers friction." />
            </label>
            <Select
              id="road-surface"
              value={draft.roadSurface}
              onChange={(e) => onChange({ roadSurface: e.target.value as RoadSurface })}
              className="h-11 rounded-lg border-border bg-white text-sm"
            >
              <option value="dry">Dry Pavement</option>
              <option value="wet">Wet Pavement</option>
            </Select>
            {errors.roadSurface && (
              <p className="text-xs font-medium text-destructive">{errors.roadSurface}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Road Gradient */}
          <div className="space-y-1.5">
            <label htmlFor="road-gradient" className="text-[13px] font-medium text-accent">
              Road Gradient (%) <InfoTooltip label="Road Gradient" text="Incline percentage: 0% is flat, +% is uphill, -% is downhill." />
            </label>
            <Input
              id="road-gradient"
              type="number"
              step="any"
              min="-30"
              max="30"
              value={draft.roadGradientPercent}
              onChange={(e) => onChange({ roadGradientPercent: e.target.value })}
              className="h-11 rounded-lg border-border bg-white text-sm"
              placeholder="0"
            />
            {errors.roadGradientPercent ? (
              <p className="text-xs font-medium text-destructive">{errors.roadGradientPercent}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                0% = Flat, + = Uphill, - = Downhill
              </p>
            )}
          </div>

          {/* Launch Quality */}
          <div className="space-y-1.5">
            <label htmlFor="launch-quality" className="text-[13px] font-medium text-accent">
              Launch Quality <InfoTooltip label="Launch Quality" text="Driver launch technique: Normal (daily spirited start), Aggressive (ideal launch control / slip)." />
            </label>
            <Select
              id="launch-quality"
              value={draft.launchQuality}
              onChange={(e) => onChange({ launchQuality: e.target.value as LaunchQuality })}
              className="h-11 rounded-lg border-border bg-white text-sm"
            >
              <option value="conservative">Conservative (Gentle Start)</option>
              <option value="normal">Normal (Optimal Street Launch)</option>
              <option value="aggressive">Aggressive (Launch Control / Peak Slip)</option>
            </Select>
            {errors.launchQuality && (
              <p className="text-xs font-medium text-destructive">{errors.launchQuality}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION C: Collapsible Advanced Settings */}
      <div className="rounded-xl border border-border bg-muted/20">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex w-full items-center justify-between p-3.5 text-left text-xs font-medium text-accent hover:bg-muted/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            <span>Advanced Engineering Parameters</span>
          </span>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showAdvanced && (
          <div className="space-y-4 border-t border-border p-4 bg-white/70">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {/* Drivetrain Efficiency */}
              <div className="space-y-1.5">
                <label
                  htmlFor="drivetrain-efficiency"
                  className="text-[12px] font-medium text-accent"
                >
                  Drivetrain Efficiency (%) <InfoTooltip label="Efficiency" text="Power remaining after mechanical losses through gears, bearings, and differentials." />
                </label>
                <Input
                  id="drivetrain-efficiency"
                  type="number"
                  step="any"
                  min="50"
                  max="100"
                  value={draft.drivetrainEfficiencyPercent}
                  onChange={(e) => onChange({ drivetrainEfficiencyPercent: e.target.value })}
                  className="h-10 rounded-lg border-border bg-white text-sm"
                />
                {errors.drivetrainEfficiencyPercent && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.drivetrainEfficiencyPercent}
                  </p>
                )}
              </div>

              {/* Shift Delay */}
              <div className="space-y-1.5">
                <label htmlFor="shift-delay" className="text-[12px] font-medium text-accent">
                  Shift Delay (seconds) <InfoTooltip label="Shift Delay" text="Duration of engine power interruption during 1st-to-2nd gear change." />
                </label>
                <Input
                  id="shift-delay"
                  type="number"
                  step="0.01"
                  min="0"
                  max="2.0"
                  value={draft.shiftDelaySeconds}
                  onChange={(e) => onChange({ shiftDelaySeconds: e.target.value })}
                  className="h-10 rounded-lg border-border bg-white text-sm"
                />
                {errors.shiftDelaySeconds && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.shiftDelaySeconds}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {/* Extra Driver/Cargo Weight */}
              <div className="space-y-1.5">
                <label htmlFor="extra-weight" className="text-[12px] font-medium text-accent">
                  Extra Driver / Cargo ({draft.weightUnit})
                </label>
                <Input
                  id="extra-weight"
                  type="number"
                  step="any"
                  min="0"
                  value={draft.driverCargoWeight}
                  onChange={(e) => onChange({ driverCargoWeight: e.target.value })}
                  className="h-10 rounded-lg border-border bg-white text-sm"
                  placeholder="0"
                />
              </div>

              {/* Aerodynamic Drag Cd */}
              <div className="space-y-1.5">
                <label htmlFor="drag-cd" className="text-[12px] font-medium text-accent">
                  Drag Coefficient (Cd)
                </label>
                <Input
                  id="drag-cd"
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="1.5"
                  value={draft.dragCoefficient}
                  onChange={(e) => onChange({ dragCoefficient: e.target.value })}
                  className="h-10 rounded-lg border-border bg-white text-sm"
                />
                {errors.dragCoefficient && (
                  <p className="text-xs font-medium text-destructive">{errors.dragCoefficient}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {/* Frontal Area */}
              <div className="space-y-1.5">
                <label htmlFor="frontal-area" className="text-[12px] font-medium text-accent">
                  Frontal Area (m²)
                </label>
                <Input
                  id="frontal-area"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10.0"
                  value={draft.frontalAreaSqM}
                  onChange={(e) => onChange({ frontalAreaSqM: e.target.value })}
                  className="h-10 rounded-lg border-border bg-white text-sm"
                />
                {errors.frontalAreaSqM && (
                  <p className="text-xs font-medium text-destructive">{errors.frontalAreaSqM}</p>
                )}
              </div>

              {/* Rolling Resistance Crr */}
              <div className="space-y-1.5">
                <label htmlFor="crr" className="text-[12px] font-medium text-accent">
                  Rolling Resistance (Crr)
                </label>
                <Input
                  id="crr"
                  type="number"
                  step="0.001"
                  min="0.001"
                  max="0.1"
                  value={draft.rollingResistanceCoeff}
                  onChange={(e) => onChange({ rollingResistanceCoeff: e.target.value })}
                  className="h-10 rounded-lg border-border bg-white text-sm"
                />
                {errors.rollingResistanceCoeff && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.rollingResistanceCoeff}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetAdvanced}
                className="text-xs text-muted-foreground hover:text-accent"
              >
                Reset Advanced Defaults
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          size="lg"
          className="h-11 flex-1 gap-2 rounded-xl bg-primary font-medium text-white shadow-xs hover:bg-[hsl(var(--primary-hover))]"
        >
          <Gauge className="h-4 w-4" />
          <span>Calculate 0–60</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onReset}
          className="h-11 gap-1.5 rounded-xl border-border px-4 text-sm font-medium text-accent hover:bg-muted/50"
        >
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          <span>Reset</span>
        </Button>
      </div>
    </form>
  );
}

