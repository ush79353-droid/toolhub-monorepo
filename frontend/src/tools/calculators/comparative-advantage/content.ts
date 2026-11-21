import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COMPARATIVE_ADVANTAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Comparative Advantage Calculator' },
  { id: 'what-is', label: 'What Is Comparative Advantage?' },
  { id: 'economics', label: 'Comparative Advantage in Economics' },
  { id: 'formula', label: 'Comparative Advantage Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Comparative Advantage' },
  { id: 'economics-trade', label: 'The Economics of Comparative Advantage' },
  { id: 'vs-absolute', label: 'Comparative vs. Absolute Advantage' },
  { id: 'ppf', label: 'Opportunity Cost and PPFs' },
  { id: 'trade', label: 'Comparative Advantage and International Trade' },
  { id: 'specialization', label: 'How Countries Benefit from Specialization' },
  { id: 'limitations', label: 'Limitations of Comparative Advantage' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'comparative-advantage-faq', label: 'Frequently Asked Questions' },
];

export const COMPARATIVE_ADVANTAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is comparative advantage?',
    answer:
      'A producer has a comparative advantage in a good when it can produce that good at a lower opportunity cost than another producer.',
  },
  {
    question: 'How do you calculate comparative advantage?',
    answer:
      'Compute each country’s opportunity cost of each good (same-country output ratios), then assign comparative advantage to the lower opportunity cost for each good.',
  },
  {
    question: 'What is the comparative advantage formula?',
    answer:
      'With outputs of Good A and Good B from the same labor: OC_A = B/A and OC_B = A/B. Compare OC values across countries.',
  },
  {
    question: 'What is the difference between comparative advantage and absolute advantage?',
    answer:
      'Absolute advantage is higher productivity with the same input. Comparative advantage is lower opportunity cost. A country can have absolute advantage in both goods but comparative advantage in only one.',
  },
  {
    question: 'What is opportunity cost?',
    answer:
      'What you forgo to get one more unit of a good; here, how many units of the other good you sacrifice along a linear PPF.',
  },
  {
    question: 'How do you calculate the opportunity cost of Good A?',
    answer:
      'OC_A = (output of Good B per labor) / (output of Good A per labor) for the same country.',
  },
  {
    question: 'How do you calculate the opportunity cost of Good B?',
    answer:
      'OC_B = (output of Good A per labor) / (output of Good B per labor) for the same country.',
  },
  {
    question: 'Can a country have an absolute advantage in both goods?',
    answer:
      'Yes. Higher productivity in both goods means absolute advantage in both, but comparative advantage still depends on relative opportunity costs.',
  },
  {
    question: 'Can a country have a comparative advantage in both goods?',
    answer:
      'Not as a unique strict advantage in both when there are two goods and two producers with differing relative costs; each good’s lower OC goes to one side (or both tie).',
  },
  {
    question: 'What happens when opportunity costs are equal?',
    answer:
      'Neither country has a unique comparative advantage in that good; the calculator reports equal opportunity cost.',
  },
  {
    question: 'Why does comparative advantage matter?',
    answer:
      'It explains how specialization based on relative costs (not only absolute productivity) can expand feasible consumption through trade under model assumptions.',
  },
  {
    question: 'How does comparative advantage encourage international trade?',
    answer:
      'When opportunity costs differ, mutually beneficial terms of trade can exist so each country obtains goods more cheaply than producing both alone.',
  },
  {
    question: 'What are the benefits of specialization?',
    answer:
      'Under the two-good linear model, specializing in the comparative-advantage good and trading can raise feasible consumption sets; gains need not be equal for all people.',
  },
  {
    question: 'What are the limitations of comparative advantage?',
    answer:
      'Transport costs, barriers, imperfect competition, adjustment costs, many factors, technology change, distributional and environmental effects, and dynamic advantage.',
  },
  {
    question: 'Who developed the theory of comparative advantage?',
    answer:
      'David Ricardo is classically associated with the theory of comparative advantage in international trade.',
  },
  {
    question: "What is Ricardo's theory of comparative advantage?",
    answer:
      'Even a country that is less productive in all goods can gain from trade by specializing where its opportunity cost is relatively lowest.',
  },
  {
    question: 'How is comparative advantage related to a PPF?',
    answer:
      'On a linear two-good PPF, the slope magnitude is the opportunity cost of the horizontal good; flatter relative slopes correspond to comparative advantage.',
  },
  {
    question: 'What are mutually beneficial terms of trade?',
    answer:
      'Exchange rates lying strictly between the two countries’ opportunity costs for a good, so both can be better off than autarky under the model.',
  },
  {
    question: 'Does free trade benefit everyone equally?',
    answer:
      'No. Aggregate gains under stylized models do not imply every individual or industry benefits; distributional effects matter.',
  },
  {
    question: 'Can comparative advantage change over time?',
    answer:
      'Yes. Technology, skills, resources, and institutions can shift opportunity costs; comparative advantage is dynamic.',
  },
];
