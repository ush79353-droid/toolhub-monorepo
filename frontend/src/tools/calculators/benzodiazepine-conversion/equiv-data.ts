/** Approximate mg of each drug equivalent to 10 mg oral diazepam (educational). */

export type BenzoDuration = 'short' | 'intermediate' | 'long';
export type BenzoRoute = 'po' | 'iv';

export interface BenzoDrug {
  id: string;
  label: string;
  duration: BenzoDuration;
  route: BenzoRoute;
  /** mg of this drug ≈ 10 mg diazepam PO */
  mgPerTenMgDiazepam: number;
}

export const BENZO_DRUGS: readonly BenzoDrug[] = [
  { id: 'midazolam_iv', label: 'Midazolam IV (Versed)', duration: 'short', route: 'iv', mgPerTenMgDiazepam: 5 },
  { id: 'midazolam_po', label: 'Midazolam PO', duration: 'short', route: 'po', mgPerTenMgDiazepam: 10 },
  { id: 'oxazepam', label: 'Oxazepam (Serax)', duration: 'short', route: 'po', mgPerTenMgDiazepam: 20 },
  { id: 'secobarbital', label: 'Secobarbital (Seconal)', duration: 'short', route: 'po', mgPerTenMgDiazepam: 50 },
  { id: 'triazolam', label: 'Triazolam (Halcion)', duration: 'short', route: 'po', mgPerTenMgDiazepam: 0.25 },
  { id: 'alprazolam', label: 'Alprazolam (Xanax)', duration: 'intermediate', route: 'po', mgPerTenMgDiazepam: 0.5 },
  { id: 'lorazepam', label: 'Lorazepam (Ativan)', duration: 'intermediate', route: 'po', mgPerTenMgDiazepam: 1 },
  { id: 'phenobarbital', label: 'Phenobarbital', duration: 'intermediate', route: 'po', mgPerTenMgDiazepam: 30 },
  { id: 'temazepam', label: 'Temazepam (Restoril)', duration: 'intermediate', route: 'po', mgPerTenMgDiazepam: 10 },
  { id: 'bromazepam', label: 'Bromazepam (Lexotan)', duration: 'long', route: 'po', mgPerTenMgDiazepam: 3 },
  { id: 'chlordiazepoxide', label: 'Chlordiazepoxide (Librium)', duration: 'long', route: 'po', mgPerTenMgDiazepam: 25 },
  { id: 'clonazepam', label: 'Clonazepam (Klonopin)', duration: 'long', route: 'po', mgPerTenMgDiazepam: 0.5 },
  { id: 'clorazepate', label: 'Clorazepate (Tranxene)', duration: 'long', route: 'po', mgPerTenMgDiazepam: 7.5 },
  { id: 'diazepam', label: 'Diazepam (Valium)', duration: 'long', route: 'po', mgPerTenMgDiazepam: 10 },
  { id: 'flurazepam', label: 'Flurazepam (Dalmane)', duration: 'long', route: 'po', mgPerTenMgDiazepam: 15 },
  { id: 'quazepam', label: 'Quazepam (Doral)', duration: 'long', route: 'po', mgPerTenMgDiazepam: 10 },
];

export function drugById(id: string): BenzoDrug | undefined {
  return BENZO_DRUGS.find((d) => d.id === id);
}