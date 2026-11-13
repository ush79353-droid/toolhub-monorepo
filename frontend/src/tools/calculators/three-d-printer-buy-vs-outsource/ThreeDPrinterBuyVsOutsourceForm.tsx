'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { ThreeDPrinterFieldErrors, ThreeDPrinterInput } from './types';

export interface ThreeDPrinterDraft {
  partsPerMonth: string;
  months: string;
  materialGramsPerPart: string;
  printHoursPerPart: string;
  failureRatePercent: string;
  currency: ThreeDPrinterInput['currency'];
  printerPrice: string;
  setupCosts: string;
  materialPricePerKg: string;
  printerPowerWatts: string;
  electricityPricePerKWh: string;
  maintenancePerMonth: string;
  laborHourlyRate: string;
  laborHoursPerPrint: string;
  resaleValue: string;
  pricePerPart: string;
  finishingCostPerPart: string;
  shippingPerOrder: string;
  ordersPerMonth: string;
  oneTimeServiceFee: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

const DRAFT_KEYS = [
  'partsPerMonth',
  'months',
  'materialGramsPerPart',
  'printHoursPerPart',
  'failureRatePercent',
  'printerPrice',
  'setupCosts',
  'materialPricePerKg',
  'printerPowerWatts',
  'electricityPricePerKWh',
  'maintenancePerMonth',
  'laborHourlyRate',
  'laborHoursPerPrint',
  'resaleValue',
  'pricePerPart',
  'finishingCostPerPart',
  'shippingPerOrder',
  'ordersPerMonth',
  'oneTimeServiceFee',
] as const satisfies readonly (keyof ThreeDPrinterDraft)[];

export function inputToDraft(input: ThreeDPrinterInput): ThreeDPrinterDraft {
  return {
    partsPerMonth: String(input.partsPerMonth),
    months: String(input.months),
    materialGramsPerPart: String(input.materialGramsPerPart),
    printHoursPerPart: String(input.printHoursPerPart),
    failureRatePercent: String(input.failureRatePercent),
    currency: input.currency,
    printerPrice: String(input.printerPrice),
    setupCosts: String(input.setupCosts),
    materialPricePerKg: String(input.materialPricePerKg),
    printerPowerWatts: String(input.printerPowerWatts),
    electricityPricePerKWh: String(input.electricityPricePerKWh),
    maintenancePerMonth: String(input.maintenancePerMonth),
    laborHourlyRate: String(input.laborHourlyRate),
    laborHoursPerPrint: String(input.laborHoursPerPrint),
    resaleValue: String(input.resaleValue),
    pricePerPart: String(input.pricePerPart),
    finishingCostPerPart: String(input.finishingCostPerPart),
    shippingPerOrder: String(input.shippingPerOrder),
    ordersPerMonth: String(input.ordersPerMonth),
    oneTimeServiceFee: String(input.oneTimeServiceFee),
  };
}

function parseDraftNumber(raw: string): number {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') return Number.NaN;
  return Number(cleaned);
}

export function draftToInput(draft: ThreeDPrinterDraft): ThreeDPrinterInput {
  const numbers = Object.fromEntries(
    DRAFT_KEYS.map((key) => [key, parseDraftNumber(draft[key])])
  ) as Pick<ThreeDPrinterInput, (typeof DRAFT_KEYS)[number]>;
  return { ...numbers, currency: draft.currency };
}

interface ThreeDPrinterFormProps {
  draft: ThreeDPrinterDraft;
  errors: ThreeDPrinterFieldErrors;
  onDraftChange: (draft: ThreeDPrinterDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function ThreeDPrinterBuyVsOutsourceForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: ThreeDPrinterFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const patch = (next: Partial<ThreeDPrinterDraft>) => onDraftChange({ ...draft, ...next });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <fieldset className="space-y-3">
        <legend className="text-[13px] font-semibold text-accent">Printing requirements</legend>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <Field id="printer-parts" label="Parts per month" value={draft.partsPerMonth} error={errors.partsPerMonth} onChange={(partsPerMonth) => patch({ partsPerMonth })} />
          <Field id="printer-months" label="Months to compare" value={draft.months} error={errors.months} onChange={(months) => patch({ months })} />
          <Field id="printer-grams" label="Material per part" suffix="g" value={draft.materialGramsPerPart} error={errors.materialGramsPerPart} onChange={(materialGramsPerPart) => patch({ materialGramsPerPart })} />
          <Field id="printer-hours" label="Print time per part" suffix="h" value={draft.printHoursPerPart} error={errors.printHoursPerPart} onChange={(printHoursPerPart) => patch({ printHoursPerPart })} />
          <div className="min-[420px]:col-span-2">
            <Field
              id="printer-failure"
              label="Print failure rate"
              suffix="%"
              value={draft.failureRatePercent}
              error={errors.failureRatePercent}
              hint="Each failed attempt uses the same material, time, and labor as a finished part. Must be under 100%."
              onChange={(failureRatePercent) => patch({ failureRatePercent })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-[13px] font-semibold text-accent">Buying a printer</legend>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <Field id="printer-price" label="Printer price" prefix={symbol} value={draft.printerPrice} error={errors.printerPrice} onChange={(printerPrice) => patch({ printerPrice })} />
          <Field id="printer-setup" label="Setup and extra equipment" prefix={symbol} value={draft.setupCosts} error={errors.setupCosts} onChange={(setupCosts) => patch({ setupCosts })} />
          <Field id="printer-material-price" label="Material price" prefix={symbol} suffix="/kg" value={draft.materialPricePerKg} error={errors.materialPricePerKg} onChange={(materialPricePerKg) => patch({ materialPricePerKg })} />
          <Field id="printer-watts" label="Printer power" suffix="W" value={draft.printerPowerWatts} error={errors.printerPowerWatts} onChange={(printerPowerWatts) => patch({ printerPowerWatts })} />
          <Field id="printer-kwh" label="Electricity price" prefix={symbol} suffix="/kWh" value={draft.electricityPricePerKWh} error={errors.electricityPricePerKWh} onChange={(electricityPricePerKWh) => patch({ electricityPricePerKWh })} />
          <Field id="printer-maintenance" label="Maintenance per month" prefix={symbol} value={draft.maintenancePerMonth} error={errors.maintenancePerMonth} onChange={(maintenancePerMonth) => patch({ maintenancePerMonth })} />
          <Field id="printer-labor-rate" label="Labor cost per hour" prefix={symbol} value={draft.laborHourlyRate} error={errors.laborHourlyRate} hint="Optional. Leave at 0 to ignore your time." onChange={(laborHourlyRate) => patch({ laborHourlyRate })} />
          <Field id="printer-labor-hours" label="Labor time per print" suffix="h" value={draft.laborHoursPerPrint} error={errors.laborHoursPerPrint} onChange={(laborHoursPerPrint) => patch({ laborHoursPerPrint })} />
          <div className="min-[420px]:col-span-2">
            <Field
              id="printer-resale"
              label="Resale value at the end"
              prefix={symbol}
              value={draft.resaleValue}
              error={errors.resaleValue}
              hint="Credited once, at the end of the comparison. A resale above the printer plus setup cost is allowed and flagged."
              onChange={(resaleValue) => patch({ resaleValue })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-[13px] font-semibold text-accent">Outsourcing</legend>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <Field id="printer-out-price" label="Price per part" prefix={symbol} value={draft.pricePerPart} error={errors.pricePerPart} onChange={(pricePerPart) => patch({ pricePerPart })} />
          <Field id="printer-finish" label="Finishing per part" prefix={symbol} value={draft.finishingCostPerPart} error={errors.finishingCostPerPart} onChange={(finishingCostPerPart) => patch({ finishingCostPerPart })} />
          <Field id="printer-ship" label="Shipping per order" prefix={symbol} value={draft.shippingPerOrder} error={errors.shippingPerOrder} hint="Charged per order, not per part." onChange={(shippingPerOrder) => patch({ shippingPerOrder })} />
          <Field id="printer-orders" label="Orders per month" value={draft.ordersPerMonth} error={errors.ordersPerMonth} onChange={(ordersPerMonth) => patch({ ordersPerMonth })} />
          <div className="min-[420px]:col-span-2">
            <Field id="printer-fee" label="One-time setup or service fee" prefix={symbol} value={draft.oneTimeServiceFee} error={errors.oneTimeServiceFee} onChange={(oneTimeServiceFee) => patch({ oneTimeServiceFee })} />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  hint,
  prefix,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  onChange: (value: string) => void;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div
        className={`flex h-11 items-center overflow-hidden rounded-lg border bg-white ${
          error ? 'border-rose-500' : 'border-border'
        } focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1`}
      >
        {prefix ? (
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        />
        {suffix ? (
          <span className="shrink-0 pr-3 text-xs text-muted-foreground" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
