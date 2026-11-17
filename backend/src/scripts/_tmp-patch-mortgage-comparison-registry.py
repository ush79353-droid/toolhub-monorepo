from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")
    print("patched", path.relative_to(ROOT))


def ensure_key_lists() -> None:
    for rel in [
        "frontend/src/tools/registry/keys.ts",
        "frontend/src/tools/registry/tool.key.ts",
        "backend/src/modules/tools/tool.key.ts",
    ]:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        text = text.replace(
            "  'MortgageTaxesInsuranceCalculator',\n  'HomeMortgageCalculator',",
            "  'MortgageTaxesInsuranceCalculator',\n  'MortgageComparisonCalculator',\n  'HomeMortgageCalculator',",
        )
        text = text.replace(
            "    !isApprovedComponentKey('MortgageTaxesInsuranceCalculator') ||\n    !isApprovedComponentKey('HomeMortgageCalculator') ||",
            "    !isApprovedComponentKey('MortgageTaxesInsuranceCalculator') ||\n    !isApprovedComponentKey('MortgageComparisonCalculator') ||\n    !isApprovedComponentKey('HomeMortgageCalculator') ||",
        )
        write(path, text)


def ensure_index() -> None:
    path = ROOT / "frontend/src/tools/registry/index.ts"
    text = path.read_text(encoding="utf-8")
    if "MortgageComparisonCalculator" in text:
        print("index already has MortgageComparisonCalculator")
        return
    needle = (
        "  MortgageTaxesInsuranceCalculator: lazyTool(() =>\n"
        "    import('@/tools/calculators/mortgage-taxes-insurance/MortgageTaxesInsuranceCalculator').then((mod) => ({\n"
        "      default: mod.MortgageTaxesInsuranceCalculator,\n"
        "    })),\n"
        "  ),\n"
        "  HomeMortgageCalculator:"
    )
    block = (
        "  MortgageTaxesInsuranceCalculator: lazyTool(() =>\n"
        "    import('@/tools/calculators/mortgage-taxes-insurance/MortgageTaxesInsuranceCalculator').then((mod) => ({\n"
        "      default: mod.MortgageTaxesInsuranceCalculator,\n"
        "    })),\n"
        "  ),\n"
        "  MortgageComparisonCalculator: lazyTool(() =>\n"
        "    import('@/tools/calculators/mortgage-comparison/MortgageComparisonCalculator').then((mod) => ({\n"
        "      default: mod.MortgageComparisonCalculator,\n"
        "    })),\n"
        "  ),\n"
        "  HomeMortgageCalculator:"
    )
    if needle not in text:
        raise SystemExit("index needle missing")
    write(path, text.replace(needle, block))


def ensure_details() -> None:
    path = ROOT / "frontend/src/tools/registry/details.ts"
    text = path.read_text(encoding="utf-8")
    if "MortgageComparisonCalculator" in text:
        print("details already has MortgageComparisonCalculator")
        return
    needle = (
        "  MortgageTaxesInsuranceCalculator: () => import('@/tools/calculators/mortgage-taxes-insurance/detail'),\n"
        "  HomeMortgageCalculator:"
    )
    repl = (
        "  MortgageTaxesInsuranceCalculator: () => import('@/tools/calculators/mortgage-taxes-insurance/detail'),\n"
        "  MortgageComparisonCalculator: () =>\n"
        "    import('@/tools/calculators/mortgage-comparison/detail'),\n"
        "  HomeMortgageCalculator:"
    )
    if needle not in text:
        raise SystemExit("details needle missing")
    write(path, text.replace(needle, repl))


def ensure_slugs() -> None:
    for rel in [
        "frontend/src/tools/registry/sitemap.ts",
        "frontend/src/app/sitemap.ts",
        "frontend/src/app/(website)/tools/[slug]/page.tsx",
        "frontend/src/app/embed/[slug]/page.tsx",
    ]:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        needle = (
            "  'mortgage-calculator-with-taxes-and-insurance',\n"
            "  'home-mortgage-calculator',"
        )
        repl = (
            "  'mortgage-calculator-with-taxes-and-insurance',\n"
            "  'mortgage-comparison-calculator',\n"
            "  'home-mortgage-calculator',"
        )
        if "mortgage-comparison-calculator" in text:
            print("slug already present", rel)
            continue
        if needle not in text:
            raise SystemExit(f"slug needle missing in {rel}")
        write(path, text.replace(needle, repl))


def ensure_brain() -> None:
    cl = ROOT / "brain/CHANGELOG.md"
    text = cl.read_text(encoding="utf-8")
    entry = (
        "### 2026-11-17 — Mortgage Comparison Calculator (Screenshot-First + FX)\n"
        "- **Summary:** Shipped Mortgage Comparison Calculator on existing catalog slug "
        "`mortgage-comparison-calculator` (`MortgageComparisonCalculator`, catalog "
        "`6af46f0fa27d8d1d4e98ff75`). Screenshot is a single mortgage scenario (no dual-form "
        "comparison UI verified). Specs + Further specifications (PMI / tax / insurance / other) "
        "+ summary + doughnut. Independent real FX on money fields; normalize into home-value "
        "currency. Activated.\n"
        "- **Comparison note:** Dual Scenario A/B UI not evidenced; comparison is by changing "
        "inputs on one form (Omni “compare constructions” wording).\n"
        "- **Example:** 150,000 / 10% / 4.5% / 30y → payment ≈ 684.03; 360 payments ≈ 246,249.06; "
        "interest ≈ 111,249.06; PMI ≈ 4,106.25; total with costs ≈ 250,355.31.\n"
        "- **Important Files:** `frontend/src/tools/calculators/mortgage-comparison/*`, registries, "
        "sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, "
        "`backend/src/scripts/assign-mortgage-comparison-tool.ts`, `brain/*`.\n"
        "- **Verification:** Catalog verified undeveloped before coding. Formula self-check. "
        "MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). "
        "Lint/builds/browser/automated tests omitted per user.\n\n"
    )
    if "Mortgage Comparison Calculator (Screenshot-First + FX)" not in text:
        marker = "---\n\n"
        idx = text.find(marker)
        if idx < 0:
            raise SystemExit("changelog marker missing")
        insert_at = idx + len(marker)
        write(cl, text[:insert_at] + entry + text[insert_at:])

    cs = ROOT / "brain/CURRENT_STATE.md"
    text = cs.read_text(encoding="utf-8")
    line = (
        "- **Mortgage Comparison Calculator (`/tools/mortgage-comparison-calculator`):** Live "
        "client-side single-scenario mortgage (`componentKey: 'MortgageComparisonCalculator'`, "
        "catalog `6af46f0fa27d8d1d4e98ff75`). Screenshot shows one mortgage form (no dual Scenario "
        "A/B UI). Specs: home value, synced down payment, loan, rate, term, US/UK vs Canada method, "
        "payment frequency, first day, P&I payment; Further specifications PMI % / property tax % / "
        "homeowners insurance / other costs; summary + principal/interest/PMI/other doughnut. "
        "Independent real FX on money fields (Margin Interest pattern). Compare constructions by "
        "changing inputs. Example 150k / 10% / 4.5% / 30y → ≈ 684.03; PMI 4,106.25; total with "
        "costs ≈ 250,355.31. Activated.\n"
    )
    if "mortgage-comparison-calculator" not in text:
        needle = "- **Mortgage Calculator with Taxes and Insurance (`/tools/mortgage-calculator-with-taxes-and-insurance`):"
        idx = text.find(needle)
        if idx < 0:
            raise SystemExit("CURRENT_STATE needle missing")
        end = text.find("\n- **", idx + 1)
        write(cs, text[: end + 1] + line + text[end + 1 :])

    fe = ROOT / "brain/FRONTEND.md"
    text = fe.read_text(encoding="utf-8")
    insert = (
        "- `src/tools/calculators/mortgage-comparison/`: Mortgage Comparison Calculator "
        "(`MortgageComparisonCalculator`, slug `mortgage-comparison-calculator`). Single-scenario "
        "Omni mortgage form (no dual A/B UI); P&I + PMI/tax/insurance/other; doughnut; independent "
        "FX; compare by changing inputs.\n"
    )
    if "mortgage-comparison/" not in text:
        needle = "- `src/tools/calculators/mortgage-taxes-insurance/`:"
        idx = text.find(needle)
        if idx < 0:
            raise SystemExit("FRONTEND needle missing")
        end = text.find("\n", idx)
        write(fe, text[: end + 1] + insert + text[end + 1 :])

    tasks = ROOT / "brain/TASKS.md"
    text = tasks.read_text(encoding="utf-8")
    row = (
        "| `TOOL-335` | Implement Mortgage Comparison Calculator on existing slug "
        "`mortgage-comparison-calculator` with single-scenario Omni mortgage form, "
        "PMI/tax/insurance further specs, doughnut, independent FX, guide/SEO/embed, and verified "
        "activation (no dual Scenario A/B without evidence) | Cursor | Completed | "
        "`frontend/src/tools/calculators/mortgage-comparison/*`, registry, sitemap, "
        "`CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, "
        "`backend/src/scripts/assign-mortgage-comparison-tool.ts`, `brain/*` | `TOOL-334` |\n"
    )
    if "TOOL-335" not in text:
        needle = "| `TOOL-334` |"
        idx = text.find(needle)
        if idx < 0:
            raise SystemExit("TASKS needle missing")
        end = text.find("\n", idx)
        write(tasks, text[: end + 1] + row + text[end + 1 :])


def main() -> None:
    ensure_key_lists()
    ensure_index()
    ensure_details()
    ensure_slugs()
    ensure_brain()
    print("OK")


if __name__ == "__main__":
    main()
