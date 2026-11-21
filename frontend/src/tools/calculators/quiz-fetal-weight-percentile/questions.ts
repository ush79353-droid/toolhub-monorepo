import type { QuizQuestion } from './types';

/**
 * Five-question educational bank matching the task screenshot for
 * Quiz: Fetal Weight Percentile. Correct answers keyed by option id.
 * Explanations cite common fetal growth chart / Hadlock EFW concepts.
 */
export const QUIZ_MAX_SCORE = 5;

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    prompt: 'What does a percentile tell you during pregnancy?',
    options: [
      { id: 'A', label: 'The baby’s exact birth weight' },
      {
        id: 'B',
        label:
          'How the baby’s weight or size compares to other babies of the same age and sex',
      },
      { id: 'C', label: 'The baby’s blood sugar level' },
    ],
    correctAnswer: 'B',
    explanation:
      'A fetal weight percentile places estimated size on a reference growth chart versus peers of similar gestational age (and sex when the chart supports it). It is not an exact birth weight or a glucose reading.',
  },
  {
    id: 'q2',
    number: 2,
    prompt: 'What does it mean if a baby is at the 10th percentile?',
    options: [
      { id: 'A', label: 'The baby is larger than 90% of babies' },
      {
        id: 'B',
        label: 'The baby is among the 10% smallest babies in the population',
      },
      { id: 'C', label: 'The baby will definitely be born prematurely' },
    ],
    correctAnswer: 'B',
    explanation:
      'The 10th percentile means roughly 10% of the reference population are at or below that weight for the same gestational age/sex band. It does not by itself prove prematurity or that the baby is larger than 90%.',
  },
  {
    id: 'q3',
    number: 3,
    prompt: "On a general growth curve, what is considered the 'average' percentile?",
    options: [
      { id: 'A', label: '25th percentile' },
      { id: 'B', label: '50th percentile' },
      { id: 'C', label: '75th percentile' },
    ],
    correctAnswer: 'B',
    explanation:
      'The 50th percentile is the median of the reference population—commonly described as average on a general growth curve.',
  },
  {
    id: 'q4',
    number: 4,
    prompt:
      'Which ultrasound measurements are commonly used to estimate fetal weight (Hadlock formula)?',
    options: [
      {
        id: 'A',
        label:
          'Lung size, kidney size, umbilical cord length, maternal weight',
      },
      {
        id: 'B',
        label:
          'Foot length, arm circumference, heart rate, placenta thickness',
      },
      {
        id: 'C',
        label:
          'Femur length, abdominal circumference, biparietal diameter, head circumference',
      },
    ],
    correctAnswer: 'C',
    explanation:
      'Hadlock-style estimated fetal weight models commonly combine biparietal diameter (BPD), head circumference (HC), abdominal circumference (AC), and femur length (FL).',
  },
  {
    id: 'q5',
    number: 5,
    prompt: 'Why are fetal weight percentiles important near the end of pregnancy?',
    options: [
      {
        id: 'A',
        label:
          'They help decide the follow-up and plan how delivery may be managed',
      },
      {
        id: 'B',
        label: "They determine the baby's future height as an adult",
      },
      {
        id: 'C',
        label: 'They replace the need for third-trimester ultrasound',
      },
    ],
    correctAnswer: 'A',
    explanation:
      'Late-pregnancy centiles help clinicians judge whether closer follow-up or delivery planning is warranted. They do not set adult height and never replace needed ultrasound assessment.',
  },
];
