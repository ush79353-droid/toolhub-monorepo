import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SMOKERS_CTC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-smokers-ctc', label: 'What Is Smoker’s CTC?' },
  { id: 'smokers-ctc-formulas', label: 'Formulas' },
  { id: 'work-day-and-wage', label: 'Work Day Settings and Wage Period' },
  { id: 'cigarette-and-life', label: 'Cigarette Cost and Life Line' },
  { id: 'smokers-ctc-faq', label: 'Frequently Asked Questions' },
];

export interface SmokersCtcGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
}

export const SMOKERS_CTC_GUIDE_SECTIONS: readonly SmokersCtcGuideSection[] = [
  {
    id: 'what-is-smokers-ctc',
    title: 'What is smoker’s CTC (cost to company)?',
    paragraphs: [
      'Smoker’s CTC estimates how much paid work time is spent on smoke breaks, the wage value of that time, and the money spent on cigarettes smoked during workdays. It is an arithmetic planning tool for employers and employees, not a disciplinary score.',
      'Defaults follow a common reference: 15-minute breaks, three breaks per day, an 8-hour day, five days per week, and ten holiday days per year. Enter a wage and pack price when you want money results. Currency changes the symbol only.',
    ],
  },
  {
    id: 'smokers-ctc-formulas',
    title: 'Formulas',
    paragraphs: [
      'Daily smoking minutes are break minutes times breaks per day. Daily smoking hours are that total divided by 60. Daily labor cost is daily smoking hours times the hourly wage. Weekly labor cost multiplies by days worked per week. Yearly labor cost multiplies by workdays per year. Monthly labor cost is yearly labor cost divided by 12.',
      'Workdays per year are days per week × 52 minus holiday days. Empty or invalid wage fields leave labor money blank. Zero break time or zero breaks correctly produce zero smoking time.',
    ],
    formula: 'Daily labor = (break minutes × breaks/day ÷ 60) × hourly wage',
    formulaNote: 'Yearly labor = daily labor × (days/week × 52 − holidays). Monthly = yearly ÷ 12.',
  },
  {
    id: 'work-day-and-wage',
    title: 'Work day settings and wage period',
    paragraphs: [
      'Work day settings stay collapsed until you open them. Hours per day convert daily, weekly, monthly, and yearly wages into an hourly rate. Holiday days reduce yearly smoking time and yearly money totals only.',
      'Choose the period that matches how the wage is entered. An hourly wage of 10 with the defaults is 7.50 per day of smoking time, 37.50 per week, and 1,875 per year after ten holidays.',
    ],
  },
  {
    id: 'cigarette-and-life',
    title: 'Cigarette cost and life expectancy line',
    paragraphs: [
      'Cost per cigarette is pack price divided by cigarettes per pack. Weekly and yearly cigarette costs assume one cigarette per smoke break on workdays. If a break usually involves more than one cigarette, raise breaks per day to match cigarettes smoked at work.',
      'The life expectancy cost line is illustrative only. It multiplies workday cigarettes by 11 minutes (a commonly cited heuristic) and converts to days using days/week × 52 before holiday deduction. Defaults give about 5.958 days. It is not medical advice and does not predict any individual’s health outcome.',
    ],
    formula: 'Life days ≈ breaks/day × (days/week × 52) × 11 ÷ 1,440',
    formulaNote: 'One cigarette per break. Not a clinical estimate.',
  },
];

export const SMOKERS_CTC_FAQS: readonly FAQItem[] = [
  {
    question: 'What does CTC mean here?',
    answer:
      'Cost to company — the estimated wage value of paid smoke-break time, plus optional cigarette spend during workdays. It is not a Child Tax Credit tool.',
  },
  {
    question: 'How many cigarettes are assumed per break?',
    answer:
      'One cigarette per smoke break. Adjust breaks per day if more or fewer cigarettes are smoked during work time.',
  },
  {
    question: 'Do holidays affect every result?',
    answer:
      'Holiday days reduce yearly smoking time and yearly money figures. Weekly figures use days per week only. The life-expectancy line uses days/week × 52 and does not subtract holidays.',
  },
  {
    question: 'Is the life expectancy cost medical advice?',
    answer:
      'No. It applies a commonly cited 11-minutes-per-cigarette heuristic for illustration only. Individual health effects depend on many factors this calculator does not model.',
  },
  {
    question: 'Does changing currency convert the wage?',
    answer:
      'No. The currency control changes the symbol and grouping only. Enter amounts in the currency you want to read.',
  },
];
