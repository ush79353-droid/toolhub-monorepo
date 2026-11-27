'use client';

import type {
  AlcoholUnitFieldErrors,
  AlcoholUnitInput,
  AlcoholUnitResult,
  BeerSizeId,
  CountryId,
} from './types';
import {
  BEER_SIZE_OPTIONS,
  COCKTAIL_SERVINGS,
  COUNTRY_OPTIONS,
  PRESET_ABV,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface Props {
  input: AlcoholUnitInput;
  errors: AlcoholUnitFieldErrors;
  result: AlcoholUnitResult | null;
  onChange: (input: AlcoholUnitInput) => void;
  onLoadExample: () => void;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function AlcoholUnitForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<AlcoholUnitInput>) =>
    onChange({ ...input, ...patch });

  const sizeOptions = BEER_SIZE_OPTIONS.filter(
    (s) => input.showMoreSizes || !s.moreOnly,
  );

  const countField = (
    id: string,
    label: string,
    value: number | null,
    onPick: (v: number | null) => void,
    error?: string,
    hint?: string,
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <p className="mb-1 text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
      <input
        id={id}
        className={`${inputClass} ${error ? 'border-rose-400' : ''}`}
        inputMode="decimal"
        value={value ?? ''}
        onChange={(e) => onPick(parseNum(e.target.value))}
        aria-invalid={Boolean(error)}
      />
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  );

  const beerRow = (
    countId: string,
    sizeId: string,
    label: string,
    abv: number,
    count: number | null,
    size: BeerSizeId,
    onCount: (v: number | null) => void,
    onSize: (v: BeerSizeId) => void,
    error?: string,
  ) => (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_8.5rem]">
      {countField(
        countId,
        label,
        count,
        onCount,
        error,
        `Documented ${abv}% ABV`,
      )}
      <div>
        <label className={labelClass} htmlFor={sizeId}>
          Size
        </label>
        <select
          id={sizeId}
          className={selectClass}
          value={size}
          onChange={(e) => onSize(e.target.value as BeerSizeId)}
        >
          {sizeOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational alcohol-unit worksheet. UK units use volume (ml) × ABV% ÷
        1000. Country selection converts via grams of ethanol per standard
        drink. Entries stay in your browser only — not BAC or driving advice.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (500 ml · 5% beer → 2.5 UK units)
        </button>
      </p>

      <fieldset className="space-y-3 rounded-xl border border-border p-3 sm:p-4">
        <legend className="px-1 text-sm font-semibold text-accent">
          Popular beverages
        </legend>
        {beerRow(
          'au-low',
          'au-low-size',
          'Low alcohol beer/cider',
          PRESET_ABV.lowBeer,
          input.lowBeerCount,
          input.lowBeerSize,
          (v) => set({ lowBeerCount: v }),
          (v) => set({ lowBeerSize: v }),
          errors.lowBeerCount,
        )}
        {beerRow(
          'au-std',
          'au-std-size',
          'Standard beer/cider',
          PRESET_ABV.standardBeer,
          input.standardBeerCount,
          input.standardBeerSize,
          (v) => set({ standardBeerCount: v }),
          (v) => set({ standardBeerSize: v }),
          errors.standardBeerCount,
        )}
        {beerRow(
          'au-strong',
          'au-strong-size',
          'Strong beer/cider',
          PRESET_ABV.strongBeer,
          input.strongBeerCount,
          input.strongBeerSize,
          (v) => set({ strongBeerCount: v }),
          (v) => set({ strongBeerSize: v }),
          errors.strongBeerCount,
        )}
        {countField(
          'au-wine',
          'Standard glass of wine (175 ml)',
          input.wineStandardCount,
          (v) => set({ wineStandardCount: v }),
          errors.wineStandardCount,
          `${PRESET_ABV.wine}% ABV`,
        )}
        {countField(
          'au-champ',
          'Glass of champagne (150 ml)',
          input.champagneCount,
          (v) => set({ champagneCount: v }),
          errors.champagneCount,
          `${PRESET_ABV.champagne}% ABV`,
        )}
        {countField(
          'au-alco',
          'Alcopop (275 ml)',
          input.alcopopCount,
          (v) => set({ alcopopCount: v }),
          errors.alcopopCount,
          `${PRESET_ABV.alcopop}% ABV`,
        )}
        {countField(
          'au-spirit',
          'Shot of spirit (single, 25 ml)',
          input.spiritCount,
          (v) => set({ spiritCount: v }),
          errors.spiritCount,
          `${PRESET_ABV.spirit}% ABV`,
        )}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={input.showMoreSizes}
            onChange={(e) => set({ showMoreSizes: e.target.checked })}
          />
          <span>Display more drink size options?</span>
        </label>
        {input.showMoreSizes ? (
          <div className="space-y-3 border-t border-border pt-3">
            {countField(
              'au-wine-s',
              'Small glass of wine (125 ml)',
              input.wineSmallCount,
              (v) => set({ wineSmallCount: v }),
              errors.wineSmallCount,
              `${PRESET_ABV.wine}% ABV`,
            )}
            {countField(
              'au-wine-l',
              'Large glass of wine (250 ml)',
              input.wineLargeCount,
              (v) => set({ wineLargeCount: v }),
              errors.wineLargeCount,
              `${PRESET_ABV.wine}% ABV`,
            )}
          </div>
        ) : null}
      </fieldset>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-xl bg-sky-50/80 px-3 py-3 text-left text-sm font-semibold text-primary"
          aria-expanded={input.customOpen}
          onClick={() => set({ customOpen: !input.customOpen })}
        >
          <span>Adding a custom drink</span>
          <span aria-hidden>{input.customOpen ? '−' : '+'}</span>
        </button>
        {input.customOpen ? (
          <div className="space-y-3 border-t border-border p-3 sm:p-4">
            {countField(
              'au-cvol',
              'Volume (ml)',
              input.customVolumeMl,
              (v) => set({ customVolumeMl: v }),
              errors.customVolumeMl,
            )}
            {countField(
              'au-cabv',
              'ABV (%)',
              input.customAbvPercent,
              (v) => set({ customAbvPercent: v }),
              errors.customAbvPercent,
            )}
            {countField(
              'au-ccnt',
              'How many?',
              input.customCount,
              (v) => set({ customCount: v }),
              errors.customCount,
            )}
          </div>
        ) : null}
      </div>

      <fieldset className="space-y-3 rounded-xl border border-border p-3 sm:p-4">
        <legend className="px-1 text-sm font-semibold text-accent">
          Know your drinks! I&apos;ve also had…
        </legend>
        {COCKTAIL_SERVINGS.map((c) =>
          countField(
            `au-${c.id}`,
            c.label,
            input[c.id],
            (v) => set({ [c.id]: v } as Partial<AlcoholUnitInput>),
            errors[c.id],
            c.note,
          ),
        )}
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="au-country">
          Your country
        </label>
        <select
          id="au-country"
          className={selectClass}
          value={input.country}
          onChange={(e) => set({ country: e.target.value as CountryId })}
        >
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className={labelClass}>
          {result?.unitLabel === 'standard drinks'
            ? 'Standard drinks'
            : 'Alcohol units'}
        </div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result ? result.formattedDisplay : '0'}
          </div>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-destructive">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
