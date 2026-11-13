import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ToolWorkspace } from '@/components/shared/ToolWorkspace';
import { type FAQItem } from '@/components/shared/FAQAccordion';
import {
  ToolDetailSidebar,
  type ToolDetailSidebarCountryRules,
} from '@/components/shared/ToolDetailSidebar';
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
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { AutoLoanGuideArticle } from '@/tools/calculators/auto-loan/AutoLoanGuideArticle';
import { StickyCalculatorAside } from '@/tools/calculators/auto-loan/StickyCalculatorAside';
import {
  TableOfContents,
  type TableOfContentsItem,
} from '@/tools/calculators/auto-loan/TableOfContents';
import { AUTO_LOAN_FAQS, AUTO_LOAN_TOC_ITEMS } from '@/tools/calculators/auto-loan/content';
import { LoanGuideArticle } from '@/tools/calculators/loan/LoanGuideArticle';
import { LOAN_FAQS, LOAN_TOC_ITEMS } from '@/tools/calculators/loan/content';
import { RrefGuideArticle } from '@/tools/calculators/rref/RrefGuideArticle';
import { RREF_FAQS, RREF_TOC_ITEMS } from '@/tools/calculators/rref/content';
import { ArmMortgageGuideArticle } from '@/tools/calculators/arm-mortgage/ArmMortgageGuideArticle';
import { ARM_FAQS, ARM_TOC_ITEMS } from '@/tools/calculators/arm-mortgage/content';
import { HundredDayGuideArticle } from '@/tools/calculators/hundred-day/HundredDayGuideArticle';
import { HUNDRED_DAY_FAQS, HUNDRED_DAY_TOC_ITEMS } from '@/tools/calculators/hundred-day/content';
import { TwelveVoltWireGuideArticle } from '@/tools/calculators/twelve-volt-wire/TwelveVoltWireGuideArticle';
import { TWELVE_VOLT_FAQS, TWELVE_VOLT_TOC_ITEMS } from '@/tools/calculators/twelve-volt-wire/content';
import { isApprovedComponentKey, isRegisteredComponentKey } from '@/tools/registry/keys';
import type { ToolMetadata } from '@/types/tool';

const SIDEBAR_COUNTRIES = [
  'India',
  'UAE',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
] as const;

const TWO_COLUMN_TOOL_CONFIGS: Record<
  string,
  {
    subtitleLead: string;
    asideAriaLabel: string;
    tocItems: readonly TableOfContentsItem[];
    GuideArticle: React.ComponentType;
    faqs: readonly FAQItem[];
    countryRules?: ToolDetailSidebarCountryRules | null;
  }
> = {
  AutoLoanCalculator: {
    subtitleLead:
      'Estimate monthly car payments, net trade-in equity, sales tax, fees, total interest, and payoff date directly in your browser.',
    asideAriaLabel: 'Interactive auto loan calculator',
    tocItems: AUTO_LOAN_TOC_ITEMS,
    GuideArticle: AutoLoanGuideArticle,
    faqs: AUTO_LOAN_FAQS,
    countryRules: {
      title: 'Auto loan rules by country',
      countries: SIDEBAR_COUNTRIES,
    },
  },
  LoanCalculator: {
    subtitleLead:
      'Estimate regular payments, total interest, extra-payment savings, origination fees, and amortization schedules for amortized or interest-only loans directly in your browser.',
    asideAriaLabel: 'Interactive loan calculator',
    tocItems: LOAN_TOC_ITEMS,
    GuideArticle: LoanGuideArticle,
    faqs: LOAN_FAQS,
    countryRules: {
      title: 'Loan rules by country',
      countries: SIDEBAR_COUNTRIES,
    },
  },
  RrefCalculator: {
    subtitleLead:
      'Reduce any matrix to reduced row echelon form with exact fractions, step-by-step Gauss–Jordan operations, rank, pivot columns, and optional augmented-system analysis.',
    asideAriaLabel: 'Interactive RREF calculator',
    tocItems: RREF_TOC_ITEMS,
    GuideArticle: RrefGuideArticle,
    faqs: RREF_FAQS,
    countryRules: null,
  },
  ArmMortgageCalculator: {
    subtitleLead:
      'Estimate an adjustable-rate mortgage payment through the fixed period and modeled resets, including caps, remaining-term re-amortization, and optional housing costs.',
    asideAriaLabel: 'Interactive ARM mortgage calculator',
    tocItems: ARM_TOC_ITEMS,
    GuideArticle: ArmMortgageGuideArticle,
    faqs: ARM_FAQS,
    countryRules: {
      title: 'Mortgage rules by country',
      countries: SIDEBAR_COUNTRIES,
    },
  },
  HundredDayCalculator: {
    subtitleLead:
      'Find the date 100 days after or before any day, or count calendar days between two dates, including leap years and inclusive counting.',
    asideAriaLabel: 'Interactive 100 day calculator',
    tocItems: HUNDRED_DAY_TOC_ITEMS,
    GuideArticle: HundredDayGuideArticle,
    faqs: HUNDRED_DAY_FAQS,
    countryRules: null,
  },
  TwelveVoltWireCalculator: {
    subtitleLead:
      'Estimate the 12 V DC conductor area for a two-wire voltage-drop limit from current, one-way length, material, and temperature.',
    asideAriaLabel: 'Interactive 12 volt wire size calculator',
    tocItems: TWELVE_VOLT_TOC_ITEMS,
    GuideArticle: TwelveVoltWireGuideArticle,
    faqs: TWELVE_VOLT_FAQS,
    countryRules: null,
  },
};

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
  const pillarName = dbTool?.pillar?.name ?? null;
  const twoColConfig = TWO_COLUMN_TOOL_CONFIGS[toolMetadata.componentKey];

  if (!twoColConfig) {
    notFound();
  }
    const GuideArticleComponent = twoColConfig.GuideArticle;
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
          faqs: twoColConfig.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
        })
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
                  {toolMetadata.description} {twoColConfig.subtitleLead}
                </p>
              </div>
            </header>
          </div>

          <AdSlot placement="tool_top_banner" className="mb-5" />

          {/* Left (~66%) calculator + guide; Right (~34%) sidebar widgets — page scrolls as one */}
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start lg:gap-8">
            <div className="order-1 min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
              <StickyCalculatorAside ariaLabel={twoColConfig.asideAriaLabel}>
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
              </StickyCalculatorAside>

              <div className="rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6">
                <TableOfContents items={twoColConfig.tocItems} />
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
                countryRules={twoColConfig.countryRules}
              />
            </div>
          </div>

          <AdSlot placement="tool_bottom_banner" className="mt-8" />
        </Container>
      </div>
  );
}
