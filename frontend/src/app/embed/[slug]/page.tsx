import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmbedResizeReporter } from '@/components/embed/EmbedResizeReporter';
import { ToolWorkspace } from '@/components/shared/ToolWorkspace';
import { siteConfig } from '@/config/site';
import {
  buildEmbedPath,
  buildToolPageUrl,
  isToolEmbedEligible,
} from '@/lib/embed/tool-embed';
import { getPublicToolBySlug } from '@/server/catalog/tools';
import { getCurrencyRates } from '@/server/currency/rates';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { isApprovedComponentKey, isRegisteredComponentKey } from '@/tools/registry/keys';
import { CurrencyRatesProvider } from '@/tools/shared/CurrencyRatesProvider';
import type { ToolMetadata } from '@/types/tool';

/** Phase 3: load FX rates only for conversion-enabled calculators. */
const CURRENCY_CONVERSION_SLUGS = new Set([
  'margin-and-markup-calculator',
  'margin-calculator-classic',
  'margin-and-vat-calculator',
  'margin-call-calculator',
  'margin-interest-calculator',
  'margin-of-safety-calculator',
  '12-hour-shift-pay-calculator',
  '3x-rent-calculator',
  '401k-calculator',
  '403b-calculator',
  '529-calculator',
  '702010-rule-money-calculator',
  'adr-calculator',
  'after-tax-cost-of-debt-calculator',
  'debt-calculator',
  'debt-snowball-calculator',
  'debt-to-asset-ratio-calculator',
  'debt-to-capital-ratio-calculator',
  'deferred-annuity-calculator',
  'growing-annuity-calculator',
  'annualized-return-calculator',
  'annuity-calculator',
  'annuity-payout-calculator',
  'appreciation-calculator',
  'apy-calculator',
  'arm-mortgage-calculator',
  'basis-point-calculator',
  'bitcoin-etf-calculator',
  'biweekly-mortgage-calculator',
  'mortgage-points-calculator',
  'boat-loan-calculator',
  'jumbo-loan-calculator',
  'land-loan-calculator',
  'rv-loan-calculator',
  'student-loan-calculator',
  'student-loan-payment-calculator',
  'simple-mortgage-calculator',
  'ltv-calculator-loan-to-value',
  'cagr-calculator',
  'capital-gains-yield-calculator',
  'car-loan-emi-calculator',
  'cd-calculator',
  'compound-growth-calculator',
  'compound-interest-calculator',
  'compound-interest-rate-calculator',
  'continuous-compound-interest-calculator',
  'discounted-cash-flow-calculator-dcf',
  'discount-rate-calculator',
  'dividend-discount-model-calculator',
  'early-loan-payoff-calculator',
  'ebitda-margin-calculator',
  'loan-repayment-calculator-loan-payoff-calculator',
  'debt-avalanche-calculator',
  'effective-annual-yield-calculator',
  'expected-utility-calculator',
  'expense-ratio-calculator',
  'fd-calculator',
  'fha-loan-calculator',
  'future-value-calculator',
  'future-value-of-annuity-calculator',
  'florida-overtime-calculator',
  'texas-overtime-calculator',
  'hedge-ratio-calculator',
  'holding-period-return-calculator',
  'immediate-annuity-calculator',
  'illinois-overtime-calculator',
  'home-improvement-loan-calculator',
  'home-loan-emi-calculator',
  'home-loan-calculator',
  'mortgage-calculator-with-taxes-and-insurance',
  'mortgage-comparison-calculator',
  'home-mortgage-calculator',
  'mortgage-acceleration-calculator',
  'mortgage-prepayment-calculator',
  'impermanent-loss-calculator',
  'information-ratio-calculator',
  'interest-only-mortgage-calculator',
  'interest-coverage-ratio-calculator',
  'interest-per-day-calculator',
  'mortgage-interest-calculator',
  'mortgage-rate-calculator',
  'interest-rate-calculator',
  'interest-rate-parity-calculator',
  'investment-calculator',
  'investment-fee-calculator',
  'irr-calculator',
  '3d-printer-buy-vs-outsource-calculator',
  'accumulated-depreciation-calculator',
  'additional-funds-needed-calculator',
  'ar-days-calculator',
  'average-collection-period-calculator',
  'average-fixed-cost-calculator',
  'break-even-calculator',
  'build-vs-buy-calculator',
  'burn-rate-calculator',
  'business-budget-calculator',
  'business-loan-calculator',
  'california-overtime-calculator',
  'georgia-overtime-calculator',
  'business-valuation-calculator',
  'consulting-fees-calculator',
  'contribution-margin-calculator',
  'cost-function-calculator',
  'cost-of-doing-business-calculator',
  'cost-of-equity-calculator',
  'cost-of-goods-sold-calculator',
  'cpa-calculator-cost-per-acquisition',
  'cpc-and-cpm-calculator',
  'cpm-calculator',
  'customer-acquisition-cost-calculator',
  'dividend-calculator',
  'direct-material-price-variance-calculator',
  'evm-calculator',
  'effective-corporate-tax-rate-calculator',
  'emv-calculator-expected-monetary-value',
  'fifo-calculator-for-inventory',
  'carried-interest-calculator',
  'gmroi-calculator-gross-margin-return-on-investment',
  'google-adsense-calculator',
  'high-low-method-calculator',
  'labor-cost-calculator',
  'lemonade-stand-calculator',
  'lerner-index-calculator',
  'liquid-net-worth-calculator',
  'loan-balance-calculator',
  'loan-interest-calculator',
  'man-hours-calculator',
  'online-marketing-conversion-calculator',
  'operating-asset-turnover-calculator',
  'partially-amortized-loan-calculator',
  'payday-loan-calculator',
  'payback-period-calculator',
  'pre-and-post-money-valuation-calculator',
  'pvgo-calculator',
  'price-quantity-calculator',
  'profitability-index-calculator',
  'revenue-per-employee-calculator',
  'roas-calculator',
  'saas-lifetime-value-calculator',
  'sales-commission-calculator',
  'smokers-ctc-calculator',
  'software-contract-value-calculator',
  'website-ad-revenue-calculator',
  'youtube-money-calculator',
  'jensens-alpha-calculator',
  'mva-calculator',
  'mirr-calculator',
  'money-market-account-calculator',
  'moving-average-calculator',
  'mutual-fund-calculator',
  'net-debt-calculator',
  'nopat-calculator',
  'npv-calculator-net-present-value',
  'opportunity-cost-calculator',
  'overtime-calculator',
  'percentage-return-calculator',
  'perpetuity-calculator',
  'present-value-calculator',
  'present-value-of-annuity-calculator',
  'rate-of-return-calculator',
  'return-on-capital-employed-calculator-roce',
  'roi-calculator',
  'simple-interest-calculator',
  'sinking-fund-calculator',
  'time-value-of-money-calculator',
  'times-interest-earned-ratio-calculator',
  'debt-service-coverage-ratio-calculator-dscr',
  'treynor-ratio-calculator',
  'ttm-calculator-trailing-twelve-months',
  'value-at-risk-calculator-var',
  'variable-annuity-calculator',
]);

export const dynamic = 'force-dynamic';

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ embedId?: string }>;
}

function toToolMetadata(tool: NonNullable<Awaited<ReturnType<typeof getPublicToolBySlug>>>): ToolMetadata {
  return {
    id: tool.id,
    slug: tool.slug,
    title: tool.name,
    description: tool.shortDescription || `${tool.name} on ${siteConfig.name}`,
    category: (tool.category?.slug as ToolMetadata['category']) || 'calculators',
    icon: 'calculator',
    version: '1.0.0',
    executionType: tool.executionType,
    componentKey: tool.componentKey,
    isActive: tool.isActive,
    tags: [],
  };
}

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getPublicToolBySlug(slug);
  const siteUrl = getPublicSiteOrigin();
  const canonical = tool ? buildToolPageUrl(siteUrl, tool.slug) : undefined;

  return {
    title: tool ? `${tool.name} Embed` : 'Calculator Embed',
    description: 'Embedded calculator view. Not for search indexing.',
    robots: { index: false, follow: false, nocache: true },
    alternates: canonical ? { canonical } : undefined,
  };
}

export default async function EmbedToolPage({ params, searchParams }: EmbedPageProps) {
  const { slug } = await params;
  const { embedId: embedIdParam } = await searchParams;
  const tool = await getPublicToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const eligible = isToolEmbedEligible({
    embedEnabled: tool.embedEnabled,
    isActive: tool.isActive,
    componentKey: tool.componentKey,
    embedDefaultHeight: tool.embedDefaultHeight ?? 650,
    embedPreferredLayout: tool.embedPreferredLayout ?? 'responsive',
    embedAllowedDomains: tool.embedAllowedDomains ?? '',
  });

  const fullPageHref = `/tools/${tool.slug}`;
  const embedId = embedIdParam?.trim() || `embed-${tool.slug}`;

  if (!eligible || !isApprovedComponentKey(tool.componentKey) || !isRegisteredComponentKey(tool.componentKey)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-lg font-semibold text-accent">Embedding unavailable</h1>
        <p className="text-sm text-muted-foreground">
          This calculator is not available for embedding.
        </p>
        {tool.isActive ? (
          <Link href={fullPageHref} className="text-sm font-medium text-primary hover:underline">
            Open full calculator →
          </Link>
        ) : null}
      </main>
    );
  }

  const metadata = toToolMetadata(tool);
  const compact = tool.embedPreferredLayout === 'compact';
  const currencyRates = CURRENCY_CONVERSION_SLUGS.has(tool.slug)
    ? await getCurrencyRates()
    : null;
  const workspace = <ToolWorkspace tool={metadata} presentation="embed" />;

  return (
    <main className={`mx-auto w-full max-w-3xl px-3 py-3 sm:px-4 sm:py-4 ${compact ? 'max-w-xl' : ''}`}>
      <EmbedResizeReporter embedId={embedId}>
        <header className="mb-3">
          <h1 className="text-lg font-semibold tracking-tight text-accent sm:text-xl">{tool.name}</h1>
          {tool.shortDescription ? (
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{tool.shortDescription}</p>
          ) : null}
        </header>

        {currencyRates ? (
          <CurrencyRatesProvider rates={currencyRates}>{workspace}</CurrencyRatesProvider>
        ) : (
          workspace
        )}

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <p>
            Powered by{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              {siteConfig.name}
            </Link>
          </p>
          <Link href={fullPageHref} className="font-medium text-primary hover:underline">
            Open full page →
          </Link>
        </footer>
        <span className="sr-only" data-embed-path={buildEmbedPath(tool.slug)} />
      </EmbedResizeReporter>
    </main>
  );
}
