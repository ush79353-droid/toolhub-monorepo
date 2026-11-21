import type { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    prompt: 'What does an income percentile show?',
    options: [
      { id: 'A', label: 'A measure of how much you pay.' },
      { id: 'B', label: 'A prediction of future income growth.' },
      {
        id: 'C',
        label: 'A way to compare your income to others in society.',
      },
    ],
    correctAnswer: 'C',
    hint: 'Percentiles compare relative position in a group; not tax bills or future growth.',
    explanation:
      'Percentiles show how your income compares to others, not how it changes over time.',
  },
  {
    id: 'q2',
    number: 2,
    prompt: 'What does individual income refer to?',
    options: [
      { id: 'A', label: 'The income earned by all members of a household.' },
      { id: 'B', label: 'The income earned by a single person.' },
      { id: 'C', label: 'The income earned after taxes.' },
    ],
    correctAnswer: 'B',
    hint: 'Focus on one person, not a group or household. Check the definition.',
    explanation:
      'Individual income is the income earned by a single person; not the combined household total, and not specifically “after tax” by definition.',
  },
  {
    id: 'q3',
    number: 3,
    prompt: 'What does US household income usually represent?',
    options: [
      {
        id: 'A',
        label: 'The income of a single family or people living together.',
      },
      { id: 'B', label: 'The income of one working adult.' },
      { id: 'C', label: 'Only income from investments.' },
    ],
    correctAnswer: 'A',
    hint: 'Think about people who share a residence, not just one earner or one income type.',
    explanation:
      'Household income includes the combined income of people living together as a household.',
  },
  {
    id: 'q4',
    number: 4,
    prompt: 'What does it mean if your income is in the 75th percentile?',
    options: [
      {
        id: 'A',
        label: 'You earn more than 75% of people in the dataset.',
      },
      { id: 'B', label: 'You earn exactly the average income.' },
      { id: 'C', label: 'You earn in the top 5% of earners.' },
    ],
    correctAnswer: 'A',
    hint: 'A higher percentile means a larger share of the comparison group earns less than you.',
    explanation:
      'At the 75th percentile, you earn more than about 75% of people in the dataset (and less than about 25%).',
  },
  {
    id: 'q5',
    number: 5,
    prompt:
      'If your income is in the 25th percentile, what percentage of people earn more than you?',
    options: [
      { id: 'A', label: '75%.' },
      { id: 'B', label: '25%.' },
    ],
    correctAnswer: 'A',
    hint: 'Percentiles split data into 100 parts. What share sits above the 25th?',
    explanation:
      'If your income is at the 25th percentile, approximately 75% of observations are above it.',
  },
  {
    id: 'q6',
    number: 6,
    prompt:
      'If Karen earns $50,000 per year and is in the 84th percentile, what does this tell us?',
    options: [
      { id: 'A', label: 'She earns exactly the median income.' },
      { id: 'B', label: 'She is in the top 16% of earners.' },
      {
        id: 'C',
        label: 'She earns more than 84% of US individuals.',
      },
    ],
    correctAnswer: 'B',
    hint: 'Translate the percentile into “how many earn more” versus “how many earn less.”',
    explanation:
      'She earns more than approximately 84% of the compared population, placing her in the top 16%.',
  },
  {
    id: 'q7',
    number: 7,
    prompt: 'Which statement about income percentiles is correct?',
    options: [
      {
        id: 'A',
        label: 'Percentiles show exact income rankings for each person.',
      },
      {
        id: 'B',
        label: 'Percentiles compare income within a group or society.',
      },
      {
        id: 'C',
        label: 'Percentiles measure income growth over time.',
      },
      {
        id: 'D',
        label:
          'Percentiles describe positions within a group, not exact rankings or future income.',
      },
    ],
    correctAnswer: 'D',
    hint: 'Think about relative position; not a precise leaderboard or a growth forecast.',
    explanation:
      'Percentiles describe relative position within a group, not exact rankings or future income.',
  },
  {
    id: 'q8',
    number: 8,
    prompt: 'Which of the following can affect an employee’s income?',
    options: [
      { id: 'A', label: 'Education and years of experience.' },
      { id: 'B', label: 'Economic conditions and job type.' },
      { id: 'C', label: 'All of the above.' },
    ],
    correctAnswer: 'C',
    hint: 'Income depends on many factors; education, experience, job type, and the economy.',
    explanation:
      'Income depends on many things, including education, experience, and economic conditions.',
  },
] as const;

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;
