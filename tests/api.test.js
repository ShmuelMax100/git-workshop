/**
 * api.test.js
 *
 * Integration tests for the Express API.
 * All tests here PASS — they serve as a green baseline.
 */

const request = require('supertest');
const app = require('../app/index');

describe('GET /health', () => {
  test('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /add', () => {
  test('returns correct sum', async () => {
    const res = await request(app).post('/add').send({ a: 5, b: 3 });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(8);
  });
});

describe('POST /subtract', () => {
  test('returns correct difference', async () => {
    const res = await request(app).post('/subtract').send({ a: 10, b: 4 });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(6);
  });
});

describe('POST /divide', () => {
  test('returns correct quotient', async () => {
    const res = await request(app).post('/divide').send({ a: 20, b: 4 });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('returns 400 on division by zero', async () => {
    const res = await request(app).post('/divide').send({ a: 10, b: 0 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/zero/i);
  });
});
