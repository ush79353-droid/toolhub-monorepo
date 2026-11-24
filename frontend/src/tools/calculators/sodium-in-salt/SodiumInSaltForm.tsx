'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatAmount,
  gramsToPureAmount,
  gramsToSaltAmount,
} from './calculation';
import {
  PURE_UNIT_OPTIONS,
  SALT_TYPE_OPTIONS,
  SALT_UNIT_OPTIONS,
  SODIUM_UNIT_OPTIONS,
  type PureSaltUnit,
  type SaltAmountUnit,
  type SaltTypeId,
  type SodiumInSaltFieldErrors,
  type SodiumInSaltInput,
  type SodiumInSaltResult,
  type SodiumUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 font-mono text-xs text-primary outline-none sm:min-w-[4.25rem]';
const selectFullClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 font-mono text-[13px] text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: SodiumInSaltInput;
  errors: SodiumInSaltFieldErrors;
  result: SodiumInSaltResult | null;
  onChange: (input: SodiumInSaltInput) => void;
}

export function SodiumInSaltForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<SodiumInSaltInput>) =>
    onChange({ ...input, ...patch });

  const derivedSalt =
    input.source !== 'salt' && result?.saltGrams != null
      ? formatAmount(
          gramsToSaltAmount(result.saltGrams, input.saltUnit, input.saltType),
        )
      : '';
  const derivedSodium =
    input.source !== 'sodium' && result?.sodiumMg != null
      ? formatAmount(
          input.sodiumUnit === 'g' ? result.sodiumMg / 1000 : result.sodiumMg,
          input.sodiumUnit === 'mg' ? 2 : 4,
        )
      : '';
  const derivedPure =
    input.source !== 'pure' && result?.pureNaClGrams != null
      ? formatAmount(
          gramsToPureAmount(result.pureNaClGrams, input.pureUnit),
          input.pureUnit === 'mg' ? 2 : 4,
        )
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Sodium in salt inputs">
        <div>
          <label className={labelClass} htmlFor="sis-salt-type">
            Type of salt
          </label>
          <select
            id="sis-salt-type"
            className={selectFullClass}
            value={input.saltType}
            onChange={(e) =>
              set({ saltType: e.target.value as SaltTypeId })
            }
            aria-invalid={Boolean(errors.saltType)}
          >
            {SALT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.saltType ? (
            <p className="mt-1 text-xs text-rose-600">{errors.saltType}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sis-salt-amount">
            Amount of salt
          </label>
          <FieldShell
            error={errors.saltAmountText}
            muted={input.source !== 'salt' && derivedSalt !== ''}
          >
            <input
              id="sis-salt-amount"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={
                input.source === 'salt' ? input.saltAmountText : derivedSalt
              }
              onChange={(e) =>
                set({
                  source: 'salt',
                  saltAmountText: e.target.value,
                  sodiumAmountText: '',
                  pureSaltText: '',
                })
              }
              aria-invalid={Boolean(errors.saltAmountText)}
            />
            <select
              className={unitSelectClass}
              value={input.saltUnit}
              aria-label="Salt amount unit"
              onChange={(e) =>
                set({ saltUnit: e.target.value as SaltAmountUnit })
              }
            >
              {SALT_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.saltAmountText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.saltAmountText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sis-sodium">
            Amount of sodium
          </label>
          <FieldShell
            error={errors.sodiumAmountText}
            muted={input.source !== 'sodium' && derivedSodium !== ''}
          >
            <input
              id="sis-sodium"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={
                input.source === 'sodium'
                  ? input.sodiumAmountText
                  : derivedSodium
              }
              onChange={(e) =>
                set({
                  source: 'sodium',
                  sodiumAmountText: e.target.value,
                  saltAmountText: '',
                  pureSaltText: '',
                })
              }
              aria-invalid={Boolean(errors.sodiumAmountText)}
            />
            <select
              className={unitSelectClass}
              value={input.sodiumUnit}
              aria-label="Sodium unit"
              onChange={(e) =>
                set({ sodiumUnit: e.target.value as SodiumUnit })
              }
            >
              {SODIUM_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.sodiumAmountText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.sodiumAmountText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sis-pure">
            Pure salt (NaCl)
            <InfoTooltip
              label="Pure salt (NaCl)"
              text="Stoichiometric sodium chloride mass implied by the sodium amount using published atomic masses Na 22.99 and NaCl 58.44 (fraction ≈ 0.3934). Culinary salt mass can differ slightly when the product is not 100% NaCl or when spoon density differs."
            />
          </label>
          <FieldShell
            error={errors.pureSaltText}
            muted={input.source !== 'pure' && derivedPure !== ''}
          >
            <input
              id="sis-pure"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.source === 'pure' ? input.pureSaltText : derivedPure}
              onChange={(e) =>
                set({
                  source: 'pure',
                  pureSaltText: e.target.value,
                  saltAmountText: '',
                  sodiumAmountText: '',
                })
              }
              aria-invalid={Boolean(errors.pureSaltText)}
            />
            <select
              className={unitSelectClass}
              value={input.pureUnit}
              aria-label="Pure NaCl unit"
              onChange={(e) =>
                set({ pureUnit: e.target.value as PureSaltUnit })
              }
            >
              {PURE_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.pureSaltText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pureSaltText}</p>
          ) : result?.statusDetail && result.sodiumMg != null ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
