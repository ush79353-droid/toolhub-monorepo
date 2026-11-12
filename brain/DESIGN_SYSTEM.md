# Design System — Mega Tools / Omega Calculators

> **Rule:** The color palette below is **strictly locked** across all public website and admin dashboard views (enforced in `frontend/tailwind.config.ts`, `frontend/src/app/globals.css`, and `frontend/src/app/admin/(dashboard)/settings/page.tsx`). Do not introduce conflicting brand colors or dark-mode overrides on public canvases without an approved ADR.

---

## 1. Locked Color Palette

| Token | Hex | CSS Variable (`globals.css`) | Tailwind Key (`tailwind.config.ts`) | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `#087E8B` | `--primary: 186 89% 29%` | `brand-primary` / `primary` | Main interactive CTAs, links, active tabs, icons, focus rings |
| **Secondary** | `#D9F0EF` | `--secondary: 177 47% 90%` | `brand-secondary` / `secondary` | Highlight badges, icon containers, active pills, text selection bg |
| **Dark Accent** | `#163C43` | `--accent` / `--secondary-foreground: 189 51% 17%` | `brand-darkAccent` / `accent` | Headings (`h1`-`h3`), admin sidebar & header background, strong brand text |
| **Primary Hover** | `#066773` | `--primary-hover: 187 90% 24%` | `brand-primaryHover` / `primary-hover` | Button & primary action hover states |
| **Soft Teal** | `#EAF7F6` | `--muted: 175 46% 94%` | `brand-softTeal` / `muted` | Subtle card surfaces, table headers, banner tints |
| **Background** | `#F7F8F6` | `--background: 90 10% 97%` | `brand-background` / `background` | Admin / muted canvas token; public `(website)` layout uses `bg-white` so white calculator cards can lift with soft elevation shadows |
| **Primary Text** | `#202B2D` | `--foreground: 189 17% 15%` | `brand-text` / `foreground` | Primary body text & card foreground |
| **Secondary Text** | `#667477` | `--muted-foreground: 191 8% 43%` | `brand-textSecondary` / `muted-foreground` | Descriptions, labels, helper copy, metadata |
| **Border** | `#DCE6E5` | `--border` / `--input: 174 15% 88%` | `brand-border` / `border` / `input` | Hairline dividers, card borders, input borders |
| **Surface White** | `#FFFFFF` | `--card` / `--popover: 0 0% 100%` | `brand-white` / `card` / `white` | Cards, modals, inputs, header/footer surfaces |

### Semantic Status Accents (Admin & Feedback States)
Verified in `StatusBadge.tsx`, `PendingNotice.tsx`, forms, and alerts:
- **Success / Active:** `emerald-50` / `emerald-100` bg, `emerald-600` / `emerald-700` text, `emerald-200` border
- **Warning / Draft / Pending:** `amber-50` bg, `amber-600` / `amber-700` text, `amber-200` border
- **Error / Disabled / Destructive:** `rose-50` or `red-50` bg, `rose-600` / `red-600` text, `rose-200` border
- **Server / Third-Party Badges (`ExecutionTypeBadge.tsx`):** `sky-50`/`sky-800` (server), `purple-50`/`purple-800` (third-party)

---

## 2. Typography & Scale

- **Fonts:** Uses Tailwind defaults (`font-sans`, `font-mono`) with `antialiased` and `font-feature-settings: 'rlig' 1, 'calt' 1` on `body`. No custom `next/font` loader is currently configured.
- **Public Hero / Section Headings:** `text-4xl font-semibold tracking-tight text-accent sm:text-5xl` (home), `text-3xl font-extrabold tracking-tight text-accent sm:text-4xl` (directories), `text-xl font-semibold` / `text-2xl font-bold`.
- **Interactive Calculator & Editorial Pages (Refined on Auto Loan Calculator):**
  - Headings: `font-semibold` (`600`) for `h1` (`26–32px`), article `h2` (`21–24px`), `h3` (`17px`), and FAQ questions (`15–16px`), avoiding excessive bold/extrabold clutter.
  - Form labels: `text-[13px] font-medium` (`500`), helper text `text-xs font-normal` (`400`), calculator inputs/selects standardized at `h-11` (`44px` outer control / `42px` inner input) with centered prefix/suffix units and `autoComplete="off"`.
  - Article body copy: `text-[15px] font-normal leading-[1.72] sm:text-base sm:leading-[1.75]` (`16px` / `1.75` line-height on unified white surface with subtle hairline `divide-y` dividers).
  - Primary result figure: crisp teal/dark-accent highlight (`font-bold` hero payment + `font-semibold` secondary `tabular-nums` tiles).
- **Admin Headings & Labels:**
  - Page titles via `AdminPageHeader`
  - Table head cells (`DataTable.tsx`): `text-[11px] font-bold uppercase tracking-wider text-muted-foreground`
  - Form labels: `text-xs font-semibold text-accent` or `text-xs font-bold uppercase tracking-wider text-accent`
  - Slugs, URLs, timestamps, IDs, MIME types: `font-mono text-[10px]` or `text-xs`
  - Counts / table numerals: `tabular-nums`

---

## 3. Layout, Spacing & Radius Conventions

- **Base Radius:** `--radius: 0.5rem` (`rounded-lg`, `rounded-md`, `rounded-sm`). Cards typically use `rounded-xl` or `rounded-2xl`; pills use `rounded-full`; auth split container uses `rounded-[28px]`.
- **Public Container (`Container.tsx`):** `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8` (note `tailwind.config.ts` also sets `container.screens['2xl'] = '1400px'`).
- **Ad placeholders (`AdSlot`):** Dashed `border-border`, `rounded-xl`, canvas `#F7F8F6`, centered muted “Advertisement” label; reserved min-heights for leaderboard (~90–100px) and rectangle (~250px). Never sticky; never inside calculator panels. See `AD_STANDARDS.md`.
- **Public Header:** Sticky `h-16` (`top-0 z-40`), white translucent backdrop (`bg-white/95 backdrop-blur-md`).
- **Height-Aware Sticky Calculator Sidebar (`StickyCalculatorAside`):** Enabled on desktop (`>= 1024px` and viewport height `>= 560px`) with top clearance (`84px`) when the calculator fits, or bottom-pinned negative sticky offset (`vh - height - 20px`) when taller so results remain visible without inner scrollbars and stop cleanly above `<footer>`; includes focus-capture offset/scroll adjustment so keyboard focus never hides under `<header>`, and falls back to static document flow on `< 1024px`.
- **Admin Shell (`AdminDashboardShell.tsx`):**
  - Desktop sidebar (`AdminSidebar`): Sticky full-height `bg-brand-darkAccent text-white`, collapsible between `w-64` (256px) and `w-[72px]`. Uses `.admin-scroll` custom thin scrollbar (`globals.css`).
  - Admin top header (`AdminHeader`): Sticky `h-16` `bg-brand-darkAccent text-white`, border `border-white/10`.
  - Main admin canvas: `p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto`.
- **Auth Split Screen (`AuthSplit.tsx`):** Centered two-column card (`max-w-5xl`, `bg-[#eef1f0]` backdrop, soft radial teal panel on left, subtle grid-masked form panel on right, gradient submit button `from-primary-hover to-[#149eab]`).

---

## 4. Reusable UI Patterns

- **Primitives (`src/components/ui/`):** `Button` (variants: `default`, `secondary`, `outline`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon`), `Badge`, `Card`, `Input`, `Select`, `Textarea`, `Switch`, `Tabs`.
- **Admin CRUD Patterns:**
  - `AdminPageHeader` + primary CTA button (`bg-primary text-white`)
  - `TableFilters` (debounced 300ms search, category/status selects, reset button)
  - `DataTable` (`overflow-x-auto`, `hover:bg-muted/40`) + `TablePagination` (compact page window with `…` gap indicators) + `RowActions`
  - `FormSection` cards for grouped form inputs
  - `ConfirmDialog` (`role="dialog"`, `aria-modal="true"`, `Escape` closes) for destructive/logout confirmations
  - `PendingNotice` banner to honestly indicate UI-preview / non-persisted admin modules
- **Responsive Breakpoints:** Mobile-first Tailwind (`sm:`, `md:`, `lg:`, `xl:`), with `AdminMobileSidebar` drawer on `< md` (`md:hidden`) and `MobileNavigation` on public `< md`.

