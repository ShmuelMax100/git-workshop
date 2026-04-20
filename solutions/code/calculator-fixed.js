/**
 * calculator-fixed.js — SOLUTION for Scenario 2
 *
 * The only change from the original is in multiply():
 *   BEFORE: return a + b;   ← bug
 *   AFTER:  return a * b;   ← correct
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// FIXED: uses multiplication operator
function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

module.exports = { add, subtract, multiply, divide };
