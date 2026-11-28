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
  'margin-and-sales-tax-calculator',
  'sales-tax-calculator',
  'gst-calculator',
  'gross-to-net-calculator',
  'net-to-gross-calculator',
  'margin-interest-calculator',
  'margin-with-discount-calculator',
  '12-hour-shift-pay-calculator',
  '3x-rent-calculator',
  '401k-calculator',
  '403b-calculator',
  '529-calculator',
  '702010-rule-money-calculator',
  'adr-calculator',
  'annual-salary-calculator',
  'annual-income-calculator',
  'annual-pay-calculator',
  'annual-salary-per-hour-calculator',
  'annual-to-monthly-salary-calculator',
  'annualized-return-calculator',
  'appreciation-calculator',
  'apy-calculator',
  'arm-mortgage-calculator',
  'balloon-payment-calculator',
  'basis-point-calculator',
  'bitcoin-etf-calculator',
  'birth-control-calculator',
  'biweekly-mortgage-calculator',
  'biweekly-pay-calculator',
  'black-scholes-calculator',
  'put-call-parity-calculator',
  'semi-monthly-pay-calculator',
  'bi-weekly-mortgage-payment-calculator',
  'mortgage-points-calculator',
  'mortgage-refinance-calculator',
  'bag-calculator',
  'belt-size-calculator',
  'bikini-calculator',
  'bra-size-calculator',
  'circle-skirt-calculator',
  'cross-stitch-calculator',
  'curtain-panel-calculator',
  'curtain-size-calculator',
  'dress-size-calculator',
  'fabric-calculator',
  'glove-size-calculator',
  'half-square-triangle-calculator',
  'hat-size-calculator',
  'boat-loan-calculator',
  'boat-speed-calculator',
  'boost-horsepower-calculator',
  'horsepower-calculator',
  'bsfc-calculator',
  'bond-convexity-calculator',
  'bond-current-yield-calculator',
  'bond-equivalent-yield-calculator',
  'bond-price-calculator',
  'bond-yield-calculator',
  'bond-ytm-calculator',
  'jumbo-loan-calculator',
  'land-loan-calculator',
  'lease-calculator',
  'lottery-tax-calculator',
  'rv-loan-calculator',

  'student-loan-calculator',
  'student-loan-payment-calculator',
  'simple-mortgage-calculator',
  'ltv-calculator-loan-to-value',
  'cagr-calculator',
  'capital-gains-yield-calculator',
  'car-depreciation-calculator',
  'car-lease-calculator',
  'car-loan-emi-calculator',
  'carpooling-calculator',
  'car-refinance-calculator',
  'cash-flow-to-debt-ratio-calculator',
  'cash-ratio-calculator',
  'price-to-cash-flow-ratio-calculator',
  'price-to-sales-ratio-calculator',
  'commercial-lease-calculator',
  'commute-calculator',
  'compound-growth-calculator',
  'compound-interest-calculator',
  'compound-interest-rate-calculator',
  'compression-ratio-calculator',
  'compression-ratio-to-psi-calculator',
  'continuous-compound-interest-calculator',
  'coupon-payment-calculator',
  'credit-card-calculator',
  'credit-card-interest-calculator',
  'credit-card-minimum-payment-calculator',
  'credit-card-payment-calculator',
  'credit-card-payoff-calculator',
  'crosswind-calculator',
  'deferred-payment-loan-calculator',
  'depreciation-calculator',
  'discounted-cash-flow-calculator-dcf',
  'discount-calculator',
  'discount-rate-calculator',
  'double-discount-calculator',
  'drive-time-calculator',
  'engine-hours-to-miles-converter',
  'flight-radiation-calculator',
  'fuel-cost-calculator',
  'fuel-injector-calculator',
  'fuel-pump-calculator',
  'gas-calculator',
  'gas-oil-ratio-calculator',
  'gvwr-calculator',
  'idling-fuel-consumption-calculator',
  'miles-per-year-calculator',
  'miles-to-dollars-calculator',
  'miles-to-hours-converter',
  'mpg-calculator',
  'nautical-mile-calculator',
  'pulse-per-mile-calculator',
  'rpm-calculator',
  'speed-calculator',
  'speedometer-gear-calculator',
  'tesla-charging-cost-calculator',
  'ticket-optimizer',
  'tire-size-calculator',
  'traffic-density-calculator',
  'triple-discount-calculator',
  'turbo-size-calculator',
  'wheel-horsepower-calculator',
  'wheel-offset-calculator',
  'winch-size-calculator',
  'windsock-calculator',
  'dividend-discount-model-calculator',
  'dividend-payout-ratio-calculator',
  'dividend-yield-calculator',
  'early-loan-payoff-calculator',
  'loan-repayment-calculator-loan-payoff-calculator',
  'effective-annual-yield-calculator',
  'expected-utility-calculator',
  'expense-ratio-calculator',
  'fcff-calculator-free-cash-flow-to-firm',
  'fd-calculator',
  'free-cash-flow-calculator',
  'futures-contracts-calculator',
  'levered-free-cash-flow-calculator',
  'unlevered-free-cash-flow-calculator',
  'operating-cash-flow-calculator',
  'fha-loan-calculator',
  'future-salary-calculator',
  'gratuity-calculator',
  'future-value-calculator',
  'hedge-ratio-calculator',
  'holding-period-return-calculator',
  'hourly-to-annual-salary-calculator',
  'hourly-to-salary-wage-calculator',
  'hourly-to-salary-with-overtime-calculator',
  'hourly-wage-calculator',
  'hours-pay-calculator',
  'ira-calculator',
  'selling-leave-days-calculator',
  'wage-to-salary-calculator',
  'yearly-wage-calculator',
  'billable-hours-calculator',
  'bill-rate-calculator',
  'home-improvement-loan-calculator',


  'home-loan-emi-calculator',
  'home-loan-calculator',
  'mortgage-calculator-with-taxes-and-insurance',
  'mortgage-comparison-calculator',
  'home-mortgage-calculator',
  'mortgage-acceleration-calculator',
  'mortgage-prepayment-calculator',
  'mortgage-with-extra-payments-calculator',
  'impermanent-loss-calculator',
  'income-tax-calculator',
  'adjusted-gross-income-agi-calculator',
  'modified-adjusted-gross-income-magi-calculator',
  'information-ratio-calculator',
  'interest-only-mortgage-calculator',
  'interest-coverage-ratio-calculator',
  'interest-per-day-calculator',
  'mortgage-interest-calculator',
  'mortgage-rate-calculator',
  'interest-rate-calculator',
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
  'budget-calculator',
  'business-budget-calculator',
  'business-loan-calculator',
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
  'currency-calculator',
  'options-spread-calculator',
  'gmroi-calculator-gross-margin-return-on-investment',
  'google-adsense-calculator',
  'high-low-method-calculator',
  'labor-cost-calculator',
  'lemonade-stand-calculator',
  'lerner-index-calculator',
  'liquid-net-worth-calculator',
  'loan-balance-calculator',
  'loan-payment-calculator',
  'man-hours-calculator',
  'online-marketing-conversion-calculator',
  'operating-asset-turnover-calculator',
  'partially-amortized-loan-calculator',
  'payday-loan-calculator',
  'payback-period-calculator',
  'pay-raise-calculator',
  'pre-and-post-money-valuation-calculator',
  'pvgo-calculator',
  'price-quantity-calculator',
  'prorated-salary-calculator',
  'prorated-rent-calculator',
  'rent-split-calculator',
  'rent-vs-buy-calculator',
  'realtor-commission-calculator-with-vat',
  'rental-commission-calculator',
  'profitability-index-calculator',
  'revenue-growth-calculator',
  'revenue-per-employee-calculator',
  'roas-calculator',
  'saas-lifetime-value-calculator',
  'sales-commission-calculator',
  'sales-calculator',
  'true-cost-of-real-estate-commission-calculator',
  'smokers-ctc-calculator',
  'software-contract-value-calculator',
  'website-ad-revenue-calculator',
  'marginal-revenue-calculator',
  'wedding-budget-calculator',
  'youtube-money-calculator',
  'jensens-alpha-calculator',
  'mva-calculator',
  'mirr-calculator',
  'money-market-account-calculator',
  'money-per-hour-calculator',
  'rate-of-pay-calculator',
  'time-and-a-half-calculator',
  'monthly-income-calculator',
  'monthly-income-hourly-calculator',
  'moving-average-calculator',
  'mutual-fund-calculator',
  'nopat-calculator',
  'npv-calculator-net-present-value',
  'opportunity-cost-calculator',
  'percentage-discount-calculator',
  'accounting-profit-calculator',
  'profit-calculator',
  'net-profit-margin-calculator',
  'return-on-sales-calculator',
  'revenue-calculator',
  'economic-profit-calculator',
  'ev-to-sales-calculator-enterprise-value-to-sales',
  'percentage-return-calculator',
  'perpetuity-calculator',
  'present-value-calculator',
  'private-savings-calculator',
  'salary-calculator',
  'salary-inflation-calculator',
  'salary-to-hourly-calculator',
  'wage-calculator',
  'savings-calculator',
  'savings-goal-calculator',
  'savings-plan-calculator',
  'savings-withdrawal-calculator',
  'simple-savings-calculator',
  'stock-calculator',
  'stock-average-calculator',
  'stock-split-calculator',
  'rate-of-return-calculator',
  'rd-calculator-recurring-deposit',
  'rmd-calculator-required-minimum-distributions-calculator',
  'real-estate-commission-calculator',
  'return-on-capital-employed-calculator-roce',
  'roi-calculator',
  'simple-interest-calculator',
  'sinking-fund-calculator',
  'sip-calculator-systematic-investment-plan',
  'time-value-of-money-calculator',
  'treynor-ratio-calculator',
  'ttm-calculator-trailing-twelve-months',
  'value-at-risk-calculator-var',
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
