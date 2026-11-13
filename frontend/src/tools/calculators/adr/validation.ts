import { calculateAdr, resolveAvailableRoomNights } from './calculation';
import {
  MAX_DAYS,
  MAX_MONEY,
  MAX_PHYSICAL_ROOMS,
  MAX_ROOM_NIGHTS,
  type AdrFieldErrors,
  type AdrInput,
} from './types';

function wholeInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

export function validateAdr(
  input: AdrInput,
  options?: { reportBlanks?: boolean },
): {
  isValid: boolean;
  incomplete: boolean;
  errors: AdrFieldErrors;
} {
  const errors: AdrFieldErrors = {};
  let incomplete = false;

  const needRevenue = input.solveFor !== 'revenue';
  const needRooms = input.solveFor !== 'roomsSold';
  const needAdr = input.solveFor !== 'adr';

  if (needRevenue) {
    if (input.roomRevenue === null || !Number.isFinite(input.roomRevenue)) {
      if (options?.reportBlanks) {
        errors.roomRevenue = 'Enter total room revenue.';
      } else {
        incomplete = true;
      }
    } else if (input.roomRevenue < 0) {
      errors.roomRevenue = 'Room revenue cannot be negative.';
    } else if (input.roomRevenue > MAX_MONEY) {
      errors.roomRevenue = 'Enter room revenue of 1,000,000,000,000 or less.';
    }
  }

  if (needRooms) {
    if (input.roomsSold === null || !Number.isFinite(input.roomsSold)) {
      if (options?.reportBlanks) {
        errors.roomsSold = 'Enter the number of room-nights sold.';
      } else {
        incomplete = true;
      }
    } else if (input.roomsSold <= 0) {
      errors.roomsSold = 'Room-nights sold must be at least 1. Zero sold room-nights cannot produce an ADR.';
    } else if (!Number.isInteger(input.roomsSold)) {
      errors.roomsSold = 'Room-nights sold must be a whole number.';
    } else if (input.roomsSold > MAX_ROOM_NIGHTS) {
      errors.roomsSold = 'Enter 100,000,000 sold room-nights or fewer.';
    }
  }

  if (needAdr) {
    if (input.adr === null || !Number.isFinite(input.adr)) {
      if (options?.reportBlanks) {
        errors.adr = 'Enter the average daily rate.';
      } else {
        incomplete = true;
      }
    } else if (input.adr < 0) {
      errors.adr = 'ADR cannot be negative.';
    } else if (input.solveFor === 'roomsSold' && input.adr === 0) {
      errors.adr = 'ADR must be greater than zero to solve for room-nights sold.';
    } else if (input.adr > MAX_MONEY) {
      errors.adr = 'Enter an ADR of 1,000,000,000,000 or less.';
    }
  }

  const direct = input.availableRoomNights;
  const days = input.daysInPeriod;
  const rooms = input.physicalRooms;

  if (direct !== null) {
    if (!Number.isFinite(direct) || !wholeInRange(direct, 1, MAX_ROOM_NIGHTS)) {
      errors.availableRoomNights = 'Available room-nights must be a whole number from 1 to 100,000,000.';
    }
  }
  if (days !== null) {
    if (!Number.isFinite(days) || !wholeInRange(days, 1, MAX_DAYS)) {
      errors.daysInPeriod = 'Days in the period must be a whole number from 1 to 3,660.';
    }
  }
  if (rooms !== null) {
    if (!Number.isFinite(rooms) || !wholeInRange(rooms, 1, MAX_PHYSICAL_ROOMS)) {
      errors.physicalRooms = 'Physical rooms must be a whole number from 1 to 100,000.';
    }
  }
  if ((days === null) !== (rooms === null) && direct === null) {
    if (days === null) errors.daysInPeriod = 'Enter the days in the period, or enter available room-nights instead.';
    if (rooms === null) errors.physicalRooms = 'Enter the physical rooms, or enter available room-nights instead.';
  }
  if (
    direct !== null &&
    days !== null &&
    rooms !== null &&
    !errors.availableRoomNights &&
    !errors.daysInPeriod &&
    !errors.physicalRooms &&
    direct !== rooms * days
  ) {
    errors.availableRoomNights = 'Available room-nights must equal physical rooms × days.';
  }

  const available = resolveAvailableRoomNights(input);
  const sold =
    input.solveFor === 'roomsSold' && input.roomRevenue !== null && input.adr !== null && input.adr > 0
      ? input.roomRevenue / input.adr
      : input.roomsSold;
  if (
    available !== null &&
    sold !== null &&
    Number.isFinite(sold) &&
    sold > available &&
    !errors.roomsSold &&
    !errors.availableRoomNights
  ) {
    errors.roomsSold = 'Sold room-nights cannot exceed available room-nights.';
  }

  const isValid = Object.keys(errors).length === 0 && !incomplete && calculateAdr(input) !== null;
  return { isValid, incomplete: incomplete && Object.keys(errors).length === 0, errors };
}
