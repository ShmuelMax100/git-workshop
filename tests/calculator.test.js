/**
 * calculator.test.js
 *
 * Test suite for the calculator module.
 *
 * WORKSHOP NOTE:
 *   - add, subtract, divide tests: intentionally PASS
 *   - multiply tests: intentionally FAIL (due to the bug in calculator.js)
 *
 * Participants will see a red CI run and must fix the source code to make it green.
 */

const { add, subtract, multiply, divide } = require('../app/calculator');

// ── add ────────────────────────────────────────────────────────────────────
describe('add()', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds a positive and a negative number', () => {
    expect(add(10, -4)).toBe(6);
  });

  test('adds two negative numbers', () => {
    expect(add(-3, -7)).toBe(-10);
  });
});

// ── subtract ───────────────────────────────────────────────────────────────
describe('subtract()', () => {
  test('subtracts two positive numbers', () => {
    expect(subtract(10, 4)).toBe(6);
  });

  test('returns a negative result when b > a', () => {
    expect(subtract(3, 10)).toBe(-7);
  });
});

// ── multiply ───────────────────────────────────────────────────────────────
// These tests FAIL because multiply() has a bug — it adds instead of multiplying.
describe('multiply()', () => {
  test('multiplies two positive numbers', () => {
    expect(multiply(3, 4)).toBe(12); // actual result: 7 (3+4) → FAIL
  });

  test('multiplies by zero', () => {
    expect(multiply(5, 0)).toBe(0); // actual result: 5 (5+0) → FAIL
  });

  test('multiplies two negative numbers', () => {
    expect(multiply(-2, -3)).toBe(6); // actual result: -5 (-2+-3) → FAIL
  });
});

// ── divide ─────────────────────────────────────────────────────────────────
describe('divide()', () => {
  test('divides two positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('throws on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero is not allowed');
  });
});
