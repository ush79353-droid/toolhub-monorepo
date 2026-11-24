/**
 * Parent→child ABO/Rh inheritance with uniform priors over compatible genotypes (ADR-018).
 *
 * Phenotype alone does not fix genotype (e.g. type A may be AA or AO). This engine
 * enumerates all compatible diploid genotypes per parent, assumes equal weight among
 * each parent's possibilities, crosses gametes (½ per heterozygous locus), then aggregates.
 */

import type {
  AboPhenotype,
  AboProbabilities,
  BloodType,
  BloodTypeInput,
  BloodTypeResult,
  PunnettCell,
  PunnettSquare,
  RhProbabilities,
} from './types';

export const DISCLAIMER =
  'Educational Mendelian model only. Real blood typing involves weak D, cis-AB, Bombay, and testing—not guesswork from parents’ reported types.';

type AboAllele = 'A' | 'B' | 'O';
type RhAllele = 'D' | 'd';

interface InternalGenotype {
  abo: [AboAllele, AboAllele];
  rh: [RhAllele, RhAllele];
}

interface Gamete {
  abo: AboAllele;
  rh: RhAllele;
  probability: number;
}

function parseBloodType(type: BloodType): {
  abo: AboPhenotype;
  rhPositive: boolean;
} {
  const rhPositive = type.endsWith('+');
  const abo = type.slice(0, -1) as AboPhenotype;
  return { abo, rhPositive };
}

function aboGenotypesForPhenotype(phenotype: AboPhenotype): [AboAllele, AboAllele][] {
  switch (phenotype) {
    case 'A':
      return [
        ['A', 'A'],
        ['A', 'O'],
      ];
    case 'B':
      return [
        ['B', 'B'],
        ['B', 'O'],
      ];
    case 'AB':
      return [['A', 'B']];
    case 'O':
      return [['O', 'O']];
  }
}

function rhGenotypesForPhenotype(rhPositive: boolean): [RhAllele, RhAllele][] {
  return rhPositive
    ? [
        ['D', 'D'],
        ['D', 'd'],
      ]
    : [['d', 'd']];
}

function compatibleGenotypes(type: BloodType): InternalGenotype[] {
  const { abo, rhPositive } = parseBloodType(type);
  const aboList = aboGenotypesForPhenotype(abo);
  const rhList = rhGenotypesForPhenotype(rhPositive);
  const out: InternalGenotype[] = [];
  for (const aboGen of aboList) {
    for (const rhGen of rhList) {
      out.push({ abo: aboGen, rh: rhGen });
    }
  }
  return out;
}

function aboPhenotypeFromAlleles(a: AboAllele, b: AboAllele): AboPhenotype {
  const alleles = new Set([a, b]);
  if (alleles.has('A') && alleles.has('B')) return 'AB';
  if (alleles.has('A')) return 'A';
  if (alleles.has('B')) return 'B';
  return 'O';
}

function rhPositiveFromAlleles(a: RhAllele, b: RhAllele): boolean {
  return a === 'D' || b === 'D';
}

function gametes(genotype: InternalGenotype): Gamete[] {
  const aboOut: { allele: AboAllele; p: number }[] = [];
  const rhOut: { allele: RhAllele; p: number }[] = [];

  if (genotype.abo[0] === genotype.abo[1]) {
    aboOut.push({ allele: genotype.abo[0], p: 1 });
  } else {
    aboOut.push({ allele: genotype.abo[0], p: 0.5 });
    aboOut.push({ allele: genotype.abo[1], p: 0.5 });
  }

  if (genotype.rh[0] === genotype.rh[1]) {
    rhOut.push({ allele: genotype.rh[0], p: 1 });
  } else {
    rhOut.push({ allele: genotype.rh[0], p: 0.5 });
    rhOut.push({ allele: genotype.rh[1], p: 0.5 });
  }

  const result: Gamete[] = [];
  for (const a of aboOut) {
    for (const r of rhOut) {
      result.push({
        abo: a.allele,
        rh: r.allele,
        probability: a.p * r.p,
      });
    }
  }
  return result;
}

function aboGenotypeLabel(a: AboAllele, b: AboAllele): string {
  const sorted = [a, b].sort((x, y) => x.localeCompare(y));
  return sorted.join('');
}

function crossPair(
  mother: InternalGenotype,
  father: InternalGenotype,
): {
  abo: AboProbabilities;
  rh: RhProbabilities;
} {
  const mGametes = gametes(mother);
  const fGametes = gametes(father);
  const aboCounts: Record<AboPhenotype, number> = { A: 0, B: 0, AB: 0, O: 0 };
  let rhPos = 0;
  let total = 0;

  for (const mg of mGametes) {
    for (const fg of fGametes) {
      const p = mg.probability * fg.probability;
      total += p;
      const phen = aboPhenotypeFromAlleles(mg.abo, fg.abo);
      aboCounts[phen] += p;
      if (rhPositiveFromAlleles(mg.rh, fg.rh)) rhPos += p;
    }
  }

  return {
    abo: {
      A: (aboCounts.A / total) * 100,
      B: (aboCounts.B / total) * 100,
      AB: (aboCounts.AB / total) * 100,
      O: (aboCounts.O / total) * 100,
    },
    rh: {
      positive: (rhPos / total) * 100,
      negative: ((total - rhPos) / total) * 100,
    },
  };
}

function aggregateProbabilities(
  motherType: BloodType,
  fatherType: BloodType,
): { abo: AboProbabilities; rh: RhProbabilities } {
  const motherGenotypes = compatibleGenotypes(motherType);
  const fatherGenotypes = compatibleGenotypes(fatherType);
  const weight = 1 / (motherGenotypes.length * fatherGenotypes.length);

  const acc: AboProbabilities = { A: 0, B: 0, AB: 0, O: 0 };
  let rhPos = 0;

  for (const m of motherGenotypes) {
    for (const f of fatherGenotypes) {
      const { abo, rh } = crossPair(m, f);
      for (const key of Object.keys(acc) as (keyof AboProbabilities)[]) {
        acc[key] += abo[key] * weight;
      }
      rhPos += rh.positive * weight;
    }
  }

  return {
    abo: acc,
    rh: {
      positive: rhPos,
      negative: 100 - rhPos,
    },
  };
}

function representativeAboPunnett(
  motherType: BloodType,
  fatherType: BloodType,
): PunnettSquare | null {
  const motherABO = parseBloodType(motherType).abo;
  const fatherABO = parseBloodType(fatherType).abo;

  const motherGameteAlleles: AboAllele[] =
    motherABO === 'A'
      ? ['A', 'O']
      : motherABO === 'B'
        ? ['B', 'O']
        : motherABO === 'AB'
          ? ['A', 'B']
          : ['O'];

  const fatherGameteAlleles: AboAllele[] =
    fatherABO === 'A'
      ? ['A', 'O']
      : fatherABO === 'B'
        ? ['B', 'O']
        : fatherABO === 'AB'
          ? ['A', 'B']
          : ['O'];

  const rowLabels = fatherGameteAlleles.map((a) => a);
  const columnLabels = motherGameteAlleles.map((a) => a);

  const cells: PunnettCell[][] = rowLabels.map((fAllele) =>
    columnLabels.map((mAllele) => {
      const phenotype = aboPhenotypeFromAlleles(mAllele, fAllele);
      const genotype = aboGenotypeLabel(mAllele, fAllele);
      const p =
        motherGameteAlleles.length * fatherGameteAlleles.length > 0
          ? 100 / (motherGameteAlleles.length * fatherGameteAlleles.length)
          : 0;
      void phenotype;
      return { genotype, probability: p };
    }),
  );

  const caption =
    'ABO alleles from heterozygous parent types (e.g. A may be AO). Percentages above average equal priors over all compatible parent genotypes and Rh status.';

  return {
    rowLabels,
    columnLabels,
    cells: cells as PunnettCell[][],
    caption,
  };
}

function genotypeNote(type: BloodType, role: 'mother' | 'father'): string {
  const gens = compatibleGenotypes(type);
  const labels = gens.map(
    (g) => `${aboGenotypeLabel(g.abo[0], g.abo[1])} / ${g.rh.join('')}`,
  );
  const { abo, rhPositive } = parseBloodType(type);
  if (gens.length === 1) {
    return `${role === 'mother' ? 'Mother' : 'Father'} ${abo} Rh${rhPositive ? '+' : '−'}: genotype ${labels[0]}.`;
  }
  return `${role === 'mother' ? 'Mother' : 'Father'} ${abo} Rh${rhPositive ? '+' : '−'}: equally likely among ${labels.join(', ')} (${gens.length} possibilities).`;
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value * 10) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
}

export function calculateBloodType(input: BloodTypeInput): BloodTypeResult {
  if (!input.motherBloodType || !input.fatherBloodType) {
    return {
      abo: null,
      rh: null,
      punnett: null,
      motherGenotypeNote: '',
      fatherGenotypeNote: '',
      statusHeadline: 'Select both parents’ blood types',
      statusDetail:
        'Choose mother and father ABO/Rh types to estimate offspring phenotype probabilities under a standard two-locus Mendelian model.',
      disclaimer: DISCLAIMER,
    };
  }

  const { abo, rh } = aggregateProbabilities(
    input.motherBloodType,
    input.fatherBloodType,
  );

  return {
    abo,
    rh,
    punnett: representativeAboPunnett(
      input.motherBloodType,
      input.fatherBloodType,
    ),
    motherGenotypeNote: genotypeNote(input.motherBloodType, 'mother'),
    fatherGenotypeNote: genotypeNote(input.fatherBloodType, 'father'),
    statusHeadline: 'Offspring blood type chances',
    statusDetail: `Mother ${input.motherBloodType}, father ${input.fatherBloodType} — ABO and Rh chances use equal weighting over each parent’s compatible genotypes.`,
    disclaimer: DISCLAIMER,
  };
}