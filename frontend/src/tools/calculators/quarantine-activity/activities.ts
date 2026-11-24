/**
 * Activity MET table — Omni Quarantine Activity Calculator dataset values
 * (Compendium-style METs used by that tool).
 */

export interface QuarantineMetActivity {
  id: string;
  label: string;
  met: number;
}

export const QUARANTINE_ACTIVITIES: readonly QuarantineMetActivity[] = [
  { id: 'aerobics', label: '💃 Aerobics', met: 6.83 },
  { id: 'baseball', label: '⛹️ Baseball, softball', met: 5 },
  { id: 'basketball', label: '⛹️ Basketball', met: 8 },
  { id: 'billiards', label: '🎱 Billiards', met: 2.5 },
  { id: 'bowling', label: '🎳 Bowling', met: 3 },
  { id: 'cycling', label: '🚲 Cycling', met: 9.5 },
  { id: 'dancing', label: '💃 Dancing', met: 4.5 },
  { id: 'fishing', label: '🎣 Fishing', met: 4.5 },
  { id: 'football-american', label: '🏈 Football (American)', met: 8 },
  { id: 'football-soccer', label: '⚽ Football (soccer)', met: 7 },
  { id: 'golfing', label: '⛳ Golfing', met: 3.75 },
  { id: 'gymnastics', label: '🎽 Gymnastics', met: 4 },
  { id: 'hiking', label: '⛰️ Hiking', met: 6 },
  { id: 'martial-arts', label: '🙏 Martial arts', met: 10 },
  { id: 'racquet', label: '🎾 Racquet sports', met: 8.5 },
  { id: 'rollerblading', label: '🦶 Rollerblading', met: 6 },
  { id: 'rugby', label: '🏉 Rugby', met: 10 },
  { id: 'running', label: '🏃 Running', met: 9.8 },
  { id: 'sex', label: '🏩 Sex', met: 5.8 },
  { id: 'sleeping', label: '💤 Sleeping', met: 1 },
  { id: 'stair-climbing', label: '📶 Stair climbing', met: 4 },
  { id: 'standing', label: '🧍 Standing', met: 1.5 },
  { id: 'swimming', label: '🏊 Swimming', met: 8 },
  { id: 'cardio-equipment', label: '❤️ Using cardiovascular equipment', met: 8 },
  { id: 'volleyball', label: '✋ Volleyball', met: 5.5 },
  { id: 'walking', label: '🚶 Walking', met: 3.8 },
  { id: 'watching-tv', label: '📺 Watching tv', met: 1 },
  { id: 'weightlifting', label: '💪 Weightlifting/strength training', met: 3 },
  { id: 'workout-light', label: '🧘 Workout - light (e.g. stretching)', met: 2.3 },
  { id: 'workout-moderate', label: '🏋️ Workout - moderate (e.g. cardio)', met: 4 },
  { id: 'workout-vigorous', label: '🤸 Workout - vigorous (e.g. HIIT)', met: 6 },
  { id: 'yoga', label: '🧘 Yoga', met: 3 },
] as const;

const BY_ID = new Map(QUARANTINE_ACTIVITIES.map((a) => [a.id, a]));

export function activityById(id: string): QuarantineMetActivity | undefined {
  if (!id) return undefined;
  return BY_ID.get(id);
}
