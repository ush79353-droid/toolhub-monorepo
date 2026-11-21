import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRICE_ELASTICITY_OF_DEMAND_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'what-is-ped', label: 'What Is Price Elasticity of Demand?' },
    { id: 'formula', label: 'Price Elasticity of Demand Formula' },
    { id: 'midpoint', label: 'Midpoint Formula for Elasticity' },
    { id: 'how-to-calculate', label: 'How to Calculate Price Elasticity' },
    { id: 'worked-example', label: 'Complete PED Calculation Example' },
    { id: 'types', label: 'Types of Price Elasticity of Demand' },
    { id: 'elastic', label: 'Elastic Demand' },
    { id: 'inelastic', label: 'Inelastic Demand' },
    { id: 'unit-elastic', label: 'Unit Elastic Demand' },
    { id: 'perfectly-inelastic', label: 'Perfectly Inelastic Demand' },
    { id: 'perfectly-elastic', label: 'Perfectly Elastic Demand' },
    { id: 'determinants', label: 'What Determines Price Elasticity?' },
    { id: 'revenue', label: 'Price Elasticity and Total Revenue' },
    { id: 'revenue-change', label: 'Revenue Increase and Price Elasticity' },
    { id: 'pricing', label: 'Price Elasticity and Business Pricing' },
    { id: 'profit', label: 'Price Elasticity and Profit' },
    { id: 'vs-income', label: 'Price Elasticity vs Income Elasticity' },
    { id: 'vs-cross', label: 'Price Elasticity vs Cross Price Elasticity' },
    { id: 'marginal-revenue', label: 'Price Elasticity and Marginal Revenue' },
    { id: 'optimal', label: 'Price Elasticity and Optimal Pricing' },
    { id: 'retail', label: 'Price Elasticity in Retail' },
    { id: 'ecommerce', label: 'Price Elasticity in E-Commerce' },
    { id: 'essentials', label: 'Price Elasticity for Essential Goods' },
    { id: 'luxury', label: 'Price Elasticity for Luxury Goods' },
    { id: 'positive', label: 'Positive Price Elasticity' },
    { id: 'short-long', label: 'Short-Run vs Long-Run Elasticity' },
    { id: 'point-vs-arc', label: 'Point Elasticity vs Arc Elasticity' },
    { id: 'why-midpoint', label: 'Why Is the Midpoint Method Used?' },
    { id: 'mistakes', label: 'Common PED Calculation Mistakes' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'ped-faq', label: 'Frequently Asked Questions' },
  ];

export const PRICE_ELASTICITY_OF_DEMAND_FAQS: readonly FAQItem[] = [
  {
    question: 'What is price elasticity of demand?',
    answer:
      'PED measures how quantity demanded responds to a change in the product’s own price. It is a dimensionless ratio of percentage quantity change to percentage price change.',
  },
  {
    question: 'How do I calculate price elasticity of demand?',
    answer:
      'Enter two price–quantity observations. This calculator uses the midpoint method: divide midpoint %ΔQ by midpoint %ΔP.',
  },
  {
    question: 'What is the formula for price elasticity?',
    answer: 'PED = (% change in quantity demanded) ÷ (% change in price).',
  },
  {
    question: 'What is the midpoint formula?',
    answer:
      'PED = [(Q2−Q1)/((Q1+Q2)/2)] ÷ [(P2−P1)/((P1+P2)/2)], or equivalently (Q2−Q1)/(Q1+Q2) × (P1+P2)/(P2−P1).',
  },
  {
    question: 'Why is the midpoint method useful?',
    answer:
      'It averages the two observations, so reversing the points yields the same PED estimate for the same interval.',
  },
  {
    question: 'What does negative price elasticity mean?',
    answer:
      'Price and quantity moved in opposite directions: the usual pattern for ordinary downward-sloping demand.',
  },
  {
    question: 'What does positive price elasticity mean?',
    answer:
      'Price and quantity moved in the same direction. That can reflect unusual goods, confounding market changes, or measurement issues; treat with caution.',
  },
  {
    question: 'What does PED equal to zero mean?',
    answer:
      'Quantity did not change while price changed; perfectly inelastic over the observed interval.',
  },
  {
    question: 'What does PED equal to −1 mean?',
    answer:
      'Unit elastic demand over the interval: percentage quantity and price changes match in magnitude (opposite signs).',
  },
  {
    question: 'What does PED less than −1 mean?',
    answer: 'Elastic demand: |PED| > 1 over the observed interval.',
  },
  {
    question: 'What does PED between −1 and 0 mean?',
    answer: 'Inelastic demand: 0 < |PED| < 1 over the observed interval.',
  },
  {
    question: 'What is elastic demand?',
    answer:
      'Demand where |PED| > 1; quantity responds proportionally more than price.',
  },
  {
    question: 'What is inelastic demand?',
    answer:
      'Demand where 0 < |PED| < 1; quantity responds proportionally less than price.',
  },
  {
    question: 'What is unit elastic demand?',
    answer: 'Demand where |PED| = 1 over the measured interval.',
  },
  {
    question: 'What is perfectly inelastic demand?',
    answer:
      'Quantity does not change when price changes (PED = 0 for the observations).',
  },
  {
    question: 'What is perfectly elastic demand?',
    answer:
      'A theoretical limiting case of infinite sensitivity. Two finite midpoint observations do not produce Infinity as a PED result.',
  },
  {
    question: 'Why is demand usually downward-sloping?',
    answer:
      'Holding other factors fixed, higher prices typically reduce quantity demanded for ordinary goods.',
  },
  {
    question: 'What factors influence price elasticity?',
    answer:
      'Substitutes, necessity vs luxury, income share, adjustment time, brand loyalty, market definition, and preferences.',
  },
  {
    question: 'How do substitutes affect elasticity?',
    answer:
      'More close substitutes usually make demand more elastic because buyers can switch more easily.',
  },
  {
    question: 'How does income affect demand sensitivity?',
    answer:
      'Goods that take a larger share of income often show stronger price sensitivity, though results vary by product and context.',
  },
  {
    question: 'Why are necessities often relatively inelastic?',
    answer:
      'Buyers may have fewer alternatives in the short run, so quantity may fall less than proportionally when price rises, but not always perfectly inelastic.',
  },
  {
    question: 'Why might luxury goods have elastic demand?',
    answer:
      'Purchases can be deferred or substituted, so quantity may respond strongly to price; depending on income and market.',
  },
  {
    question: 'What is the difference between point elasticity and arc elasticity?',
    answer:
      'Point elasticity uses a local slope on a demand curve. Arc (midpoint) elasticity measures responsiveness between two finite observations.',
  },
  {
    question: 'How do I calculate revenue from price and quantity?',
    answer: 'Revenue = price × quantity for each observation.',
  },
  {
    question: 'How does price elasticity affect total revenue?',
    answer:
      'For ordinary downward-sloping demand, a price rise tends to cut revenue when demand is elastic and raise it when demand is inelastic over the interval.',
  },
  {
    question: 'Can higher prices increase revenue?',
    answer:
      'Yes, when demand is inelastic over the relevant range and other factors are held constant in the comparison.',
  },
  {
    question: 'Can lower prices increase revenue?',
    answer:
      'Yes, when demand is elastic and the quantity increase more than offsets the lower price.',
  },
  {
    question: 'Does elastic demand mean higher profit?',
    answer:
      'No. Revenue and profit differ; profit also depends on costs. Use a pricing model such as the Optimal Price Calculator for contribution estimates.',
  },
  {
    question: 'Does inelastic demand mean a business should always increase prices?',
    answer:
      'No. Competition, capacity, reputation, regulation, and costs matter. Elasticity is one input, not a complete strategy.',
  },
  {
    question: 'What is the relationship between PED and marginal revenue?',
    answer:
      'For differentiable demand, MR = P(1 + 1/ε) using point elasticity. Do not treat midpoint PED as an exact point ε without stating that approximation.',
  },
  {
    question: 'How does PED affect optimal pricing?',
    answer:
      'More elastic demand generally supports a smaller markup over marginal cost under standard monopoly-style models with constant elasticity.',
  },
  {
    question: 'What happens if initial and final prices are equal?',
    answer:
      'PED is undefined because the price change is zero. Revenue can still be calculated.',
  },
  {
    question: 'Can quantity demanded be zero?',
    answer:
      'Yes. Midpoint PED can still be defined if average quantity is positive. If both quantities are zero, PED is undefined.',
  },
  {
    question: 'Can PED be positive?',
    answer:
      'Yes in the arithmetic sense. Interpret carefully; it may not describe ordinary own-price demand.',
  },
  {
    question: 'Can elasticity be calculated from two observations?',
    answer:
      'Yes as an interval (arc) estimate. Two points do not identify a full demand curve or prove causation.',
  },
  {
    question: 'Why does the calculator show an undefined result?',
    answer:
      'Usually equal prices or zero average quantity. Invalid or missing inputs also prevent PED.',
  },
  {
    question: 'How accurate is price elasticity of demand?',
    answer:
      'It is only as reliable as the observations and the ceteris-paribus assumption. External shocks can distort the estimate.',
  },
  {
    question: 'What is the difference between price elasticity and income elasticity?',
    answer:
      'Price elasticity responds to own price; income elasticity responds to consumer income.',
  },
  {
    question:
      'What is the difference between own-price elasticity and cross-price elasticity?',
    answer:
      'Own-price PED uses the product’s own price. Cross-price elasticity uses another product’s price.',
  },
  {
    question: 'How can businesses use price elasticity in pricing strategies?',
    answer:
      'To anticipate revenue effects of price tests, compare segments, and inform promotions, alongside cost and competitive analysis.',
  },
  {
    question:
      'What is the price elasticity when price rises from $50 to $60 and quantity falls from 200 to 150?',
    answer:
      'Midpoint PED = −11/7 ≈ −1.5714 (elastic demand). Initial revenue $10,000; final $9,000; revenue change −10%.',
  },
  {
    question:
      'What is the revenue increase when revenue changes from $10,000 to $9,000?',
    answer: '(9000 − 10000) / 10000 × 100 = −10%.',
  },
  {
    question: 'What is the price elasticity when quantity does not change?',
    answer:
      'If price changes and quantity is unchanged, midpoint PED = 0 (perfectly inelastic over the interval).',
  },
  {
    question: 'What happens when initial and final prices are the same?',
    answer:
      'The PED denominator is zero, so elasticity is undefined. Do not display Infinity.',
  },
];
