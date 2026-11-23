# AGENT STATUS — Stillbirth Risk Calculator

**Status:** BLOCKED
**Claimed by:** cursor-composer-continuous-20261123-233300
**Date:** 2026-11-23

## Blocker
Screenshot UI matches Omni-style US ethnicity radios and baseline **0.2197%**, but the task prompt forbids multiplying isolated published odds ratios by that baseline and requires original intercept/coefficients/link function with validated calibration.

Available peer-reviewed options do not reconcile safely:
- FMF demographic model (Yerke et al. / FMF calculator): different ethnicity taxonomy (Afro-Caribbean/South Asian/etc.), different inputs (parity/prior stillbirth structure), not the screenshot field set.
- Yerke/PLOS 2017 US logistic model: different predictors and horizon (≥32 weeks), missing screenshot ART/SLE/APS/alcohol split as specified.
- Omni-style OR×baseline: explicitly disallowed by prompt.

Mongo catalog exists (`6af46f10a27d8d1d4e990225`, slug `stillbirth-risk-calculator`) undeveloped/inactive/indexable false — left unchanged.

**No implementation shipped. No activation.**
