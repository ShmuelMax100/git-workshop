/**
 * calculator.js
 *
 * Simple arithmetic functions used as the workshop's "production" code.
 * NOTE: multiply() contains an intentional bug — participants must find and fix it
 * as part of scenario-2-ci-failure.
 */

/**
 * Adds two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers.
 * BUG: uses addition instead of multiplication — intentional for the workshop.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiply(a, b) {
  // WORKSHOP BUG: this should be `a * b`, not `a + b`
  return a + b;
}

/**
 * Divides a by b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 * @throws {Error} when dividing by zero
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

module.exports = { add, subtract, multiply, divide };
