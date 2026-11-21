# Levothyroxine Dosage Calculator — AGENT STATUS

**Status:** BLOCKED  
**Agent:** cursor-composer-continuous-20261122-014915-25180  
**Claimed:** 2026-11-22 via atomic `Directory.Move` `Tools/` → `In Progress/`  
**MongoDB:** pending reconfirm on unblock (catalog name present; assign not run)  
**Slug (expected):** `levothyroxine-dosage-calculator`  
**componentKey:** (none)  
**isDeveloped:** false · **isActive:** false · **indexable:** false  

## Blocker

Task `prompt.txt` explicitly requires:

> No personalized prescription engine from these inputs. Require approved indication, lab definitions, source guideline, specialist review and documented population exclusions before exposing a dose. Keep unsupported or incomplete cases educational and never infer clinical data.

Screenshot shows a **Levothyroxine dose (mcg per day)** result driven by sex, age band, weight, height, FT4 low/normal, and heart disease. Shipping that output without documented specialist review / approved indication+lab package would violate the task gate and medical-safety guidance.

ATA/AACE-style mcg/kg educational heuristics are insufficient to satisfy the prompt’s **specialist review** requirement.

## Actions taken

- Spec + screenshot read.
- No calculator module, registry, commits, or `tool:assign`.
- Folder retained in `In Progress`.

## Next step when unblocked

Obtain documented clinical review approval (or authorized educational-only scope change without mcg/day prescription output), then develop under ADR-018/019/022/023.
