import { getCurrencyFractionDigits, type SupportedCurrency } from '@/tools/shared/currency';
import {
  MONEY_FIELDS,
  OMC_FIELDS,
  PERCENT_FIELDS,
  type OmcField,
  type OmcSolveResult,
  type OmcValues,
} from './types';

function finite(n: number | undefined): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

function setIfMissing(out: OmcValues, key: OmcField, value: number): boolean {
  if (!Number.isFinite(value)) return false;
  if (finite(out[key])) return false;
  out[key] = value;
  return true;
}

/**
 * Blank-fill marketing funnel solver. Never overwrites provided (manual) values.
 */
export function solveOnlineMarketingConversion(manual: OmcValues): OmcSolveResult {
  const errors: OmcSolveResult['errors'] = {};
  const out: OmcValues = { ...manual };

  for (const key of OMC_FIELDS) {
    const v = out[key];
    if (!finite(v)) continue;
    if (v < 0) {
      errors[key] = 'Value cannot be negative';
      continue;
    }
    if (
      (key === 'ctr' || key === 'visitsToLeads' || key === 'leadsToCustomers') &&
      v > 100
    ) {
      errors[key] = 'Rate cannot exceed 100%';
    }
  }
  if (Object.keys(errors).length > 0) {
    return { values: out, errors };
  }

  let changed = true;
  let guard = 0;
  while (changed && guard < 12) {
    changed = false;
    guard += 1;

    const {
      impressions,
      ctr,
      visits,
      visitsToLeads,
      leads,
      leadsToCustomers,
      customers,
      totalCost,
      cpm,
      cpc,
      costPerLead,
      costPerCustomer,
      revenue,
      roi,
      revenuePerClick,
      revenuePerLead,
      revenuePerCustomer,
      ordersPerCustomer,
      customerLtv,
      totalLifetimeRevenue,
    } = out;

    // Funnel forward / reverse
    if (finite(impressions) && finite(ctr)) {
      changed = setIfMissing(out, 'visits', (impressions * ctr) / 100) || changed;
    }
    if (finite(impressions) && impressions > 0 && finite(visits)) {
      changed = setIfMissing(out, 'ctr', (visits / impressions) * 100) || changed;
    }
    if (finite(visits) && finite(ctr) && ctr > 0) {
      changed = setIfMissing(out, 'impressions', (visits * 100) / ctr) || changed;
    }

    if (finite(visits) && finite(visitsToLeads)) {
      changed = setIfMissing(out, 'leads', (visits * visitsToLeads) / 100) || changed;
    }
    if (finite(visits) && visits > 0 && finite(leads)) {
      changed = setIfMissing(out, 'visitsToLeads', (leads / visits) * 100) || changed;
    }
    if (finite(leads) && finite(visitsToLeads) && visitsToLeads > 0) {
      changed = setIfMissing(out, 'visits', (leads * 100) / visitsToLeads) || changed;
    }

    if (finite(leads) && finite(leadsToCustomers)) {
      changed = setIfMissing(out, 'customers', (leads * leadsToCustomers) / 100) || changed;
    }
    if (finite(leads) && leads > 0 && finite(customers)) {
      changed = setIfMissing(out, 'leadsToCustomers', (customers / leads) * 100) || changed;
    }
    if (finite(customers) && finite(leadsToCustomers) && leadsToCustomers > 0) {
      changed = setIfMissing(out, 'leads', (customers * 100) / leadsToCustomers) || changed;
    }

    // Costs
    if (finite(impressions) && impressions > 0 && finite(totalCost)) {
      changed = setIfMissing(out, 'cpm', (totalCost / impressions) * 1000) || changed;
    }
    if (finite(impressions) && finite(cpm)) {
      changed = setIfMissing(out, 'totalCost', (cpm * impressions) / 1000) || changed;
    }
    if (finite(totalCost) && finite(cpm) && cpm > 0) {
      changed = setIfMissing(out, 'impressions', (totalCost / cpm) * 1000) || changed;
    }

    if (finite(visits) && visits > 0 && finite(totalCost)) {
      changed = setIfMissing(out, 'cpc', totalCost / visits) || changed;
    }
    if (finite(visits) && finite(cpc)) {
      changed = setIfMissing(out, 'totalCost', cpc * visits) || changed;
    }
    if (finite(totalCost) && finite(cpc) && cpc > 0) {
      changed = setIfMissing(out, 'visits', totalCost / cpc) || changed;
    }

    if (finite(leads) && leads > 0 && finite(totalCost)) {
      changed = setIfMissing(out, 'costPerLead', totalCost / leads) || changed;
    }
    if (finite(leads) && finite(costPerLead)) {
      changed = setIfMissing(out, 'totalCost', costPerLead * leads) || changed;
    }
    if (finite(totalCost) && finite(costPerLead) && costPerLead > 0) {
      changed = setIfMissing(out, 'leads', totalCost / costPerLead) || changed;
    }

    if (finite(customers) && customers > 0 && finite(totalCost)) {
      changed = setIfMissing(out, 'costPerCustomer', totalCost / customers) || changed;
    }
    if (finite(customers) && finite(costPerCustomer)) {
      changed = setIfMissing(out, 'totalCost', costPerCustomer * customers) || changed;
    }
    if (finite(totalCost) && finite(costPerCustomer) && costPerCustomer > 0) {
      changed = setIfMissing(out, 'customers', totalCost / costPerCustomer) || changed;
    }

    // Revenue
    if (finite(totalCost) && totalCost > 0 && finite(revenue)) {
      changed = setIfMissing(out, 'roi', ((revenue - totalCost) / totalCost) * 100) || changed;
    }
    if (finite(totalCost) && finite(roi)) {
      changed = setIfMissing(out, 'revenue', totalCost * (1 + roi / 100)) || changed;
    }
    if (finite(revenue) && finite(roi) && roi !== -100) {
      changed = setIfMissing(out, 'totalCost', revenue / (1 + roi / 100)) || changed;
    }

    if (finite(visits) && visits > 0 && finite(revenue)) {
      changed = setIfMissing(out, 'revenuePerClick', revenue / visits) || changed;
    }
    if (finite(visits) && finite(revenuePerClick)) {
      changed = setIfMissing(out, 'revenue', revenuePerClick * visits) || changed;
    }
    if (finite(revenue) && finite(revenuePerClick) && revenuePerClick > 0) {
      changed = setIfMissing(out, 'visits', revenue / revenuePerClick) || changed;
    }

    if (finite(leads) && leads > 0 && finite(revenue)) {
      changed = setIfMissing(out, 'revenuePerLead', revenue / leads) || changed;
    }
    if (finite(leads) && finite(revenuePerLead)) {
      changed = setIfMissing(out, 'revenue', revenuePerLead * leads) || changed;
    }
    if (finite(revenue) && finite(revenuePerLead) && revenuePerLead > 0) {
      changed = setIfMissing(out, 'leads', revenue / revenuePerLead) || changed;
    }

    if (finite(customers) && customers > 0 && finite(revenue)) {
      changed = setIfMissing(out, 'revenuePerCustomer', revenue / customers) || changed;
    }
    if (finite(customers) && finite(revenuePerCustomer)) {
      changed = setIfMissing(out, 'revenue', revenuePerCustomer * customers) || changed;
    }
    if (finite(revenue) && finite(revenuePerCustomer) && revenuePerCustomer > 0) {
      changed = setIfMissing(out, 'customers', revenue / revenuePerCustomer) || changed;
    }

    // LTV
    if (finite(revenuePerCustomer) && finite(ordersPerCustomer)) {
      changed =
        setIfMissing(out, 'customerLtv', revenuePerCustomer * ordersPerCustomer) || changed;
    }
    if (finite(customerLtv) && finite(ordersPerCustomer) && ordersPerCustomer > 0) {
      changed =
        setIfMissing(out, 'revenuePerCustomer', customerLtv / ordersPerCustomer) || changed;
    }
    if (finite(customerLtv) && finite(revenuePerCustomer) && revenuePerCustomer > 0) {
      changed =
        setIfMissing(out, 'ordersPerCustomer', customerLtv / revenuePerCustomer) || changed;
    }

    if (finite(revenue) && finite(ordersPerCustomer)) {
      changed =
        setIfMissing(out, 'totalLifetimeRevenue', revenue * ordersPerCustomer) || changed;
    }
    if (finite(totalLifetimeRevenue) && finite(ordersPerCustomer) && ordersPerCustomer > 0) {
      changed = setIfMissing(out, 'revenue', totalLifetimeRevenue / ordersPerCustomer) || changed;
    }
    if (finite(totalLifetimeRevenue) && finite(revenue) && revenue > 0) {
      changed =
        setIfMissing(out, 'ordersPerCustomer', totalLifetimeRevenue / revenue) || changed;
    }
  }

  return { values: out, errors: {} };
}

export function formatOmcField(
  field: OmcField,
  value: number,
  currency: SupportedCurrency
): string {
  if (!Number.isFinite(value)) return '';
  if (PERCENT_FIELDS.has(field)) {
    return Number(value.toFixed(4)).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  }
  if (MONEY_FIELDS.has(field)) {
    const digits = getCurrencyFractionDigits(currency);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }
  return Number(value.toFixed(6)).toLocaleString('en-US', {
    maximumFractionDigits: 6,
  });
}
