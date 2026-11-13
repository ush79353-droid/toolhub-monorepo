import type {
  LaunchQuality,
  RoadSurface,
  SimulationPoint,
  TireCategory,
  ZeroToSixtyAssumptions,
  ZeroToSixtyInput,
  ZeroToSixtyResult,
} from './types';
import {
  FEET_PER_METER,
  STANDARD_GRAVITY,
  TARGET_100_KMH_MPS,
  TARGET_60_MPH_MPS,
  convertPower,
  convertWeight,
  metersToFeet,
  mpsToKmh,
  mpsToMph,
  powerToWatts,
  weightToKg,
} from './units';
import { validateZeroToSixtyInput } from './validation';

export const AIR_DENSITY_SEA_LEVEL = 1.225; // kg/m³
export const ROTATIONAL_INERTIA_FACTOR = 1.05; // 5% rotational mass equivalent
export const POWER_CURVE_UTILIZATION = 0.92; // average power over gear RPM range in modern performance transmissions
export const SHIFT_SPEED_MPS = 18.0; // ~40.26 mph typical 1st-to-2nd gear shift threshold

export function getTireFrictionCoefficient(category: TireCategory, surface: RoadSurface): number {
  if (surface === 'wet') {
    switch (category) {
      case 'track':
        return 0.45; // lower grooving / hydroplaning sensitivity
      case 'performance':
        return 0.58;
      case 'standard':
      default:
        return 0.5;
    }
  }

  // Dry surface
  switch (category) {
    case 'track':
      return 1.15;
    case 'performance':
      return 0.98;
    case 'standard':
    default:
      return 0.85;
  }
}

export function getDrivenAxleWeightFraction(drivetrain: 'fwd' | 'rwd' | 'awd'): number {
  switch (drivetrain) {
    case 'awd':
      return 1.0; // all wheels driven
    case 'rwd':
      return 0.65; // ~50% static + 15% dynamic weight transfer to rear under launch
    case 'fwd':
      return 0.45; // ~60% static - 15% dynamic weight transfer off front wheels
  }
}

export function getLaunchFactor(launch: LaunchQuality): number {
  switch (launch) {
    case 'conservative':
      return 0.85;
    case 'aggressive':
      return 1.0;
    case 'normal':
    default:
      return 0.95;
  }
}

export function calculateZeroToSixty(input: ZeroToSixtyInput): ZeroToSixtyResult {
  const validation = validateZeroToSixtyInput(input);
  if (!validation.isValid) {
    return {
      reachable: false,
      reason: Object.values(validation.errors)[0] ?? 'Invalid input parameters.',
    };
  }

  // Mass calculations
  const vehicleMassKg = weightToKg(input.vehicleWeight, input.weightUnit);
  const extraMassKg = weightToKg(input.driverCargoWeight, input.weightUnit);
  const totalMassKg = vehicleMassKg + extraMassKg;
  const totalMassLb = convertWeight(totalMassKg, 'kg', 'lb');
  const effectiveMassKg = totalMassKg * ROTATIONAL_INERTIA_FACTOR;

  // Power calculations
  const enginePowerWatts = powerToWatts(input.enginePower, input.powerUnit);
  const enginePowerHp = convertPower(input.enginePower, input.powerUnit, 'hp');
  const enginePowerKw = convertPower(input.enginePower, input.powerUnit, 'kW');

  const drivetrainEfficiency = Math.max(0.5, Math.min(1.0, input.drivetrainEfficiencyPercent / 100));
  const wheelPowerWatts = enginePowerWatts * drivetrainEfficiency;
  const wheelHp = wheelPowerWatts / 745.699872;
  const effectiveWheelPowerWatts = wheelPowerWatts * POWER_CURVE_UTILIZATION;

  // Traction and road geometry
  const gradientPercent = input.roadGradientPercent;
  const gradientAngleRad = Math.atan(gradientPercent / 100);
  const gradientAngleDeg = (gradientAngleRad * 180) / Math.PI;

  const mu = getTireFrictionCoefficient(input.tireCategory, input.roadSurface);
  const drivenFraction = getDrivenAxleWeightFraction(input.drivetrain);
  const launchFactor = getLaunchFactor(input.launchQuality);

  const normalForceOnDrivenAxle =
    totalMassKg * STANDARD_GRAVITY * Math.cos(gradientAngleRad) * drivenFraction;
  const maxTractionForce = mu * normalForceOnDrivenAxle * launchFactor;

  // Static resistance at standstill (v = 0)
  const rollingResistanceForce =
    input.rollingResistanceCoeff * totalMassKg * STANDARD_GRAVITY * Math.cos(gradientAngleRad);
  const gradeForce = totalMassKg * STANDARD_GRAVITY * Math.sin(gradientAngleRad);

  const netInitialForce = maxTractionForce - rollingResistanceForce - gradeForce;
  if (netInitialForce <= 0) {
    return {
      reachable: false,
      reason:
        'The vehicle cannot initiate launch under the modeled road slope and traction conditions. Traction force is insufficient to overcome road gradient and rolling resistance.',
    };
  }

  const assumptions: ZeroToSixtyAssumptions = {
    airDensityKgPerM3: AIR_DENSITY_SEA_LEVEL,
    rotationalInertiaFactor: ROTATIONAL_INERTIA_FACTOR,
    tireFrictionCoeff: mu,
    drivenAxleWeightFraction: drivenFraction,
    effectiveWheelHp: wheelHp,
    powerUtilizationFactor: POWER_CURVE_UTILIZATION,
    effectiveTotalMassKg: effectiveMassKg,
    totalMassLb,
    gradientAngleDegrees: gradientAngleDeg,
  };

  // Numerical integration
  const dt = 0.005; // 5ms step
  const maxTime = 30.0; // 30s timeout cap
  const maxSteps = Math.ceil(maxTime / dt);

  let t = 0;
  let v = 0; // m/s
  let x = 0; // meters

  let t60Mph: number | null = null;
  let x60Mph: number | null = null;
  let t100Kmh: number | null = null;
  let x100Kmh: number | null = null;

  let peakAccelerationG = 0;
  let shifted = false;
  let shiftTimeRemaining = 0;

  const rawPoints: SimulationPoint[] = [
    {
      timeSeconds: 0,
      speedMph: 0,
      speedKmh: 0,
      distanceFeet: 0,
      distanceMeters: 0,
      accelerationG: netInitialForce / (effectiveMassKg * STANDARD_GRAVITY),
    },
  ];

  for (let step = 0; step < maxSteps; step++) {
    // Check gear shift trigger
    if (!shifted && v >= SHIFT_SPEED_MPS && input.shiftDelaySeconds > 0) {
      shifted = true;
      shiftTimeRemaining = input.shiftDelaySeconds;
    }

    let isShifting = false;
    if (shiftTimeRemaining > 0) {
      isShifting = true;
      shiftTimeRemaining -= dt;
    }

    // Aerodynamic drag at current speed
    const aeroDragForce =
      0.5 * AIR_DENSITY_SEA_LEVEL * input.dragCoefficient * input.frontalAreaSqM * v * v;
    const totalResistiveForce = aeroDragForce + rollingResistanceForce + gradeForce;

    // Drive force calculation
    let driveForce = 0;
    if (!isShifting) {
      if (v < 0.1) {
        // Pure traction-limited launch from rest
        driveForce = maxTractionForce;
      } else {
        const powerLimitedForce = effectiveWheelPowerWatts / v;
        driveForce = Math.min(maxTractionForce, powerLimitedForce);
      }
    }

    const netForce = driveForce - totalResistiveForce;
    const acceleration = netForce / effectiveMassKg;
    const accelG = acceleration / STANDARD_GRAVITY;
    if (accelG > peakAccelerationG) {
      peakAccelerationG = accelG;
    }

    // If vehicle reaches top speed and decelerates or stalls before target (when not in a shift delay)
    if (!isShifting && acceleration <= 0 && v > 1.0 && t60Mph === null) {
      return {
        reachable: false,
        reason:
          'Engine power is insufficient to reach 60 mph against aerodynamic drag, rolling resistance, and road incline.',
        assumptions,
      };
    }

    const nextV = Math.max(0, v + acceleration * dt);
    const nextX = x + v * dt + 0.5 * acceleration * dt * dt;
    const nextT = t + dt;

    // Check 60 mph (26.8224 m/s) crossing
    if (t60Mph === null && v <= TARGET_60_MPH_MPS && nextV >= TARGET_60_MPH_MPS) {
      const frac =
        nextV === v ? 0 : (TARGET_60_MPH_MPS - v) / (nextV - v);
      t60Mph = t + frac * dt;
      x60Mph = x + v * (frac * dt) + 0.5 * acceleration * Math.pow(frac * dt, 2);
    }

    // Check 100 km/h (27.7778 m/s) crossing
    if (t100Kmh === null && v <= TARGET_100_KMH_MPS && nextV >= TARGET_100_KMH_MPS) {
      const frac =
        nextV === v ? 0 : (TARGET_100_KMH_MPS - v) / (nextV - v);
      t100Kmh = t + frac * dt;
      x100Kmh = x + v * (frac * dt) + 0.5 * acceleration * Math.pow(frac * dt, 2);
    }

    v = nextV;
    x = nextX;
    t = nextT;

    // Sample every ~0.05s (every 10 steps) or on target crossings for chart
    if (step % 10 === 0 || (t60Mph !== null && t100Kmh !== null)) {
      rawPoints.push({
        timeSeconds: Math.round(t * 100) / 100,
        speedMph: Math.round(mpsToMph(v) * 10) / 10,
        speedKmh: Math.round(mpsToKmh(v) * 10) / 10,
        distanceFeet: Math.round(metersToFeet(x) * 10) / 10,
        distanceMeters: Math.round(x * 10) / 10,
        accelerationG: Math.round(accelG * 100) / 100,
      });
    }

    if (t60Mph !== null && t100Kmh !== null) {
      break;
    }
  }

  if (t60Mph === null || t100Kmh === null) {
    return {
      reachable: false,
      reason:
        'The simulation exceeded the 30-second time limit without reaching the target speed. Check if vehicle mass or aerodynamic resistance is too high for the available power.',
      assumptions,
    };
  }

  const avgAccel60Mps2 = TARGET_60_MPH_MPS / t60Mph;
  const avgAccel60G = avgAccel60Mps2 / STANDARD_GRAVITY;

  // Power to weight ratios
  const totalMassTon = totalMassLb / 2000;
  const totalMassMetricTonne = totalMassKg / 1000;
  const hpPerTon = enginePowerHp / totalMassTon;
  const hpPerMetricTonne = enginePowerHp / totalMassMetricTonne;
  const lbPerHp = totalMassLb / enginePowerHp;
  const kgPerKw = totalMassKg / enginePowerKw;

  return {
    reachable: true,
    timeTo60Mph: Math.round(t60Mph * 100) / 100,
    timeTo100Kmh: Math.round(t100Kmh * 100) / 100,
    distanceTo60MphMeters: Math.round((x60Mph ?? x) * 10) / 10,
    distanceTo60MphFeet: Math.round((x60Mph ?? x) * FEET_PER_METER * 10) / 10,
    distanceTo100KmhMeters: Math.round((x100Kmh ?? x) * 10) / 10,
    distanceTo100KmhFeet: Math.round((x100Kmh ?? x) * FEET_PER_METER * 10) / 10,
    powerToWeightHpPerTon: Math.round(hpPerTon * 10) / 10,
    powerToWeightHpPerMetricTonne: Math.round(hpPerMetricTonne * 10) / 10,
    powerToWeightLbPerHp: Math.round(lbPerHp * 10) / 10,
    powerToWeightKgPerKw: Math.round(kgPerKw * 10) / 10,
    wheelHorsepower: Math.round(wheelHp * 10) / 10,
    averageAcceleration60MphG: Math.round(avgAccel60G * 100) / 100,
    averageAcceleration60MphMps2: Math.round(avgAccel60Mps2 * 100) / 100,
    peakAccelerationG: Math.round(peakAccelerationG * 100) / 100,
    simulationPoints: rawPoints,
    assumptions,
  };
}
