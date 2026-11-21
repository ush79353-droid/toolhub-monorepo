import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRODUCTIVITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-productivity', label: 'What Is Productivity?' },
  { id: 'labor-productivity', label: 'What Is Labor Productivity?' },
  { id: 'why-important', label: 'Why Is Productivity Important?' },
  { id: 'labor-formula', label: 'Labor Productivity Formula' },
  { id: 'rpe-formula', label: 'Revenue per Employee Formula' },
  { id: 'rph-formula', label: 'Revenue per Working Hour Formula' },
  { id: 'how-to-use', label: 'How to Use the Productivity Calculator' },
  { id: 'worked-example', label: 'Productivity Calculation Example' },
  { id: 'employee-calc', label: 'How to Calculate Employee Productivity' },
  { id: 'hourly-calc', label: 'How to Calculate Hourly Productivity' },
  { id: 'rpe-vs-rph', label: 'Revenue per Employee vs per Hour' },
  { id: 'good-rpe', label: 'What Is a Good Revenue per Employee?' },
  { id: 'good-rph', label: 'What Is a Good Revenue per Hour?' },
  { id: 'vs-efficiency', label: 'Productivity vs Efficiency' },
  { id: 'vs-profit', label: 'Productivity vs Profitability' },
  { id: 'vs-labor-cost', label: 'Productivity vs Labor Cost' },
  { id: 'manufacturing', label: 'Productivity in Manufacturing' },
  { id: 'retail', label: 'Productivity in Retail' },
  { id: 'services', label: 'Productivity in Service Businesses' },
  { id: 'software', label: 'Productivity in Software Companies' },
  { id: 'small-business', label: 'Productivity in Small Businesses' },
  { id: 'freelancers', label: 'Productivity for Freelancers' },
  { id: 'improve-employee', label: 'How to Improve Employee Productivity' },
  { id: 'improve-hourly', label: 'How to Improve Hourly Productivity' },
  { id: 'technology', label: 'Technology and Productivity' },
  { id: 'automation', label: 'Automation and Labor Productivity' },
  { id: 'growth', label: 'Productivity and Business Growth' },
  { id: 'margins', label: 'Productivity and Profit Margins' },
  { id: 'performance', label: 'Productivity and Employee Performance' },
  { id: 'mistakes', label: 'Common Productivity Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'productivity-faq', label: 'Frequently Asked Questions' },
];

export const PRODUCTIVITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is productivity?',
    answer:
      'Productivity measures how much output is produced relative to an input such as labor. This calculator focuses on revenue-based labor productivity.',
  },
  {
    question: 'What is labor productivity?',
    answer:
      'Labor productivity relates business output to workforce input; here, revenue per employee and revenue per working hour.',
  },
  {
    question: 'How do I calculate productivity?',
    answer:
      'Divide output by labor input. For revenue productivity: Revenue ÷ Employees and/or Revenue ÷ Working Hours.',
  },
  {
    question: 'What is the productivity formula?',
    answer: 'Productivity = Output ÷ Labor Input.',
  },
  {
    question: 'How do I calculate revenue per employee?',
    answer: 'RPE = Total Revenue ÷ Number of Employees (or FTE).',
  },
  {
    question: 'How do I calculate revenue per working hour?',
    answer:
      'RPH = Total Revenue ÷ Total Working Hours (convert minutes/seconds to hours first).',
  },
  {
    question: 'What does revenue per employee measure?',
    answer:
      'Average revenue generated per worker (or FTE) in the reporting period; not profit or individual performance.',
  },
  {
    question: 'What does revenue per working hour measure?',
    answer:
      'Average revenue generated for each total labor hour worked in the same period.',
  },
  {
    question: 'Is revenue per employee the same as profit per employee?',
    answer: 'No. Profit subtracts costs; revenue does not.',
  },
  {
    question: 'Is productivity the same as efficiency?',
    answer:
      'Related but different. Efficiency emphasizes minimizing waste; productivity emphasizes output per input.',
  },
  {
    question: 'Is productivity the same as profitability?',
    answer:
      'No. High revenue productivity can coexist with low margins if costs are high.',
  },
  {
    question: 'How do I calculate employee productivity per month?',
    answer:
      'Use monthly revenue and the employee count for that month. Keep periods consistent.',
  },
  {
    question: 'How do I calculate employee productivity per year?',
    answer:
      'Use annual revenue with annual average headcount/FTE for the same year.',
  },
  {
    question: 'What is a good revenue per employee?',
    answer:
      'It depends on industry, capital intensity, outsourcing, and business model. Compare peers and history; there is no universal ideal.',
  },
  {
    question: 'What is a good revenue per hour?',
    answer:
      'Benchmarks vary widely by sector and role mix. Interpret alongside labor cost and margins.',
  },
  {
    question: 'How does employee count affect productivity?',
    answer:
      'Higher headcount lowers RPE for the same revenue. Growth that adds people faster than revenue reduces RPE.',
  },
  {
    question: 'How do working hours affect productivity?',
    answer:
      'More total hours lower RPH for the same revenue. Extra hours are not automatically more productive.',
  },
  {
    question: 'Can productivity be zero?',
    answer:
      'Yes: zero revenue with positive employees or hours yields zero revenue productivity.',
  },
  {
    question: 'Can revenue per employee be negative?',
    answer:
      'Not in this tool; negative revenue is rejected. Use profit metrics for losses.',
  },
  {
    question: 'What happens when employee count is zero?',
    answer:
      'Revenue per employee is unavailable. Hourly productivity can still calculate if hours are valid.',
  },
  {
    question: 'What happens when working hours are zero?',
    answer:
      'Hourly productivity is unavailable. Employee productivity can still calculate if headcount is valid.',
  },
  {
    question: 'Should I count part-time employees?',
    answer:
      'Yes if they contribute to revenue. Prefer FTE when comparing mixed schedules.',
  },
  {
    question: 'What are full-time equivalent employees?',
    answer:
      'FTE converts part-time schedules into fractions of a full-time role (for example 0.5 FTE).',
  },
  {
    question: 'Should I include contractors?',
    answer:
      'Include them when comparing operating capacity; be consistent across periods and peers.',
  },
  {
    question: 'How do I calculate total labor hours?',
    answer:
      'Sum hours worked by all included workers for the period; do not multiply a per-person total by headcount again.',
  },
  {
    question: 'How do I convert minutes into working hours?',
    answer: 'Hours = Minutes ÷ 60.',
  },
  {
    question: 'How do I calculate productivity using working days?',
    answer:
      'Convert workdays to hours with an explicit hours-per-day assumption (for example 5 × 8 = 40), then divide revenue by those hours. This calculator uses seconds, minutes, and hours to avoid ambiguous calendar-day conversions.',
  },
  {
    question: 'Why do productivity results differ by industry?',
    answer:
      'Pricing, capital intensity, outsourcing, and revenue recognition differ; peer comparisons work best within an industry.',
  },
  {
    question: 'How can a company improve labor productivity?',
    answer:
      'Train people, improve tools and processes, remove bottlenecks, and align staffing with demand.',
  },
  {
    question: 'How can businesses increase revenue per employee?',
    answer:
      'Grow revenue without proportional headcount growth, improve pricing/mix, or raise output per worker.',
  },
  {
    question: 'How can businesses improve hourly productivity?',
    answer:
      'Reduce idle time, streamline workflows, schedule better, and remove process delays.',
  },
  {
    question: 'What is the difference between productivity and output?',
    answer:
      'Output is the absolute amount produced; productivity is output relative to an input.',
  },
  {
    question: 'Can automation improve productivity?',
    answer:
      'Often yes for measured output per labor hour, but implementation cost and role changes matter.',
  },
  {
    question: 'Does working longer hours always increase productivity?',
    answer:
      'No. Longer hours raise input; productivity rises only if output grows faster than hours.',
  },
  {
    question: 'How does technology affect labor productivity?',
    answer:
      'Better systems can raise output per hour when adopted effectively and measured consistently.',
  },
  {
    question: 'How does employee training affect productivity?',
    answer:
      'Training can raise skill and reduce errors, supporting higher output per labor input over time.',
  },
  {
    question: 'How does labor productivity affect profitability?',
    answer:
      'Higher revenue per labor input can help margins if costs do not rise faster than revenue.',
  },
  {
    question: 'How accurate is a productivity calculator?',
    answer:
      'Math is exact for entered values. Accuracy depends on period alignment and classification choices.',
  },
  {
    question: 'Can I compare productivity across different companies?',
    answer:
      'Yes with caution; align definitions, periods, and industry context first.',
  },
  {
    question: 'What are the limitations of revenue-based productivity?',
    answer:
      'It ignores cost structure, capital intensity, quality, and individual role differences.',
  },
  {
    question:
      'What is the productivity of a business with $120,000 revenue and 20 employees?',
    answer: '120,000 ÷ 20 = $6,000 per employee.',
  },
  {
    question:
      'What is revenue per working hour if a company earns $120,000 in 800 labor hours?',
    answer: '120,000 ÷ 800 = $150/hour.',
  },
  {
    question:
      'How many total labor hours do 10 employees work if each works 40 hours?',
    answer: '10 × 40 = 400 labor hours.',
  },
  {
    question:
      'What is revenue per employee for a company with $1,000,000 revenue and 50 employees?',
    answer: '1,000,000 ÷ 50 = $20,000 per employee.',
  },
];
