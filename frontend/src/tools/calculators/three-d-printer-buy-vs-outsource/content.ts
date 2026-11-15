import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRINTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'buy-vs-outsource', label: 'Buying vs outsourcing 3D printing' },
  { id: 'printer-types', label: 'Printer types and cost differences' },
  { id: 'print-workflow', label: 'The 3D printing workflow' },
  { id: 'material-and-power', label: 'Material and electricity' },
  { id: 'maintenance-failures-labor', label: 'Maintenance, failed prints, and labor' },
  { id: 'cost-per-print', label: 'Cost per successful part' },
  { id: 'break-even', label: 'Break-even point' },
  { id: 'when-to-buy', label: 'When owning can make sense' },
  { id: 'when-to-outsource', label: 'When outsourcing can make sense' },
  { id: 'beyond-price', label: 'Quality, time, and capacity' },
  { id: 'worked-example', label: 'Worked example' },
  { id: 'printer-faq', label: 'Frequently asked questions' },
];

export interface PrinterGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
}

export const PRINTER_GUIDE_SECTIONS: readonly PrinterGuideSection[] = [
  {
    id: 'buy-vs-outsource',
    title: 'Buying vs outsourcing 3D printing',
    paragraphs: [
      'Owning a printer means paying for the machine up front, then paying material, electricity, maintenance, and your time for every attempt. Outsourcing means paying a service for each finished part, plus shipping, finishing, and any setup fee.',
      'This calculator compares those two cash pictures over the number of months you choose. Every price is an amount you type. The defaults are a worked example, not a quote for filament, power, or a print bureau.',
      'Currency changes the symbol only. A printer entered as 50000 stays 50000 if you switch from PKR to USD.',
    ],
  },
  {
    id: 'printer-types',
    title: 'Printer types and cost differences',
    paragraphs: [
      'A desktop filament printer (FDM) is often the cheapest machine and the cheapest plastic per kilogram, and it is the usual comparison for housings, jigs, and prototypes. Resin printers cost more to run because the material, wash, and cure steps add consumables the filament price does not cover. Powder and industrial systems are a different purchase entirely.',
      'The calculator does not pick a technology for you. Put the machine you would actually buy in the printer price, and put that process’s material price, power draw, and failure rate beside it. A cheap printer with a high failure rate can cost more per good part than a dearer one that finishes reliably.',
    ],
  },
  {
    id: 'print-workflow',
    title: 'The 3D printing workflow',
    paragraphs: [
      'A part still needs a model, slicer settings, a clear build plate, the print itself, and then removal, cleanup, and sometimes assembly. Labor time is the hands-on portion you want to price, not the hours the machine runs unattended.',
      'Outsourcing compresses that list into a price per part. The service’s own failures stay inside their quote. Your failures stay in the in-house side only.',
    ],
  },
  {
    id: 'material-and-power',
    title: 'Material and electricity',
    paragraphs: [
      'Material for one attempt is the grams you enter divided by 1000, times the price per kilogram. Electricity is printer watts divided by 1000, times hours, times the price per kilowatt-hour. A 200 W printer running 3 hours at 30 per kWh is 18 per attempt.',
      'The model uses one average power figure for the whole job. Heated beds, enclosures, and the idle time after a print are included only if you fold them into the watts or the hours.',
    ],
    formula: 'Material = (grams ÷ 1000) × price per kg',
    formulaNote: 'Electricity = (watts ÷ 1000) × hours × price per kWh.',
  },
  {
    id: 'maintenance-failures-labor',
    title: 'Maintenance, failed prints, and labor',
    paragraphs: [
      'Maintenance is a monthly amount multiplied by the comparison length. It is the place for nozzles, build sheets, lubricant, and a rough repair budget. It does not grow when you print more parts inside the same months.',
      'Failed prints use an independent-attempt model. If the failure rate is f, the expected number of attempts for one good part is 1 ÷ (1 − f). A 10% failure rate means about 1.11 attempts per good part. Each attempt is assumed to use the same material, the same machine time, and the same labor as a success. A print that fails in the first minutes and wastes less plastic is not modeled separately.',
      'Labor is hours per print times the hourly rate, charged on every attempt. Leave the rate at 0 if you do not want to price your own time.',
    ],
    formula: 'Expected attempts = successful parts ÷ (1 − failure rate)',
  },
  {
    id: 'cost-per-print',
    title: 'Cost per successful part',
    paragraphs: [
      'In-house cost is the printer, plus setup equipment, plus maintenance over the months, minus resale, plus material, electricity, and labor on the expected attempts. That total divided by the number of successful parts is the in-house cost per good part.',
      'Outsource cost is successful parts times (price per part + finishing), plus shipping per order times orders per month times months, plus a one-time service fee. Divide by the same successful-part count.',
      'If you ask for zero parts, the totals still include ownership, maintenance, shipping, and fees, but cost per part is left blank instead of dividing by zero.',
    ],
    formula: 'Net savings = outsourcing total − in-house total',
    formulaNote: 'Positive savings mean buying is cheaper over the period you entered.',
  },
  {
    id: 'break-even',
    title: 'Break-even point',
    paragraphs: [
      'Break-even is the number of successful parts, and the months at your current pace, where the two running totals meet. It is reported only when a successful part is cheaper to make than to buy, you print at least some parts each month, and the monthly gap is large enough to repay the printer after resale.',
      'Shipping is charged per order, and maintenance is charged per month. Neither one scales with the part count inside a month. The break-even therefore assumes you keep the same parts per month and the same orders per month. If those stay constant, the month figure is the timeline solution. It is not a promise that “48 parts” is the answer no matter how you bunch the orders.',
      'If the service is cheaper per part than your variable cost, or the printer’s monthly cost is never repaid, the result says there is no break-even under current assumptions. That is a result, not a missing number.',
    ],
  },
  {
    id: 'when-to-buy',
    title: 'When owning can make sense',
    paragraphs: [
      'Buying tends to win when you repeat the same kind of part often enough that material and power stay below the service price, and when you will still want the machine after this comparison ends. A realistic resale value lowers the ownership cost. A failure rate you have already measured is more useful than a hopeful zero.',
      'The default example is 10 parts a month for 12 months, 40 g and 3 hours each, 10% failures, a 50,000 printer with 20,000 resale, 2,500 per kg of material, 200 W at 30 per kWh, and 500 a month of maintenance. Outsourcing is 800 per finished part with no shipping. In-house comes to 51,733.33, outsourcing to 96,000, and buying is cheaper by 44,266.67. The costs meet at about 4.85 months, or 48.47 successful parts, if that pace continues.',
    ],
  },
  {
    id: 'when-to-outsource',
    title: 'When outsourcing can make sense',
    paragraphs: [
      'Outsourcing tends to win for a short run, a material you will not use again, or a machine that would sit idle after one project. A high printer price and a low part count often leave the purchase unrecovered. Shipping can still swing a small order the other way, because it is paid per shipment rather than disappearing inside a cheap unit price.',
      'One finished part against a 10,000 printer, with no resale and a service price of 1, is an outsourcing result. The calculator will say so without inventing a break-even.',
    ],
  },
  {
    id: 'beyond-price',
    title: 'Quality, time, and capacity',
    paragraphs: [
      'The cheaper line on the chart is not always the better choice. A service may hold a tolerance, a surface finish, or a certified material that a desktop machine will not match. Owning the printer can be faster when you iterate overnight, and slower when a failed job blocks the only machine you have.',
      'Capacity matters too. One printer has one build volume and one queue. A service can run several machines and also go silent on a holiday. None of those limits are in the money totals.',
    ],
  },
  {
    id: 'worked-example',
    title: 'Worked example',
    paragraphs: [
      'Using the defaults above: 120 successful parts need 120 ÷ 0.9 = 133.33 attempts. Each attempt is 100 of material and 18 of electricity, so variable cost is 15,733.33. Ownership is 50,000 + 6,000 maintenance − 20,000 resale = 36,000. In-house total is 51,733.33, or 431.11 per good part.',
      'Outsourcing is 120 × 800 = 96,000, or 800 per good part. Savings from buying are 44,266.67. These figures come from this page’s engine. Change any input and the result changes with it.',
    ],
  },
];

export const PRINTER_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator use current filament or bureau prices?',
    answer:
      'No. Every money field is yours. The sample prices exist so the first result is reproducible. Replace them with a quote, a spool you bought, and your own power tariff.',
  },
  {
    question: 'How are failed prints counted?',
    answer:
      'A failure rate of 10% means each good part is expected to take 1 ÷ 0.9 attempts. Failed attempts use the same material, print time, and labor as a success. The rate must be from 0 up to, but not including, 100%.',
  },
  {
    question: 'Why is there sometimes no break-even?',
    answer:
      'Break-even is shown only when making a part is cheaper than buying it and the monthly savings can repay the printer. If the service is cheaper per part, or maintenance swallows the gap, there is no month where buying catches up.',
  },
  {
    question: 'Does shipping change the break-even?',
    answer:
      'Shipping is per order per month, not per part. The break-even assumes you keep placing the same number of orders. Bunching every part into one shipment would be a different problem, so the part count is not presented as exact when shipping or maintenance is in the model.',
  },
  {
    question: 'What if I can sell the printer for more than I paid?',
    answer:
      'The resale is still subtracted, and a warning appears when it is higher than the printer plus setup cost. That can make ownership look profitable before you print anything. Treat that as a claim about resale, not as free printing.',
  },
  {
    question: 'Should I buy a printer just because the total is lower?',
    answer:
      'Only if the other limits also work for you: tolerance, material, how fast you need the part, and whether one machine can keep up. The recommendation is a cost comparison under the assumptions on the form.',
  },
];
