'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { PagIbigHousingLoanForm } from './PagIbigHousingLoanForm';
import {
  INSURANCE_UNAVAILABLE_REASON,
  LOANABLE_AMOUNT_UNAVAILABLE_REASON,
  TOTAL_AMORTIZATION_UNAVAILABLE_REASON,
} from './calculation';
import {
  createDefaultInput,
  getFixedPricingOption,
  type PagIbigHousingLoanFieldErrors,
  type PagIbigHousingLoanInput,
  type PagIbigHousingLoanResult,
} from './types';
import { validatePagIbigHousingLoanInput } from './validation';

export function PagIbigHousingLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validatePagIbigHousingLoanInput(defaults);
  const [input, setInput] = React.useState<PagIbigHousingLoanInput>(() => defaults);
  const [errors, setErrors] = React.useState<PagIbigHousingLoanFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<PagIbigHousingLoanResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: PagIbigHousingLoanInput) => {
    setInput(next);
    const validation = validatePagIbigHousingLoanInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validatePagIbigHousingLoanInput(fresh);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const pricing = getFixedPricingOption(input.fixedPricingOptionId);
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Estimated property value: ₱${input.estimatedPropertyValue || '; '}`,
        `Loanable amount: unavailable (${LOANABLE_AMOUNT_UNAVAILABLE_REASON})`,
        `Loan amount: ₱${input.loanAmount}`,
        `Repayment period: ${input.repaymentPeriodYears} years`,
        `Fixed pricing: ${pricing.label} (reference example rate; not verified as current official circular)`,
        `Monthly principal and interest: ₱${result.formattedMonthlyPrincipalAndInterest}`,
        `Monthly insurance premium: unavailable (${INSURANCE_UNAVAILABLE_REASON})`,
        `Total monthly amortization: unavailable (${TOTAL_AMORTIZATION_UNAVAILABLE_REASON})`,
        `Gross annual income: ₱${input.grossAnnualIncome || '; '}`,
        `Gross monthly income: ₱${input.grossMonthlyIncome || '; '}`,
        'Currency: Philippine peso (₱) only; no FX selectors in the reference.',
      ].join('\n')
    : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Philippines Pag-IBIG housing loan sketch in ₱. Loanable amount and insurance use only
 verified rules; unavailable until official formulas are sourced. Screenshot pricing
            9.750% / 30 years is an example rate for P&amp;I math, not a claimed current circular.
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <PagIbigHousingLoanForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onReset={handleReset}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
