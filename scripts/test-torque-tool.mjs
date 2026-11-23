// Tests for src/lib/torque.mjs (the free Nm / ft-lb / in-lb and tolerance tool).
// Run: node scripts/test-torque-tool.mjs

import assert from 'node:assert/strict';
import {
  UNITS,
  INVALID_MESSAGE,
  NM_PER_FT_LB,
  NM_PER_IN_LB,
  FT_LB_PER_NM,
  IN_LB_PER_NM,
  round2,
  format2,
  convert,
  tolerance,
  toNm,
  fromNm,
  parseValue,
} from '../src/lib/torque.mjs';

let checks = 0;
function check(name, fn) {
  fn();
  checks += 1;
  console.log(`ok ${checks} - ${name}`);
}

const VALUES = [0, 1, 10, 100, 1000];

check('exact conversion factors are exported', () => {
  assert.equal(NM_PER_FT_LB, 1.3558179483314004);
  assert.equal(NM_PER_IN_LB, 0.1129848290276167);
  assert.equal(FT_LB_PER_NM, 0.7375621492772655);
  assert.equal(IN_LB_PER_NM, 8.850745791327185);
});

check('0, 1, 10, 100 and 1000 convert from every unit to all three units', () => {
  for (const unit of UNITS) {
    for (const value of VALUES) {
      const result = convert(value, unit);
      assert.equal(result.valid, true, `${value} ${unit} should be valid`);
      const nm = toNm(value, unit);
      assert.equal(result.nm, round2(nm), `${value} ${unit} -> Nm`);
      assert.equal(result.ftLb, round2(nm * FT_LB_PER_NM), `${value} ${unit} -> ft-lb`);
      assert.equal(result.inLb, round2(nm * IN_LB_PER_NM), `${value} ${unit} -> in-lb`);
    }
  }
});

check('Nm -> ft-lb -> Nm round trip stays within 0.01%', () => {
  for (const value of [1, 10, 100, 1000]) {
    const back = toNm(fromNm(value, 'ft-lb'), 'ft-lb');
    const error = Math.abs(back - value) / value;
    assert.ok(error <= 0.0001, `ft-lb round trip ${value}: ${back} (${error})`);
  }
});

check('Nm -> in-lb -> Nm round trip stays within 0.01%', () => {
  for (const value of [1, 10, 100, 1000]) {
    const back = toNm(fromNm(value, 'in-lb'), 'in-lb');
    const error = Math.abs(back - value) / value;
    assert.ok(error <= 0.0001, `in-lb round trip ${value}: ${back} (${error})`);
  }
});

check('100 Nm tolerance returns 96/104 and 98/102', () => {
  const result = tolerance(100, 'Nm');
  assert.equal(result.valid, true);
  assert.deepEqual(result.iso4, { min: 96, max: 104 });
  assert.deepEqual(result.dts2, { min: 98, max: 102 });
});

check('0 Nm tolerance returns 0/0 for both bands', () => {
  const result = tolerance(0, 'Nm');
  assert.equal(result.valid, true);
  assert.deepEqual(result.iso4, { min: 0, max: 0 });
  assert.deepEqual(result.dts2, { min: 0, max: 0 });
  assert.equal(result.nominalNm, 0);
});

check('negative input returns the invalid result', () => {
  for (const value of ['-1', '-0.5', -10]) {
    for (const fn of [convert, tolerance]) {
      const result = fn(value, 'Nm');
      assert.equal(result.valid, false, `${fn.name}(${value})`);
      assert.equal(result.error, INVALID_MESSAGE);
      assert.equal(result.empty, false);
    }
  }
});

check('non-numeric input returns the invalid result', () => {
  for (const value of ['abc', '12abc', NaN, Infinity, {}]) {
    for (const fn of [convert, tolerance]) {
      const result = fn(value, 'Nm');
      assert.equal(result.valid, false, `${fn.name}(${String(value)})`);
      assert.equal(result.error, INVALID_MESSAGE);
    }
  }
});

check('empty input is empty, not an error', () => {
  for (const value of ['', '   ', null, undefined]) {
    const result = convert(value, 'Nm');
    assert.equal(result.valid, false);
    assert.equal(result.empty, true);
    assert.equal(result.error, null);
  }
});

check('unknown unit returns the invalid result', () => {
  for (const fn of [convert, tolerance]) {
    const result = fn(10, 'kg');
    assert.equal(result.valid, false);
    assert.equal(result.error, INVALID_MESSAGE);
  }
});

check('results round to two decimals', () => {
  assert.equal(convert(10, 'Nm').ftLb, 7.38);
  assert.equal(convert(10, 'Nm').inLb, 88.51);
  assert.equal(convert(1000, 'in-lb').nm, 112.98);
  assert.equal(round2(2.345), 2.35);
  assert.equal(round2(2.344), 2.34);
  assert.equal(format2(7.3756), '7,38');
  assert.equal(format2(null), '—');
});

check('input parser distinguishes empty, valid and invalid', () => {
  assert.deepEqual(parseValue(''), { state: 'empty' });
  assert.deepEqual(parseValue('0'), { state: 'valid', value: 0 });
  assert.deepEqual(parseValue('12,5'), { state: 'valid', value: 12.5 });
  assert.deepEqual(parseValue(-1), { state: 'invalid' });
  assert.deepEqual(parseValue('nope'), { state: 'invalid' });
});

check('tolerance bands scale with the chosen unit', () => {
  const result = tolerance(100, 'ft-lb');
  assert.equal(result.valid, true);
  assert.deepEqual(result.iso4, { min: 96, max: 104 });
  assert.deepEqual(result.dts2, { min: 98, max: 102 });
  assert.equal(result.nominalNm, round2(100 * NM_PER_FT_LB));
});

console.log(`\n${checks} checks passed.`);
