/**
 * Florida discretionary sales surtax rates by county — Calendar Year 2026.
 *
 * Source: Florida Department of Revenue Form DR-15DSS R. 11/25
 * https://floridarevenue.com/Forms_library/current/dr15dss_26.pdf
 * ("Discretionary Sales Surtax Information for Calendar Year 2026")
 *
 * Values are the published Total Surtax Rate (%) for each county.
 * State sales tax (6%) is separate — see FLORIDA_STATE_SALES_TAX_RATE_PERCENT.
 *
 * Effective for calendar year 2026 estimates. Re-verify against DR-15DSS when renewing.
 */
export const FLORIDA_STATE_SALES_TAX_RATE_PERCENT = 6;

/** Florida DOR discretionary surtax $5,000 single-item taxable base limit. */
export const FLORIDA_DISCRETIONARY_SURTAX_BASE_CAP = 5000;

export const FLORIDA_SURTAX_SOURCE =
  'FL DOR DR-15DSS R. 11/25 — Discretionary Sales Surtax Information for Calendar Year 2026';

export const FLORIDA_COUNTY_FIPS_TO_NAME: Readonly<Record<string, string>> = {"12001":"Alachua","12003":"Baker","12005":"Bay","12007":"Bradford","12009":"Brevard","12011":"Broward","12013":"Calhoun","12015":"Charlotte","12017":"Citrus","12019":"Clay","12021":"Collier","12023":"Columbia","12027":"DeSoto","12029":"Dixie","12031":"Duval","12033":"Escambia","12035":"Flagler","12037":"Franklin","12039":"Gadsden","12041":"Gilchrist","12043":"Glades","12045":"Gulf","12047":"Hamilton","12049":"Hardee","12051":"Hendry","12053":"Hernando","12055":"Highlands","12057":"Hillsborough","12059":"Holmes","12061":"Indian River","12063":"Jackson","12065":"Jefferson","12067":"Lafayette","12069":"Lake","12071":"Lee","12073":"Leon","12075":"Levy","12077":"Liberty","12079":"Madison","12081":"Manatee","12083":"Marion","12085":"Martin","12086":"Miami-Dade","12087":"Monroe","12089":"Nassau","12091":"Okaloosa","12093":"Okeechobee","12095":"Orange","12097":"Osceola","12099":"Palm Beach","12101":"Pasco","12103":"Pinellas","12105":"Polk","12107":"Putnam","12109":"St. Johns","12111":"St. Lucie","12113":"Santa Rosa","12115":"Sarasota","12117":"Seminole","12119":"Sumter","12121":"Suwannee","12123":"Taylor","12125":"Union","12127":"Volusia","12129":"Wakulla","12131":"Walton","12133":"Washington"} as const;

/** County display name → total discretionary surtax percent for CY 2026. */
export const FLORIDA_COUNTY_SURTAX_PERCENT_2026: Readonly<
  Record<string, number>
> = {"Alachua":1.5,"Baker":1,"Bay":1,"Bradford":1,"Brevard":1,"Broward":1,"Calhoun":1.5,"Charlotte":1,"Citrus":0,"Clay":1.5,"Collier":0,"Columbia":1.5,"DeSoto":1.5,"Dixie":1,"Duval":1.5,"Escambia":1.5,"Flagler":1,"Franklin":1.5,"Gadsden":1.5,"Gilchrist":1,"Glades":1,"Gulf":1,"Hamilton":2,"Hardee":1,"Hendry":1.5,"Hernando":0.5,"Highlands":1.5,"Hillsborough":1.5,"Holmes":1.5,"Indian River":1,"Jackson":1.5,"Jefferson":1,"Lafayette":1,"Lake":1,"Lee":0.5,"Leon":1.5,"Levy":1,"Liberty":1.5,"Madison":1.5,"Manatee":1,"Marion":1.5,"Martin":0.5,"Miami-Dade":1,"Monroe":1.5,"Nassau":1,"Okaloosa":1,"Okeechobee":1,"Orange":0.5,"Osceola":1.5,"Palm Beach":0.5,"Pasco":1,"Pinellas":1,"Polk":1,"Putnam":1,"St. Johns":0.5,"St. Lucie":1,"Santa Rosa":1,"Sarasota":1,"Seminole":1,"Sumter":1,"Suwannee":1,"Taylor":1,"Union":1,"Volusia":0.5,"Wakulla":1.5,"Walton":1,"Washington":1.5} as const;

export function getFloridaCountySurtaxPercent(
  countyName: string
): number | null {
  if (!(countyName in FLORIDA_COUNTY_SURTAX_PERCENT_2026)) return null;
  return FLORIDA_COUNTY_SURTAX_PERCENT_2026[countyName]!;
}
