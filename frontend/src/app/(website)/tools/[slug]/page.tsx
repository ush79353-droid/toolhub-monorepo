import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ToolWorkspace } from '@/components/shared/ToolWorkspace';
import { ToolDetailSidebar } from '@/components/shared/ToolDetailSidebar';
import { AdSlot } from '@/components/ads/AdSlot';
import { CalculatorEmbedDialog } from '@/components/tools/CalculatorEmbedDialog';
import { isToolEmbedEligible } from '@/lib/embed/tool-embed';

import { siteConfig } from '@/config/site';
import {
  buildToolJsonLd,
  buildToolPageMetadata,
  emptyToolSeoFields,
  serializeJsonLd,
  type ToolSeoSource,
} from '@/lib/seo/tool-seo';
import { getPublicToolBySlug, type PublicToolDetail } from '@/server/catalog/tools';
import { getCurrencyRates } from '@/server/currency/rates';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { StickyCalculatorAside } from '@/tools/calculators/auto-loan/StickyCalculatorAside';
import { TableOfContents } from '@/tools/calculators/auto-loan/TableOfContents';
import { loadToolPageDetail } from '@/tools/registry/details';
import { isApprovedComponentKey, isRegisteredComponentKey } from '@/tools/registry/keys';
import { CurrencyRatesProvider } from '@/tools/shared/CurrencyRatesProvider';
import type { ToolMetadata } from '@/types/tool';

/** Phase 3: load FX rates only for conversion-enabled calculators. */
const CURRENCY_CONVERSION_SLUGS = new Set([
  'margin-interest-calculator',
  '12-hour-shift-pay-calculator',
  '3x-rent-calculator',
  '401k-calculator',
  '403b-calculator',
  '529-calculator',
  '702010-rule-money-calculator',
  'adr-calculator',
  'annualized-return-calculator',
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
  'loan-repayment-calculator-loan-payoff-calculator',
  'effective-annual-yield-calculator',
  'expected-utility-calculator',
  'expense-ratio-calculator',
  'fd-calculator',
  'fha-loan-calculator',
  'future-value-calculator',
  'hedge-ratio-calculator',
  'holding-period-return-calculator',
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
  'gmroi-calculator-gross-margin-return-on-investment',
  'google-adsense-calculator',
  'high-low-method-calculator',
  'labor-cost-calculator',
  'lemonade-stand-calculator',
  'lerner-index-calculator',
  'liquid-net-worth-calculator',
  'loan-balance-calculator',
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
  'nopat-calculator',
  'npv-calculator-net-present-value',
  'opportunity-cost-calculator',
  'percentage-return-calculator',
  'perpetuity-calculator',
  'present-value-calculator',
  'rate-of-return-calculator',
  'return-on-capital-employed-calculator-roce',
  'roi-calculator',
  'simple-interest-calculator',
  'sinking-fund-calculator',
  'time-value-of-money-calculator',
  'treynor-ratio-calculator',
  'ttm-calculator-trailing-twelve-months',
  'value-at-risk-calculator-var',
]);

function toSeoSource(dbTool: PublicToolDetail): ToolSeoSource {
  return {
    name: dbTool.name,
    slug: dbTool.slug,
    shortDescription: dbTool.shortDescription,
    componentKey: dbTool.componentKey,
    isActive: dbTool.isActive,
    ...emptyToolSeoFields({
      metaTitle: dbTool.metaTitle,
      metaDescription: dbTool.metaDescription,
      keywords: dbTool.keywords,
      canonicalUrl: dbTool.canonicalUrl,
      indexable: dbTool.indexable,
      robotsFollow: dbTool.robotsFollow,
      robotsNoArchive: dbTool.robotsNoArchive,
      robotsNoSnippet: dbTool.robotsNoSnippet,
      robotsNoImageIndex: dbTool.robotsNoImageIndex,
      robotsMaxSnippet: dbTool.robotsMaxSnippet,
      robotsMaxImagePreview:
        (dbTool.robotsMaxImagePreview as ToolSeoSource['robotsMaxImagePreview']) || '',
      robotsMaxVideoPreview: dbTool.robotsMaxVideoPreview,
      ogTitle: dbTool.ogTitle,
      ogDescription: dbTool.ogDescription,
      ogImageUrl: dbTool.ogImageUrl,
      ogImageAlt: dbTool.ogImageAlt,
      ogType: dbTool.ogType,
      ogSiteName: dbTool.ogSiteName,
      twitterCard: (dbTool.twitterCard as ToolSeoSource['twitterCard']) || '',
      twitterTitle: dbTool.twitterTitle,
      twitterDescription: dbTool.twitterDescription,
      twitterImageUrl: dbTool.twitterImageUrl,
      twitterImageAlt: dbTool.twitterImageAlt,
      twitterSite: dbTool.twitterSite,
      schemaType: (dbTool.schemaType as ToolSeoSource['schemaType']) || '',
      includeFaqSchema: dbTool.includeFaqSchema,
      sitemapInclude: dbTool.sitemapInclude,
      sitemapPriority: dbTool.sitemapPriority,
      sitemapChangeFrequency:
        (dbTool.sitemapChangeFrequency as ToolSeoSource['sitemapChangeFrequency']) || '',
    }),
  };
}

interface ToolDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}


export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbTool = await getPublicToolBySlug(slug);

  if (!dbTool || !isRegisteredComponentKey(dbTool.componentKey)) {
    return {
      title: 'Tool Not Found',
      robots: { index: false, follow: false },
    };
  }

  return buildToolPageMetadata(toSeoSource(dbTool), {
      siteName: siteConfig.name,
      siteUrl: getPublicSiteOrigin(),
      defaultOgImageUrl: siteConfig.defaultOgImage,
      isImplemented: true,
    });
}


export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const dbTool = await getPublicToolBySlug(slug);

  if (!dbTool || !isRegisteredComponentKey(dbTool.componentKey)) {
    notFound();
  }

  const toolMetadata: ToolMetadata = {
    id: dbTool.id,
    slug: dbTool.slug,
    title: dbTool.name,
    description: dbTool.shortDescription,
    category: dbTool.category?.slug ?? 'finance-business',
    executionType: dbTool.executionType,
    componentKey: dbTool.componentKey,
    version: '1.0.0',
    isActive: true,
    icon: dbTool.iconUrl ? undefined : 'Calculator',
    metaTitle: dbTool.metaTitle,
    metaDescription: dbTool.metaDescription,
  };

  const categoryName = dbTool.category?.name ?? 'Tools';
  const categorySlug = dbTool.category?.slug ?? '';
  const safeCategoryHref = categorySlug && dbTool ? `/categories/${categorySlug}` : '/categories';
  const pillarName = dbTool.pillar?.name ?? null;
  const pageDetail = await loadToolPageDetail(dbTool.componentKey);

  if (!pageDetail) {
    notFound();
  }

  const currencyRates = CURRENCY_CONVERSION_SLUGS.has(dbTool.slug)
    ? await getCurrencyRates()
    : null;

  const GuideArticleComponent = pageDetail.GuideArticle;
    const sidebarGroupLabel = pillarName || categoryName;
    const relatedToolsList = dbTool?.relatedTools ?? [];
    const samePillarTools = relatedToolsList.filter(
      (tool) => !pillarName || tool.pillarName === pillarName
    );
    const moreTools = (samePillarTools.length > 0 ? samePillarTools : relatedToolsList).slice(0, 6);
    const otherTopicTools = relatedToolsList
      .filter((tool) => pillarName && tool.pillarName && tool.pillarName !== pillarName)
      .slice(0, 4);
    const jsonLd =
      dbTool &&
      serializeJsonLd(
        buildToolJsonLd({
          tool: toSeoSource(dbTool),
          siteName: siteConfig.name,
          siteUrl: getPublicSiteOrigin(),
          isImplemented: isApprovedComponentKey(dbTool.componentKey),
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'All Tools', path: '/tools' },
            { name: categoryName, path: safeCategoryHref },
            { name: toolMetadata.title, path: `/tools/${toolMetadata.slug}` },
          ],
          // FAQ sections are visible on these guides — keep FAQPage schema in sync with on-page content.
          faqs: pageDetail.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
        })
      );

    const calculatorWorkspace = (
      <ToolWorkspace
        tool={toolMetadata}
        headerActions={
          dbTool &&
            isToolEmbedEligible({
              embedEnabled: dbTool.embedEnabled,
              isActive: dbTool.isActive,
              componentKey: dbTool.componentKey,
              embedDefaultHeight: dbTool.embedDefaultHeight ?? 650,
              embedPreferredLayout: dbTool.embedPreferredLayout ?? 'responsive',
              embedAllowedDomains: dbTool.embedAllowedDomains ?? '',
            }) ? (
            <CalculatorEmbedDialog
              toolName={dbTool.name}
              toolSlug={dbTool.slug}
              defaultHeight={dbTool.embedDefaultHeight}
            />
          ) : undefined
        }
      />
    );

    return (
      <div className="py-6 sm:py-9">
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
        ) : null}
        <Container>
          <Breadcrumbs
            items={[
              { label: 'All Tools', href: '/tools' },
              { label: categoryName, href: safeCategoryHref },
              { label: toolMetadata.title },
            ]}
            className="mb-4"
          />

          <div className="mb-5 rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6">
            <header>
              {/* Master shell (Loan Calculator): no decorative tool icon in the intro card */}
              <div className="min-w-0">
                {categoryName ? (
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                    {categoryName}
                  </p>
                ) : null}
                <h1 className="text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-accent sm:text-[34px] lg:text-[36px]">
                  {toolMetadata.title}
                </h1>
                <p className="mt-2.5 max-w-3xl text-[15px] font-normal leading-[1.7] text-muted-foreground sm:text-base sm:leading-[1.75]">
                  {toolMetadata.description} {pageDetail.subtitleLead}
                </p>
              </div>
            </header>
          </div>

          <AdSlot placement="tool_top_banner" className="mb-5" />

          {/* Left (~66%) calculator + guide; Right (~34%) sidebar widgets — page scrolls as one */}
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start lg:gap-8">
            <div className="order-1 min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
              <StickyCalculatorAside ariaLabel={pageDetail.asideAriaLabel}>
                {currencyRates ? (
                  <CurrencyRatesProvider rates={currencyRates}>
                    {calculatorWorkspace}
                  </CurrencyRatesProvider>
                ) : (
                  calculatorWorkspace
                )}
              </StickyCalculatorAside>

              <div className="rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6">
                <TableOfContents items={pageDetail.tocItems} />
              </div>

              <AdSlot placement="tool_article_middle" />

              <GuideArticleComponent />

              <AdSlot placement="tool_article_bottom" />
            </div>

            <div className="order-2 min-w-0 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-[84px] lg:max-h-[calc(100vh-104px)] lg:overflow-y-auto lg:overscroll-contain">
              <ToolDetailSidebar
                groupLabel={sidebarGroupLabel}
                browseHref={safeCategoryHref}
                browseLabel={`See all ${categoryName.toLowerCase()} tools`}
                moreTools={moreTools}
                otherTopicTools={otherTopicTools}
                countryRules={pageDetail.countryRules}
              />
            </div>
          </div>

          <AdSlot placement="tool_bottom_banner" className="mt-8" />
        </Container>
      </div>
  );
}
