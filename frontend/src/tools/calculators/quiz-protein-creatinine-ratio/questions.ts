import type { QuizQuestion } from './types';

/**
 * Five-question bank for Quiz: Protein Creatinine Ratio Calculator.
 *
 * Wording + distractors: Screenshot 2026-11-25 002935.png (ADR-023).
 * Correct concepts (prompt): kidney health; normalize urine concentration;
 * protein leakage; kidneys; urine.
 *
 * Distinct from the numeric Protein Creatinine Ratio Calculator module.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    prompt:
      'What does the protein-to-creatinine ratio (PCR) mainly help doctors check?',
    options: [
      { id: 'A', label: 'Lung function' },
      { id: 'B', label: 'Kidney health' },
      { id: 'C', label: 'Blood sugar levels' },
    ],
    correctAnswer: 'B',
    explanation:
      'PCR / UPCR is used to screen for proteinuria and support kidney-health assessment.',
    provenance: 'screenshot',
  },
  {
    id: 'q2',
    number: 2,
    prompt: 'Creatinine in urine is useful in PCR because it helps:',
    options: [
      { id: 'A', label: 'Add flavor to the test sample' },
      { id: 'B', label: 'Balance protein measurement for accuracy' },
      { id: 'C', label: 'Change urine color' },
    ],
    correctAnswer: 'B',
    explanation:
      'Creatinine normalizes for urine concentration so the protein result is more comparable across samples.',
    provenance: 'screenshot',
  },
  {
    id: 'q3',
    number: 3,
    prompt: 'A high protein-creatinine ratio usually means:',
    options: [
      { id: 'A', label: 'Kidneys may be leaking protein' },
      { id: 'B', label: 'You drank too much water' },
      { id: 'C', label: 'Your bones are getting stronger' },
    ],
    correctAnswer: 'A',
    explanation:
      'An elevated ratio suggests possible protein leakage into urine and needs clinical follow-up.',
    provenance: 'screenshot',
  },
  {
    id: 'q4',
    number: 4,
    prompt:
      'Which organ is primarily responsible for filtering protein from the blood?',
    options: [
      { id: 'A', label: 'Liver' },
      { id: 'B', label: 'Heart' },
      { id: 'C', label: 'Kidneys' },
    ],
    correctAnswer: 'C',
    explanation:
      'Healthy kidneys filter blood and normally keep most protein in the bloodstream.',
    provenance: 'screenshot',
  },
  {
    id: 'q5',
    number: 5,
    prompt:
      'Which type of sample is most commonly used to measure the protein-creatinine ratio?',
    options: [
      { id: 'A', label: 'Blood sample' },
      { id: 'B', label: 'Urine sample' },
      { id: 'C', label: 'Saliva sample' },
    ],
    correctAnswer: 'B',
    explanation:
      'UPCR / PCR is measured on a urine specimen (often a spot sample).',
    provenance: 'screenshot',
  },
] as const;

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;

/** Companion numeric tool — never reuse its Mongo identity or componentKey. */
export const PROTEIN_CREATININE_RATIO_CALCULATOR_HREF =
  '/tools/protein-creatinine-ratio-calculator';

export const URINE_OUTPUT_CALCULATOR_HREF = '/tools/urine-output-calculator';
