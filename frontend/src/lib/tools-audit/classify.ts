export type AuditStatus = 'developed' | 'not_developed' | 'needs_review';

export type IssueCode =
  | ''
  | 'missing_component'
  | 'broken_route'
  | 'broken_import'
  | 'placeholder'
  | 'ambiguous'
  | 'unwired';

export interface ComponentFile {
  relativePath: string;
  exports: string[];
  placeholder: boolean;
}

export interface RegistryBinding {
  key: string;
  importPath: string;
  expectedPath: string;
  relativePath: string;
  exportName: string;
  exportFound: boolean;
  fileExists: boolean;
  placeholder: boolean;
  detailImportPath: string;
  detailExpectedPath: string;
  detailFileExists: boolean;
  detailExportsPageDetail: boolean;
}

export interface SourceIndex {
  version: 1;
  available: boolean;
  source: 'filesystem' | 'manifest';
  scannedAt: string;
  warning: string;
  routeFileExists: boolean;
  routeUsesRegistry: boolean;
  detailRequired: boolean;
  embedUsesRegistry: boolean;
  registeredKeys: string[];
  bindings: RegistryBinding[];
  files: ComponentFile[];
}

export interface AuditToolInput {
  id: string;
  name: string;
  slug: string;
  category: string;
  componentKey: string;
  isDeveloped: boolean;
  isDevelopedPersisted: boolean;
}

export interface AuditRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  component: string;
  componentPath: string;
  route: string;
  isDeveloped: boolean;
  status: AuditStatus;
  issue: string;
  issueCode: IssueCode;
}

export interface AuditTotals {
  total: number;
  developed: number;
  notDeveloped: number;
  needsReview: number;
  completionPercent: number;
}

export interface CategoryStat {
  category: string;
  total: number;
  developed: number;
  pending: number;
  needsReview: number;
}

export interface DuplicateGroup {
  value: string;
  count: number;
  slugs: string[];
}

export interface SharedComponentGroup {
  component: string;
  count: number;
  slugs: string[];
}

export interface DuplicateReport {
  ids: DuplicateGroup[];
  slugs: DuplicateGroup[];
  routes: DuplicateGroup[];
  sharedComponents: SharedComponentGroup[];
}

export interface ClassifiedAudit {
  source: SourceIndex['source'];
  warning: string;
  totals: AuditTotals;
  categories: CategoryStat[];
  duplicates: DuplicateReport;
  rows: AuditRow[];
  updates: Array<{ id: string; slug: string; isDeveloped: boolean }>;
  initializeIds: string[];
}

export interface AuditHistoryEntry {
  ranAt: string;
  source: 'filesystem' | 'manifest';
  total: number;
  developed: number;
  notDeveloped: number;
  needsReview: number;
  newlyDeveloped: string[];
  regressed: string[];
}

export interface StoredAudit {
  ranAt: string;
  source: 'filesystem' | 'manifest';
  warning: string;
  totals: AuditTotals;
  categories: CategoryStat[];
  duplicates: DuplicateReport;
  newlyDeveloped: string[];
  regressed: string[];
  updatedCount: number;
  rows: AuditRow[];
  history: AuditHistoryEntry[];
}

interface Decision {
  status: AuditStatus;
  issue: string;
  issueCode: IssueCode;
  /** Null keeps the stored boolean. */
  isDeveloped: boolean | null;
  component: string;
  componentPath: string;
}

export function pascalFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function emptyDecision(component: string, componentPath: string): Decision {
  return {
    status: 'not_developed',
    issue: 'No component file or registry entry is wired to this slug.',
    issueCode: 'missing_component',
    isDeveloped: false,
    component,
    componentPath,
  };
}

function decide(tool: AuditToolInput, index: SourceIndex): Decision {
  const key = tool.componentKey.trim();
  const routeReady = index.routeFileExists && index.routeUsesRegistry;

  if (!key) {
    const expected = pascalFromSlug(tool.slug);
    const matches = index.files.filter((file) => {
      const base = file.relativePath.split('/').pop() ?? '';
      return base === `${expected}.tsx` || base === `${expected}.ts` || file.exports.includes(expected);
    });
    if (matches.length === 0) return emptyDecision('—', '');
    const uniquePaths = [...new Set(matches.map((file) => file.relativePath))];
    if (uniquePaths.length > 1) {
      return {
        status: 'needs_review',
        issue: 'More than one component file matches this slug, so it was not marked developed.',
        issueCode: 'ambiguous',
        isDeveloped: null,
        component: expected,
        componentPath: uniquePaths[0] ?? '',
      };
    }
    return {
      status: 'needs_review',
      issue: 'A component file matches this slug, but the tool has no componentKey, so the route does not load it.',
      issueCode: 'unwired',
      isDeveloped: null,
      component: expected,
      componentPath: uniquePaths[0] ?? '',
    };
  }

  const binding = index.bindings.find((item) => item.key === key);
  const registered = index.registeredKeys.includes(key);
  const exporting = index.files.filter((file) => file.exports.includes(key));

  if (!binding && !registered) {
    if (exporting.length === 0) {
      return {
        status: 'not_developed',
        issue: 'componentKey is not registered and no file exports it.',
        issueCode: 'missing_component',
        isDeveloped: false,
        component: key,
        componentPath: '',
      };
    }
    return {
      status: 'needs_review',
      issue: 'A file exports this componentKey, but the registry does not load it on the tool route.',
      issueCode: 'unwired',
      isDeveloped: null,
      component: key,
      componentPath: exporting[0]?.relativePath ?? '',
    };
  }

  if (!binding) {
    return {
      status: 'needs_review',
      issue: 'componentKey is registered, but registry/index.ts has no import for it.',
      issueCode: 'broken_import',
      isDeveloped: null,
      component: key,
      componentPath: exporting[0]?.relativePath ?? '',
    };
  }

  if (!registered) {
    return {
      status: 'needs_review',
      issue: 'registry/index.ts imports this component, but it is not in REGISTERED_COMPONENT_KEYS, so the route will not render it.',
      issueCode: 'broken_route',
      isDeveloped: null,
      component: key,
      componentPath: binding.relativePath || binding.expectedPath,
    };
  }

  if (!binding.fileExists) {
    return {
      status: 'not_developed',
      issue: 'The registry import does not point at a file on disk.',
      issueCode: 'missing_component',
      isDeveloped: false,
      component: key,
      componentPath: binding.expectedPath,
    };
  }

  if (!binding.exportFound) {
    return {
      status: 'needs_review',
      issue: 'The component file exists, but it does not export the name the registry imports.',
      issueCode: 'broken_import',
      isDeveloped: null,
      component: key,
      componentPath: binding.relativePath,
    };
  }

  if (binding.placeholder) {
    return {
      status: 'needs_review',
      issue: 'The component file looks like a placeholder, so it was left for review.',
      issueCode: 'placeholder',
      isDeveloped: null,
      component: key,
      componentPath: binding.relativePath,
    };
  }

  if (!routeReady) {
    return {
      status: 'needs_review',
      issue: 'The shared tool route does not load the component registry.',
      issueCode: 'broken_route',
      isDeveloped: null,
      component: key,
      componentPath: binding.relativePath,
    };
  }

  if (index.detailRequired && (!binding.detailFileExists || !binding.detailExportsPageDetail)) {
    return {
      status: 'needs_review',
      issue: 'The tool route loads a page detail module, and that module is missing or does not export toolPageDetail.',
      issueCode: 'broken_route',
      isDeveloped: null,
      component: key,
      componentPath: binding.relativePath,
    };
  }

  return {
    status: 'developed',
    issue: '',
    issueCode: '',
    isDeveloped: true,
    component: binding.exportName || key,
    componentPath: binding.relativePath,
  };
}

function groupBy(rows: AuditRow[], valueOf: (row: AuditRow) => string): DuplicateGroup[] {
  const groups = new Map<string, string[]>();
  for (const row of rows) {
    const value = valueOf(row);
    if (!value) continue;
    const slugs = groups.get(value) ?? [];
    slugs.push(row.slug);
    groups.set(value, slugs);
  }
  return [...groups.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([value, slugs]) => ({ value, count: slugs.length, slugs }))
    .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value));
}

function sharedComponents(rows: AuditRow[]): SharedComponentGroup[] {
  const groups = new Map<string, string[]>();
  for (const row of rows) {
    if (!row.component || row.component === '—') continue;
    if (row.status !== 'developed') continue;
    const slugs = groups.get(row.component) ?? [];
    slugs.push(row.slug);
    groups.set(row.component, slugs);
  }
  return [...groups.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([component, slugs]) => ({ component, count: slugs.length, slugs }))
    .sort((left, right) => right.count - left.count || left.component.localeCompare(right.component));
}

export function classifyTools(tools: AuditToolInput[], index: SourceIndex): ClassifiedAudit {
  const warningParts = [index.warning];
  if (index.available && !index.embedUsesRegistry) {
    warningParts.push('The embed route does not use the component registry. Tool pages were still checked on their own.');
  }

  const updates: ClassifiedAudit['updates'] = [];
  const initializeIds: string[] = [];
  const rows: AuditRow[] = tools.map((tool) => {
    const decision = decide(tool, index);
    const isDeveloped = decision.isDeveloped === null ? (tool.isDevelopedPersisted ? tool.isDeveloped : true) : decision.isDeveloped;
    if (decision.isDeveloped === null) {
      if (!tool.isDevelopedPersisted) initializeIds.push(tool.id);
    } else if (!tool.isDevelopedPersisted || tool.isDeveloped !== decision.isDeveloped) {
      updates.push({ id: tool.id, slug: tool.slug, isDeveloped: decision.isDeveloped });
    }
    return {
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      category: tool.category || 'Uncategorized',
      component: decision.component,
      componentPath: decision.componentPath,
      route: `/tools/${tool.slug}`,
      isDeveloped,
      status: decision.status,
      issue: decision.issue,
      issueCode: decision.issueCode,
    };
  });

  rows.sort((left, right) => left.name.localeCompare(right.name) || left.slug.localeCompare(right.slug));

  const totals = rows.reduce(
    (summary, row) => {
      summary.total += 1;
      if (row.status === 'developed') summary.developed += 1;
      else if (row.status === 'not_developed') summary.notDeveloped += 1;
      else summary.needsReview += 1;
      return summary;
    },
    { total: 0, developed: 0, notDeveloped: 0, needsReview: 0, completionPercent: 0 }
  );
  totals.completionPercent = totals.total === 0 ? 0 : Math.round((totals.developed / totals.total) * 1000) / 10;

  const categoryMap = new Map<string, CategoryStat>();
  for (const row of rows) {
    const current = categoryMap.get(row.category) ?? {
      category: row.category,
      total: 0,
      developed: 0,
      pending: 0,
      needsReview: 0,
    };
    current.total += 1;
    if (row.status === 'developed') current.developed += 1;
    else if (row.status === 'needs_review') current.needsReview += 1;
    else current.pending += 1;
    categoryMap.set(row.category, current);
  }

  return {
    source: index.source,
    warning: warningParts.filter(Boolean).join(' '),
    totals,
    categories: [...categoryMap.values()].sort((left, right) => left.category.localeCompare(right.category)),
    duplicates: {
      ids: groupBy(rows, (row) => row.id),
      slugs: groupBy(rows, (row) => row.slug),
      routes: groupBy(rows, (row) => row.route),
      sharedComponents: sharedComponents(rows),
    },
    rows,
    updates,
    initializeIds,
  };
}
