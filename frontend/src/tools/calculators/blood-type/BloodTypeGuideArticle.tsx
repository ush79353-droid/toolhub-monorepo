export function BloodTypeGuideArticle() {
  return (
    <article className="prose prose-neutral max-w-none">
      <p id="introduction">
        This tool estimates how likely each ABO group and Rh factor is for a biological
        child given the mother’s and father’s reported blood types. It uses standard
        two-locus Mendelian inheritance with equal weighting whenever a phenotype can
        stem from more than one genotype (for example, type A as AA or AO).
      </p>
      <p id="inheritance">
        Reported percentages are educational projections, not genetic counseling. Rare
        alleles, weak Rh, and laboratory confirmation are outside this model. When both
        parents are type O, every child is type O for ABO; when one parent is AB and the
        other O, children are A or B only, never AB or O.
      </p>
    </article>
  );
}