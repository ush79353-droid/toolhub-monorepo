import { NextResponse } from 'next/server';
import {
  applyCaliforniaSalesTaxRate,
  buildCaliforniaUnavailableResult,
  CA_AMBIGUOUS_RATE_MESSAGE,
  CA_NO_MATCH_MESSAGE,
} from '@/tools/calculators/california-sales-tax/calculation';
import { validateCaliforniaSalesTaxFields } from '@/tools/calculators/california-sales-tax/validation';
import { lookupCdtfaRateByAddress } from '@/server/tax/cdtfa';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RequestBody {
  purchaseAmount?: number | string;
  streetAddress?: string;
  city?: string;
  zipCode?: string;
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const fieldCheck = validateCaliforniaSalesTaxFields({
    purchaseAmount:
      body.purchaseAmount === undefined || body.purchaseAmount === null
        ? ''
        : String(body.purchaseAmount),
    streetAddress: body.streetAddress ?? '',
    city: body.city ?? '',
    zipCode: body.zipCode ?? '',
  });

  if (!fieldCheck.isValid || !fieldCheck.parsed) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Enter a valid purchase amount, street, city, and California ZIP.',
        fieldErrors: fieldCheck.errors,
      },
      { status: 400 }
    );
  }

  const { purchaseAmount, streetAddress, city, zipCode } = fieldCheck.parsed;
  const outcome = await lookupCdtfaRateByAddress(
    streetAddress,
    city,
    zipCode
  );

  if (outcome.status === 'error') {
    return NextResponse.json(
      { ok: false, error: outcome.message },
      { status: 502 }
    );
  }

  if (outcome.status === 'no_match') {
    const result = buildCaliforniaUnavailableResult(
      purchaseAmount,
      streetAddress,
      city,
      zipCode,
      CA_NO_MATCH_MESSAGE
    );
    return NextResponse.json({ ok: true, result });
  }

  if (outcome.status === 'ambiguous') {
    const result = buildCaliforniaUnavailableResult(
      purchaseAmount,
      streetAddress,
      city,
      zipCode,
      CA_AMBIGUOUS_RATE_MESSAGE,
      outcome.matches.map((m) => ({
        rate: m.rate,
        jurisdiction: m.jurisdiction,
        city: m.city,
        county: m.county,
        tac: m.tac,
      }))
    );
    return NextResponse.json({ ok: true, result });
  }

  const result = applyCaliforniaSalesTaxRate(
    purchaseAmount,
    outcome.match.rate,
    {
      streetAddress,
      city,
      zipCode,
      jurisdiction: outcome.match.jurisdiction,
      county: outcome.match.county,
      tac: outcome.match.tac,
      formattedAddress: outcome.formattedAddress,
      lookedUpAt: outcome.lookedUpAt,
    }
  );

  if (!result) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Unable to compute sales tax from the verified rate.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, result });
}
