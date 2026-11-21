/**
 * Curated MET table — 2011 Compendium of Physical Activities (Ainsworth et al.).
 * Labels follow common calculator.net-style grouping; METs match compendium codes.
 */

export type ActivityGroup =
  | 'Walking'
  | 'Running'
  | 'Cycling'
  | 'Aerobics'
  | 'Sports'
  | 'Outdoor'
  | 'Home';

export type DistanceKind = 'walk' | 'run' | 'cycle';

export interface CalorieActivity {
  id: string;
  label: string;
  group: ActivityGroup;
  met: number;
  distanceKind?: DistanceKind;
  speedMph?: number;
}

export const ACTIVITY_GROUP_ORDER: readonly ActivityGroup[] = [
  'Walking',
  'Running',
  'Cycling',
  'Aerobics',
  'Sports',
  'Outdoor',
  'Home',
] as const;

export const CALORIE_ACTIVITIES: readonly CalorieActivity[] = [
  // Walking — Compendium ch. 17 (17120–17290)
  {
    id: 'walk-20',
    label: 'Walking, 2.0 mph, level, slow pace',
    group: 'Walking',
    met: 2.8,
    distanceKind: 'walk',
    speedMph: 2.0,
  },
  {
    id: 'walk-25',
    label: 'Walking, 2.5 mph',
    group: 'Walking',
    met: 3.0,
    distanceKind: 'walk',
    speedMph: 2.5,
  },
  {
    id: 'walk-30',
    label: 'Walking, 3.0 mph, moderate pace',
    group: 'Walking',
    met: 3.3,
    distanceKind: 'walk',
    speedMph: 3.0,
  },
  {
    id: 'walk-35',
    label: 'Walking, 3.5 mph, brisk',
    group: 'Walking',
    met: 3.8,
    distanceKind: 'walk',
    speedMph: 3.5,
  },
  {
    id: 'walk-40',
    label: 'Walking, 4.0 mph, very brisk',
    group: 'Walking',
    met: 5.0,
    distanceKind: 'walk',
    speedMph: 4.0,
  },
  {
    id: 'walk-45',
    label: 'Walking, 4.5 mph',
    group: 'Walking',
    met: 6.3,
    distanceKind: 'walk',
    speedMph: 4.5,
  },
  {
    id: 'walk-uphill',
    label: 'Walking, 3.5 mph, uphill',
    group: 'Walking',
    met: 6.0,
  },
  {
    id: 'walk-stairs',
    label: 'Walking up stairs',
    group: 'Walking',
    met: 8.8,
  },

  // Running — Compendium ch. 12 (12030–12190)
  {
    id: 'run-50',
    label: 'Running, 5 mph (12 min/mile)',
    group: 'Running',
    met: 8.3,
    distanceKind: 'run',
    speedMph: 5.0,
  },
  {
    id: 'run-55',
    label: 'Running, 5.2 mph (11.5 min/mile)',
    group: 'Running',
    met: 9.0,
    distanceKind: 'run',
    speedMph: 5.2,
  },
  {
    id: 'run-60',
    label: 'Running, 6 mph (10 min/mile)',
    group: 'Running',
    met: 9.8,
    distanceKind: 'run',
    speedMph: 6.0,
  },
  {
    id: 'run-67',
    label: 'Running, 6.7 mph (9 min/mile)',
    group: 'Running',
    met: 10.5,
    distanceKind: 'run',
    speedMph: 6.7,
  },
  {
    id: 'run-70',
    label: 'Running, 7 mph (8.5 min/mile)',
    group: 'Running',
    met: 11.0,
    distanceKind: 'run',
    speedMph: 7.0,
  },
  {
    id: 'run-75',
    label: 'Running, 7.5 mph (8 min/mile)',
    group: 'Running',
    met: 11.5,
    distanceKind: 'run',
    speedMph: 7.5,
  },
  {
    id: 'run-80',
    label: 'Running, 8 mph (7.5 min/mile)',
    group: 'Running',
    met: 11.8,
    distanceKind: 'run',
    speedMph: 8.0,
  },
  {
    id: 'run-86',
    label: 'Running, 8.6 mph (7 min/mile)',
    group: 'Running',
    met: 12.3,
    distanceKind: 'run',
    speedMph: 8.6,
  },
  {
    id: 'run-90',
    label: 'Running, 9 mph (6.5 min/mile)',
    group: 'Running',
    met: 12.8,
    distanceKind: 'run',
    speedMph: 9.0,
  },
  {
    id: 'run-100',
    label: 'Running, 10 mph (6 min/mile)',
    group: 'Running',
    met: 14.5,
    distanceKind: 'run',
    speedMph: 10.0,
  },
  {
    id: 'run-jog',
    label: 'Jogging, general',
    group: 'Running',
    met: 7.0,
    distanceKind: 'run',
    speedMph: 5.0,
  },

  // Cycling — Compendium ch. 01 (01010–01070)
  {
    id: 'cycle-leisure',
    label: 'Cycling, <10 mph, leisure',
    group: 'Cycling',
    met: 4.0,
    distanceKind: 'cycle',
    speedMph: 9.0,
  },
  {
    id: 'cycle-11',
    label: 'Cycling, 10–11.9 mph, light effort',
    group: 'Cycling',
    met: 6.0,
    distanceKind: 'cycle',
    speedMph: 11.0,
  },
  {
    id: 'cycle-13',
    label: 'Cycling, 12–13.9 mph, moderate',
    group: 'Cycling',
    met: 8.0,
    distanceKind: 'cycle',
    speedMph: 13.0,
  },
  {
    id: 'cycle-15',
    label: 'Cycling, 14–15.9 mph, vigorous',
    group: 'Cycling',
    met: 10.0,
    distanceKind: 'cycle',
    speedMph: 15.0,
  },
  {
    id: 'cycle-17',
    label: 'Cycling, 16–19 mph, racing / training',
    group: 'Cycling',
    met: 12.0,
    distanceKind: 'cycle',
    speedMph: 17.5,
  },
  {
    id: 'cycle-20',
    label: 'Cycling, >20 mph, racing',
    group: 'Cycling',
    met: 16.0,
    distanceKind: 'cycle',
    speedMph: 22.0,
  },
  {
    id: 'cycle-stationary-moderate',
    label: 'Bicycling, stationary, moderate',
    group: 'Cycling',
    met: 7.0,
  },

  // Aerobics — Compendium ch. 02 (02101–02115, 02060)
  {
    id: 'aerobics-water',
    label: 'Water aerobics',
    group: 'Aerobics',
    met: 5.5,
  },
  {
    id: 'aerobics-low',
    label: 'Aerobics, low impact',
    group: 'Aerobics',
    met: 5.0,
  },
  {
    id: 'aerobics-high',
    label: 'Aerobics, high impact',
    group: 'Aerobics',
    met: 7.3,
  },
  {
    id: 'aerobics-step',
    label: 'Step aerobics, moderate',
    group: 'Aerobics',
    met: 7.5,
  },
  {
    id: 'aerobics-dance',
    label: 'Aerobic dance',
    group: 'Aerobics',
    met: 7.3,
  },
  {
    id: 'aerobics-general',
    label: 'Calisthenics (exercise, moderate)',
    group: 'Aerobics',
    met: 3.8,
  },

  // Sports
  {
    id: 'sport-basketball',
    label: 'Basketball, game',
    group: 'Sports',
    met: 8.0,
  },
  {
    id: 'sport-soccer',
    label: 'Soccer, casual',
    group: 'Sports',
    met: 7.0,
  },
  {
    id: 'sport-tennis',
    label: 'Tennis, singles',
    group: 'Sports',
    met: 8.0,
  },
  {
    id: 'sport-volleyball',
    label: 'Volleyball, non-competitive',
    group: 'Sports',
    met: 4.0,
  },
  {
    id: 'sport-golf',
    label: 'Golf, walking and carrying clubs',
    group: 'Sports',
    met: 4.8,
  },
  {
    id: 'sport-swim-mod',
    label: 'Swimming, moderate effort',
    group: 'Sports',
    met: 6.0,
  },
  {
    id: 'sport-swim-vig',
    label: 'Swimming, vigorous',
    group: 'Sports',
    met: 9.8,
  },
  {
    id: 'sport-weight',
    label: 'Weight lifting, vigorous',
    group: 'Sports',
    met: 6.0,
  },
  {
    id: 'sport-boxing',
    label: 'Boxing, punching bag',
    group: 'Sports',
    met: 7.8,
  },

  // Outdoor
  {
    id: 'outdoor-hike',
    label: 'Hiking, cross country',
    group: 'Outdoor',
    met: 6.0,
  },
  {
    id: 'outdoor-climb',
    label: 'Rock climbing, ascending',
    group: 'Outdoor',
    met: 8.0,
  },
  {
    id: 'outdoor-ski-down',
    label: 'Skiing, downhill, moderate',
    group: 'Outdoor',
    met: 5.3,
  },
  {
    id: 'outdoor-canoe',
    label: 'Canoeing, rowing, moderate',
    group: 'Outdoor',
    met: 5.0,
  },
  {
    id: 'outdoor-yard',
    label: 'Gardening, general',
    group: 'Outdoor',
    met: 4.0,
  },

  // Home
  {
    id: 'home-clean',
    label: 'Cleaning house, general',
    group: 'Home',
    met: 3.5,
  },
  {
    id: 'home-mow',
    label: 'Mowing lawn, power mower',
    group: 'Home',
    met: 5.5,
  },
  {
    id: 'home-cook',
    label: 'Cooking or food preparation',
    group: 'Home',
    met: 2.5,
  },
  {
    id: 'home-child',
    label: 'Playing with children, moderate',
    group: 'Home',
    met: 4.0,
  },
] as const;

export function activityById(id: string): CalorieActivity | null {
  if (!id) return null;
  return CALORIE_ACTIVITIES.find((a) => a.id === id) ?? null;
}

export function activitySupportsDistance(activity: CalorieActivity | null): boolean {
  return (
    activity != null &&
    activity.distanceKind != null &&
    activity.speedMph != null &&
    activity.speedMph > 0
  );
}

export function activitiesGrouped(): Map<ActivityGroup, CalorieActivity[]> {
  const map = new Map<ActivityGroup, CalorieActivity[]>();
  for (const group of ACTIVITY_GROUP_ORDER) {
    map.set(
      group,
      CALORIE_ACTIVITIES.filter((a) => a.group === group),
    );
  }
  return map;
}