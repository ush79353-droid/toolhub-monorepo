# Mega Tools — Online Tools Platform

Mega Tools is an enterprise-grade, scalable online tools monorepo engineered to host thousands of utilities across calculators, converters, PDF processors, image editors, audio/video tools, AI utilities, SEO analyzers, and developer tools.

---

## 1. Monorepo Architecture

This platform is structured as an npm workspaces monorepo:

```text
mega-tools/
│
├── apps/
│   ├── web/                     # Next.js App Router (Frontend & BFF)
│   └── api/                     # Node.js + Express.js + Mongoose (Backend API)
│
├── packages/
│   ├── shared/                  # Shared TypeScript types, constants, utilities
│   ├── validation/              # Shared Zod validation schemas
│   └── ui/                      # Reusable UI component primitives
│
├── infrastructure/
│   ├── docker/                  # Container configurations
│   ├── nginx/                   # Reverse proxy configuration
│   └── deployment/              # VPS & CI/CD deployment scripts
│
├── scripts/                     # Build, migration & maintenance scripts
├── .gitignore
├── .prettierrc
├── package.json                 # Monorepo workspaces definition
├── tsconfig.base.json           # Base TypeScript configuration
└── README.md
```

---

## 2. Critical Architecture Rules

### API Communication Rule
```
Browser ──> Next.js Server (BFF) ──> Express Backend ──> MongoDB
```

1. **No Direct Browser-to-Express Calls**: Browser client components never call the Express API directly.
2. **Server-Only API Client**: All backend interactions happen via the centralized client in `apps/web/src/server/api/client.ts` protected by `server-only`.
3. **Server Actions & Route Handlers**: Client components perform mutations and data fetches through Next.js Server Actions or Route Handlers.
4. **Environment Isolation**: The Express API base URL (`API_INTERNAL_URL`) and backend secrets are server-only and NEVER prefixed with `NEXT_PUBLIC_`.
5. **Direct Client Calculations**: Pure client-side tools (BMI, percentages, age, mortgage) calculate directly in the browser with zero network latency.
6. **Isolated Database Access**: MongoDB and Mongoose connections reside solely in `apps/api`. The Next.js frontend has zero direct database drivers.

---

## 3. Locked Design System

The platform design system is strictly enforced across Tailwind CSS and shadcn/ui:

| Role | Color Name | Hex Code | HSL Value |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Teal | `#087E8B` | `186 89% 29%` |
| **Primary Hover**| Hover Teal | `#066773` | `187 90% 24%` |
| **Secondary** | Pale Mint | `#D9F0EF` | `177 47% 90%` |
| **Dark Accent** | Dark Pine | `#163C43` | `189 51% 17%` |
| **Soft Teal** | Light Wash | `#EAF7F6` | `175 46% 94%` |
| **Background** | Clean Off-White| `#F7F8F6` | `90 10% 97%` |
| **Primary Text**| Charcoal Cyan | `#202B2D` | `189 17% 15%` |
| **Secondary Text**| Slate Teal | `#667477` | `191 8% 43%` |
| **Border** | Soft Grey-Teal| `#DCE6E5` | `174 15% 88%` |
| **White** | Pure White | `#FFFFFF` | `0 0% 100%` |

---

## 4. Port Configuration

- **Next.js Web**: `http://localhost:3000`
- **Express API**: `http://localhost:5001`
- **API Health Check**: `http://localhost:5001/api/v1/health`
- **MongoDB**: `mongodb://localhost:27017/mega_tools`

---

## 5. Getting Started

### Prerequisites
- Node.js >= 20 (Node 24 tested)
- npm >= 10
- MongoDB (optional for initial health check, required for database features)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy the example environment files:
```bash
# Web application
cp apps/web/.env.example apps/web/.env.local

# API application
cp apps/api/.env.example apps/api/.env
```

### 3. Run Development Servers
```bash
# Run both Frontend and Backend concurrently
npm run dev

# Run frontend only (port 3000)
npm run dev:web

# Run backend only (port 5001)
npm run dev:api
```

### 4. Build, Typecheck & Quality Checks
```bash
# Type check all workspaces
npm run type-check

# Run ESLint across workspaces
npm run lint

# Format code with Prettier
npm run format

# Production build of all workspaces
npm run build
```

