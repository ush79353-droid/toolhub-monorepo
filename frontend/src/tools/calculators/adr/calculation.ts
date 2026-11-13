import {
  MAX_DAYS,
  MAX_MONEY,
  MAX_PHYSICAL_ROOMS,
  MAX_ROOM_NIGHTS,
  type AdrInput,
  type AdrResult,
} from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

function roundTo(value: number, digits: number): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function moneyOk(value: number, allowZero: boolean): boolean {
  if (!Number.isFinite(value) || value > MAX_MONEY) return false;
  return allowZero ? value >= 0 : value > 0;
}

function wholeRoomNights(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_ROOM_NIGHTS;
}

/** Available room-nights from a direct entry, or from physical rooms × days. */
export function resolveAvailableRoomNights(input: Pick<
  AdrInput,
  'availableRoomNights' | 'daysInPeriod' | 'physicalRooms'
>): number | null {
  const direct = input.availableRoomNights;
  const days = input.daysInPeriod;
  const rooms = input.physicalRooms;
  const hasDirect = direct !== null;
  const hasProduct = days !== null && rooms !== null;
  if (!hasDirect && !hasProduct) return null;
  if (hasDirect && direct !== null && !wholeRoomNights(direct) && !(Number.isInteger(direct) && direct === 0)) {
    return null;
  }
  if (hasProduct && days !== null && rooms !== null) {
    if (!Number.isInteger(days) || days < 1 || days > MAX_DAYS) return null;
    if (!Number.isInteger(rooms) || rooms < 1 || rooms > MAX_PHYSICAL_ROOMS) return null;
    const product = rooms * days;
    if (!Number.isFinite(product) || product > MAX_ROOM_NIGHTS) return null;
    if (hasDirect && direct !== product) return null;
    return product;
  }
  return direct;
}

export function calculateAdr(input: AdrInput): AdrResult | null {
  const available = resolveAvailableRoomNights(input);
  if (
    (input.availableRoomNights !== null ||
      input.daysInPeriod !== null ||
      input.physicalRooms !== null) &&
    available === null &&
    (input.availableRoomNights !== null ||
      (input.daysInPeriod !== null && input.physicalRooms !== null))
  ) {
    return null;
  }

  let roomRevenue = input.roomRevenue;
  let roomsSold = input.roomsSold;
  let adr = input.adr;

  if (input.solveFor === 'adr') {
    if (roomRevenue === null || roomsSold === null) return null;
    if (!moneyOk(roomRevenue, true) || !wholeRoomNights(roomsSold)) return null;
    adr = roundMoney(roomRevenue / roomsSold);
  } else if (input.solveFor === 'revenue') {
    if (adr === null || roomsSold === null) return null;
    if (!moneyOk(adr, true) || !wholeRoomNights(roomsSold)) return null;
    roomRevenue = roundMoney(adr * roomsSold);
    adr = roundMoney(adr);
  } else {
    if (roomRevenue === null || adr === null) return null;
    if (!moneyOk(roomRevenue, true) || !moneyOk(adr, false)) return null;
    roomsSold = roundTo(roomRevenue / adr, 4);
    roomRevenue = roundMoney(roomRevenue);
    adr = roundMoney(adr);
  }

  if (roomRevenue === null || roomsSold === null || adr === null) return null;
  if (!Number.isFinite(roomRevenue) || !Number.isFinite(roomsSold) || !Number.isFinite(adr)) return null;
  if (roomRevenue > MAX_MONEY || adr > MAX_MONEY || roomsSold > MAX_ROOM_NIGHTS) return null;
  if (available !== null && roomsSold > available) return null;

  const occupancyPercent =
    available !== null && available > 0 ? roundTo((roomsSold / available) * 100, 2) : null;
  const revpar = available !== null && available > 0 ? roundMoney(roomRevenue / available) : null;

  if (
    (occupancyPercent !== null && !Number.isFinite(occupancyPercent)) ||
    (revpar !== null && !Number.isFinite(revpar))
  ) {
    return null;
  }

  return {
    solveFor: input.solveFor,
    roomRevenue,
    roomsSold,
    adr,
    roomsSoldIsFractional: Math.abs(roomsSold - Math.round(roomsSold)) > 1e-9,
    availableRoomNights: available,
    occupancyPercent,
    revpar,
    currency: input.currency,
  };
}
