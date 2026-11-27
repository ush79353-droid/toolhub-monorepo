import type { QuizQuestion } from './types';

/**
 * Eight-question bank for Quiz: FFMI Calculator (Fat-Free Mass Index).
 *
 * Q1 wording + distractors: Screenshot 2026-11-26 004955.png (approved).
 * Q2–Q8: original educational items (prompt: write original when unseen;
 * themes aligned with Omni FFMI teaching + classification bands).
 *
 * Formula facts taught here match the companion FFMI calculator:
 * FFM = kg × (1 − fat%/100); FFMI = FFM / height_m²;
 * normalized FFMI = FFMI + 6.1 × (1.8 − height_m).
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    prompt: '💪 Quick warm-up: what does FFMI stand for?',
    options: [
      { id: 'A', label: 'Fat-Focused Muscle Index' },
      { id: 'B', label: 'Fat-Free Mass Index' },
      { id: 'C', label: 'Fitness and Fat Measurement Indicator' },
    ],
    correctAnswer: 'B',
    explanation:
      'FFMI expands to Fat-Free Mass Index — lean (fat-free) mass relative to height.',
    provenance: 'screenshot',
  },
  {
    id: 'q2',
    number: 2,
    prompt: 'What does FFMI primarily describe?',
    options: [
      { id: 'A', label: 'Total daily calorie burn from exercise alone' },
      {
        id: 'B',
        label: 'Fat-free (lean) mass in relation to height',
      },
      { id: 'C', label: 'Blood pressure risk categories' },
      { id: 'D', label: 'Only visceral fat around organs' },
    ],
    correctAnswer: 'B',
    explanation:
      'FFMI indexes fat-free mass against height (kg/m²), not calories or blood pressure.',
    provenance: 'original_new',
  },
  {
    id: 'q3',
    number: 3,
    prompt: 'Who benefits most from using FFMI instead of BMI?',
    options: [
      { id: 'A', label: 'People comparing height alone with no weight data' },
      {
        id: 'B',
        label: 'Trained or athletic people with more muscle than average',
      },
      { id: 'C', label: 'Only infants under one year of age' },
      { id: 'D', label: 'Anyone who refuses to measure height' },
    ],
    correctAnswer: 'B',
    explanation:
      'BMI treats all weight equally; FFMI is especially useful when muscle mass is high.',
    provenance: 'original_new',
  },
  {
    id: 'q4',
    number: 4,
    prompt: 'Why can BMI misclassify a muscular athlete?',
    options: [
      {
        id: 'A',
        label: 'BMI ignores height, so tall athletes always score low',
      },
      {
        id: 'B',
        label:
          'BMI does not distinguish muscle from fat, so extra muscle can raise BMI',
      },
      { id: 'C', label: 'BMI only works when body fat is exactly 10%' },
      { id: 'D', label: 'BMI requires a DEXA scan that athletes never get' },
    ],
    correctAnswer: 'B',
    explanation:
      'BMI uses weight and height only, so dense muscle can look like “overweight.”',
    provenance: 'original_new',
  },
  {
    id: 'q5',
    number: 5,
    prompt: 'Besides height and weight, what input does FFMI calculation need?',
    options: [
      { id: 'A', label: 'Resting heart rate in bpm' },
      { id: 'B', label: 'Body fat percentage' },
      { id: 'C', label: 'Daily step count' },
      { id: 'D', label: 'Blood sodium in mEq/L' },
    ],
    correctAnswer: 'B',
    explanation:
      'Fat-free mass is estimated as weight × (1 − body-fat%/100), so body fat % is required.',
    provenance: 'original_new',
  },
  {
    id: 'q6',
    number: 6,
    prompt:
      'If height and body fat stay the same, what happens to FFMI when muscle mass increases?',
    options: [
      { id: 'A', label: 'FFMI decreases' },
      { id: 'B', label: 'FFMI stays exactly the same' },
      { id: 'C', label: 'FFMI increases' },
      { id: 'D', label: 'FFMI becomes undefined' },
    ],
    correctAnswer: 'C',
    explanation:
      'More fat-free mass at the same height raises FFMI = FFM / height².',
    provenance: 'original_new',
  },
  {
    id: 'q7',
    number: 7,
    prompt:
      'On the common educational male FFMI bands, which range is labeled “excellent”?',
    options: [
      { id: 'A', label: 'Below 18' },
      { id: 'B', label: '18–20' },
      { id: 'C', label: '22–23' },
      { id: 'D', label: 'More than 28' },
    ],
    correctAnswer: 'C',
    explanation:
      'Teaching bands often mark male FFMI 22–23 as excellent (educational, not diagnostic).',
    provenance: 'original_new',
  },
  {
    id: 'q8',
    number: 8,
    prompt:
      'On the common educational female FFMI bands, which range is labeled “superior”?',
    options: [
      { id: 'A', label: 'Below 15' },
      { id: 'B', label: '15–17' },
      { id: 'C', label: '19–21.5' },
      { id: 'D', label: 'More than 25' },
    ],
    correctAnswer: 'C',
    explanation:
      'Teaching bands often mark female FFMI 19–21.5 as superior (educational ranges).',
    provenance: 'original_new',
  },
] as const;

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;

/** Companion numeric tool — link when that catalog route is live. */
export const FFMI_CALCULATOR_HREF =
  '/tools/ffmi-calculator-fat-free-mass-index';
