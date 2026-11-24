import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
ajv.addFormat('uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
ajv.addFormat('date', /^\d{4}-\d{2}-\d{2}$/);
ajv.addFormat('date-time', /^\d{4}-\d{2}-\d{2}T.+$/);
ajv.addFormat('uri', /^https?:\/\//);
ajv.addFormat('double', (value: unknown) => typeof value === 'number');
const baseURL = process.env.CHUBB_API_BASE_URL;
const token = process.env.CHUBB_API_TOKEN;

const claimsListSchema = {
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    required: ['claimId', 'incidentDate', 'description', 'claimAmount', 'status', 'createdAt'],
    properties: {
      claimId: { type: 'string', format: 'uuid' },
      incidentDate: { type: 'string', format: 'date' },
      description: { type: 'string', maxLength: 100 },
      claimAmount: { type: 'number', format: 'double' },
      status: { type: 'string', enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'] },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
};

const submitClaimRequestSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['incidentDate', 'incidentLocation', 'description', 'claimAmount'],
  properties: {
    incidentDate: { type: 'string', format: 'date' },
    incidentLocation: { type: 'string', minLength: 5, maxLength: 200 },
    description: { type: 'string', minLength: 10, maxLength: 1000 },
    claimAmount: { type: 'number', format: 'double', minimum: 0.01, maximum: 1000000 },
  },
};

const claimResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['claimId', 'userId', 'incidentDate', 'incidentLocation', 'description', 'claimAmount', 'status', 'createdAt', 'updatedAt'],
  properties: {
    claimId: { type: 'string', format: 'uuid' },
    userId: { type: 'string', format: 'uuid' },
    incidentDate: { type: 'string', format: 'date' },
    incidentLocation: { type: 'string' },
    description: { type: 'string' },
    claimAmount: { type: 'number', format: 'double' },
    status: { type: 'string', enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const problemDetailSchema = {
  type: 'object',
  additionalProperties: true,
  required: ['type', 'title', 'status', 'detail'],
  properties: {
    type: { type: 'string', format: 'uri' },
    status: { type: 'integer', minimum: 400, maximum: 599 },
    title: { type: 'string', minLength: 1 },
    detail: { type: 'string' },
    instance: { type: 'string' },
  },
};

test.describe('Claims API contract (requires live stack)', () => {
  test.skip(!baseURL || !token, 'Set CHUBB_API_BASE_URL and CHUBB_API_TOKEN to execute live API tests');
  test('API_001 - list claims has successful status and JSON response', async ({request}) => {
    const response = await request.get(`${baseURL}/api/claims`, {headers:{Authorization:`Bearer ${token}`}});
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const body: unknown = await response.json();
    expect(body).not.toBeNull();
    expect(ajv.validate(claimsListSchema, body)).toBe(true);
  });
  test('API_002 - missing authorization is rejected', async ({request}) => {
    const response = await request.get(`${baseURL}/api/claims`);
    expect([401,403]).toContain(response.status());
    expect(response.ok()).toBe(false);
  });
  test('API_003 - invalid claim identifier is rejected or not found', async ({request}) => {
    const response = await request.get(`${baseURL}/api/claims/not-a-valid-claim-id`, {headers:{Authorization:`Bearer ${token}`}});
    expect([400,404]).toContain(response.status());
    expect(response.ok()).toBe(false);
  });
  test('API_004 - missing required fields are rejected', async ({request}) => {
    const response = await request.post(`${baseURL}/api/claims`, {headers:{Authorization:`Bearer ${token}`}, data:{}});
    expect([400,422]).toContain(response.status());
    const body: unknown = await response.json();
    expect(ajv.validate(problemDetailSchema, body)).toBe(true);
  });

  test('API_005 - invalid claim amount is rejected', async ({request}) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const incidentDate = futureDate.toISOString().slice(0, 10);
    const response = await request.post(`${baseURL}/api/claims`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        incidentDate,
        incidentLocation: '123 Main Street, Springfield',
        description: 'The vehicle was damaged in a parking lot.',
        claimAmount: 0,
      },
    });
    expect([400,422]).toContain(response.status());
    expect(response.ok()).toBe(false);
  });

  test('API_006 - malformed JSON is rejected', async ({request}) => {
    const response = await request.post(`${baseURL}/api/claims`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      data: '{"incidentLocation":',
    });
    expect([400,415,422]).toContain(response.status());
    expect(response.ok()).toBe(false);
  });

  test('API_007 - valid claim submission has successful status and response schema', async ({request}) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const incidentDate = yesterday.toISOString().slice(0, 10);
    const requestBody = {
      incidentDate,
      incidentLocation: '123 Main Street, Springfield',
      description: 'Playwright API contract validation claim.',
      claimAmount: 1500.5,
    };
    expect(ajv.validate(submitClaimRequestSchema, requestBody)).toBe(true);

    const response = await request.post(`${baseURL}/api/claims`, {
      headers: { Authorization: `Bearer ${token}` },
      data: requestBody,
    });
    expect(response.status()).toBe(201);
    const body: unknown = await response.json();
    expect(ajv.validate(claimResponseSchema, body)).toBe(true);
  });
});
