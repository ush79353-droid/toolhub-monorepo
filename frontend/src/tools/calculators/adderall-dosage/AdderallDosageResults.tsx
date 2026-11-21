import type { AdderallDosageResult } from './types';

interface Props {
  result: AdderallDosageResult | null;
}

export function AdderallDosageResults({ result }: Props) {
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/15 px-4 py-3 text-sm text-muted-foreground">
        Enter age and choose an indication to see educational IR label context or
        custom prescribed-dose tablet arithmetic.
      </div>
    );
  }

  const showTabletQty =
    result.outcome === 'custom_tablet_quantity' &&
    result.tabletQuantity != null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white px-4 py-4 text-sm leading-relaxed text-accent sm:text-[15px]">
      <p className="font-semibold">
        {result.outcome === 'custom_tablet_quantity'
          ? 'Tablet quantity for the entered prescribed dose'
          : result.outcome === 'label_reference'
            ? 'Educational IR label reference (not a prescription)'
            : result.outcome === 'awaiting_age' ||
                result.outcome === 'custom_awaiting_dose'
              ? 'Awaiting input'
              : result.outcome === 'unsupported_age'
                ? 'Age / indication outside educational IR charts'
                : 'Check inputs'}
      </p>

      {result.populationLabel ? (
        <p className="text-[13px] text-muted-foreground">
          {result.indicationLabel}
          {result.ageYears != null ? ` · age ${result.ageYears} years` : ''}
          {` · ${result.populationLabel}`}
        </p>
      ) : (
        <p className="text-[13px] text-muted-foreground">
          {result.indicationLabel}
        </p>
      )}

      {result.outcome === 'label_reference' &&
      result.educationalStartingDoseMg != null ? (
        <div className="rounded-lg border border-border bg-muted/15 px-3 py-2.5">
          <p className="text-[13px] font-medium text-muted-foreground">
            Published IR teaching start (label/chart)
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {result.educationalStartingDoseMg} mg
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              educational only
            </span>
          </p>
        </div>
      ) : null}

      {showTabletQty ? (
        <div className="rounded-lg border border-border bg-muted/15 px-3 py-2.5">
          <p className="text-[13px] font-medium text-muted-foreground">
            Tablet quantity for the entered prescribed dose
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {result.tabletQuantity}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              tablet(s)
            </span>
          </p>
          {result.tabletQuantityLabel ? (
            <p className="mt-1 text-[13px] text-muted-foreground">
              {result.tabletQuantityLabel}
            </p>
          ) : null}
        </div>
      ) : null}

      {result.fractionalTabletNote ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-[13px] text-amber-950">
          {result.fractionalTabletNote}
        </p>
      ) : null}

      {result.educationalLines.length > 0 ? (
        <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-foreground/85">
          {result.educationalLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      {result.warnings.length > 0 ? (
        <ul className="space-y-1.5 border-t border-border pt-3 text-[13px] text-foreground/85">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

      <p className="text-xs text-muted-foreground">{result.sourceNote}</p>
      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
    </div>
  );
}
