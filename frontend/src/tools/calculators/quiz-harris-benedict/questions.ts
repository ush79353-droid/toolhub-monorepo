import type { QuizQuestion } from './types';

/**
 * Seven-question bank matching Screenshot 2026-11-23 234145.png
 * (Quiz: Harris-Benedict equation to determine your basal metabolic rate).
 * Correct answers keyed by option id; verified key from prompt:
 * resting energy · age/sex/height/weight · TDEE · sex-specific equations ·
 * sedentary 1.2 · energy baseline · lean-mass gain.
 *
 * Activity factor 1.2 and sex-specific HB math are owned by
 * `bee-calculator` / `harris-benedict` — engine tests assert against those
 * helpers rather than duplicating coefficients.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    prompt:
      'True or false: Basal metabolic rate (BMR) is the amount of calories your body needs to function if you rest for 24 hours.',
    options: [
      { id: 'A', label: 'True' },
      { id: 'B', label: 'False' },
    ],
    correctAnswer: 'A',
    explanation:
      'BMR is resting energy — the calories needed to sustain essential body functions over 24 hours at complete rest.',
  },
  {
    id: 'q2',
    number: 2,
    prompt: 'Which factors do you need to know to estimate your BMR?',
    options: [
      { id: 'A', label: 'Weight, height, age, and sex' },
      { id: 'B', label: 'Weight and daily exercise only' },
      { id: 'C', label: 'Height and diet' },
      { id: 'D', label: 'Age and body fat percentage only' },
    ],
    correctAnswer: 'A',
    explanation:
      'Harris–Benedict BMR uses sex, age, height, and weight. Exercise and diet affect expenditure beyond basal, not the basal equation inputs.',
  },
  {
    id: 'q3',
    number: 3,
    prompt: 'What is the purpose of multiplying BMR by an activity factor?',
    options: [
      { id: 'A', label: 'To estimate body fat percentage' },
      {
        id: 'B',
        label: 'To calculate total daily energy expenditure (TDEE)',
      },
      { id: 'C', label: 'To determine muscle mass' },
      { id: 'D', label: 'To calculate resting heart rate' },
    ],
    correctAnswer: 'B',
    explanation:
      'BMR × activity estimates total daily energy expenditure (TDEE / TEE), not body fat, muscle mass, or heart rate.',
  },
  {
    id: 'q4',
    number: 4,
    prompt:
      'True or false: The Harris-Benedict equation uses the same formula for men and women.',
    options: [
      { id: 'A', label: 'True' },
      { id: 'B', label: 'False' },
    ],
    correctAnswer: 'B',
    explanation:
      'Men and women use different sex-specific coefficients in the Harris–Benedict (and revised) equations.',
  },
  {
    id: 'q5',
    number: 5,
    prompt: 'What is your activity level if you multiply your BMR by 1.2?',
    options: [
      { id: 'A', label: 'Moderately active' },
      { id: 'B', label: 'Sedentary (little or no exercise)' },
      { id: 'C', label: 'Very active' },
      { id: 'D', label: 'Extra active' },
    ],
    correctAnswer: 'B',
    explanation:
      'A 1.2 multiplier is the light sedentary / little-or-no-exercise activity factor used with Harris–Benedict BMR.',
  },
  {
    id: 'q6',
    number: 6,
    prompt: 'Why is BMR useful when planning weight loss or weight gain?',
    options: [
      { id: 'A', label: 'It calculates body fat percentage' },
      { id: 'B', label: 'It determines how many workouts you need' },
      { id: 'C', label: 'It measures physical fitness' },
      {
        id: 'D',
        label: 'It shows the minimum calories your body needs to function',
      },
    ],
    correctAnswer: 'D',
    explanation:
      'BMR is an energy baseline — the minimum calories required at rest — used when planning surplus or deficit around total intake.',
  },
  {
    id: 'q7',
    number: 7,
    prompt: 'Which of the following can help increase your BMR?',
    options: [
      { id: 'A', label: 'Eating less protein' },
      { id: 'B', label: 'Sleeping more hours' },
      {
        id: 'C',
        label: 'Building muscle through resistance training',
      },
      { id: 'D', label: 'Avoiding physical activity' },
    ],
    correctAnswer: 'C',
    explanation:
      'Gaining lean mass through resistance training raises resting energy needs; inactivity and lower protein do not increase BMR.',
  },
] as const;

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;

export const HARRIS_BENEDICT_CALCULATOR_HREF =
  '/tools/harris-benedict-calculator-basal-metabolic-rate';
