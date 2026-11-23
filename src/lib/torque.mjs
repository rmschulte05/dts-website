// Torque unit conversion and tolerance bands for the free DTS tool.
// Factors are exact by definition of the international units:
//   1 ft-lb = 1.3558179483314004 Nm
//   1 in-lb = 0.1129848290276167 Nm
// The reciprocals are kept to the same precision so round trips stay stable.

export const INVALID_MESSAGE = 'Vul een getal van 0 of hoger in.';

export const UNITS = ['Nm', 'ft-lb', 'in-lb'];

export const NM_PER_FT_LB = 1.3558179483314004;
export const NM_PER_IN_LB = 0.1129848290276167;
export const FT_LB_PER_NM = 0.7375621492772655;
export const IN_LB_PER_NM = 8.850745791327185;

const NM_PER_UNIT = {
  Nm: 1,
  'ft-lb': NM_PER_FT_LB,
  'in-lb': NM_PER_IN_LB,
};

/** Round to two decimals, as a number. */
export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Format a number for the Dutch UI with a comma and two decimals. */
export function format2(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  return value.toFixed(2).replace('.', ',');
}

/**
 * Parse user input. Empty input is its own state (show an em dash), while
 * negative values and non-numbers are invalid (show INVALID_MESSAGE).
 */
export function parseValue(value) {
  if (value === null || value === undefined) return { state: 'empty' };
  const normalized = typeof value === 'string' ? value.trim().replace(',', '.') : value;
  if (normalized === '') return { state: 'empty' };
  const n = typeof normalized === 'number' ? normalized : Number(normalized);
  if (!Number.isFinite(n) || n < 0) return { state: 'invalid' };
  return { state: 'valid', value: n };
}

function invalidResult(unit, empty = false) {
  return {
    valid: false,
    empty,
    unit,
    error: empty ? null : INVALID_MESSAGE,
  };
}

/** Convert a value in `unit` to Nm, full precision. Returns NaN for unknown units. */
export function toNm(value, unit) {
  const factor = NM_PER_UNIT[unit];
  if (!factor) return NaN;
  return Number(value) * factor;
}

/** Convert Nm to `unit`, full precision. Returns NaN for unknown units. */
export function fromNm(nm, unit) {
  if (!UNITS.includes(unit)) return NaN;
  if (unit === 'Nm') return nm;
  if (unit === 'ft-lb') return nm * FT_LB_PER_NM;
  return nm * IN_LB_PER_NM;
}

/**
 * Tool A: show one value in all three units.
 * Returns { valid, empty, unit, nm, ftLb, inLb, error, rawNm }.
 */
export function convert(value, unit) {
  if (!UNITS.includes(unit)) return invalidResult(unit);
  const parsed = parseValue(value);
  if (parsed.state === 'empty') return invalidResult(unit, true);
  if (parsed.state === 'invalid') return invalidResult(unit);

  const nm = toNm(parsed.value, unit);
  return {
    valid: true,
    empty: false,
    unit,
    input: parsed.value,
    rawNm: nm,
    nm: round2(nm),
    ftLb: round2(nm * FT_LB_PER_NM),
    inLb: round2(nm * IN_LB_PER_NM),
    error: null,
  };
}

/**
 * Tool B: ±4% ISO band and ±2% DTS service band for the set value.
 * Bands are returned in the chosen unit; nominalNm is also in Nm.
 * Returns { valid, empty, unit, nominal, nominalNm, iso4, dts2, error }.
 */
export function tolerance(value, unit) {
  if (!UNITS.includes(unit)) return invalidResult(unit);
  const parsed = parseValue(value);
  if (parsed.state === 'empty') return invalidResult(unit, true);
  if (parsed.state === 'invalid') return invalidResult(unit);

  const v = parsed.value;
  return {
    valid: true,
    empty: false,
    unit,
    nominal: round2(v),
    nominalNm: round2(toNm(v, unit)),
    iso4: { min: round2(v * 0.96), max: round2(v * 1.04) },
    dts2: { min: round2(v * 0.98), max: round2(v * 1.02) },
    error: null,
  };
}
