import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
const baseURL = process.env.CHUBB_API_BASE_URL;
const token = process.env.CHUBB_API_TOKEN;

const claimsListSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['claimId', 'incidentDate', 'description', 'claimAmount', 'status', 'createdAt'],
    properties: {
      claimId: { type: 'string' },
      incidentDate: { type: 'string' },
      description: { type: 'string' },
      claimAmount: { type: 'number' },
      status: { type: 'string' },
      createdAt: { type: 'string' },
    },
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
  });
  test('API_003 - invalid claim identifier is rejected or not found', async ({request}) => {
    const response = await request.get(`${baseURL}/api/claims/not-a-valid-claim-id`, {headers:{Authorization:`Bearer ${token}`}});
    expect([400,404]).toContain(response.status());
  });
  test('API_004 - missing required fields are rejected', async ({request}) => {
    const response = await request.post(`${baseURL}/api/claims`, {headers:{Authorization:`Bearer ${token}`}, data:{}});
    expect([400,422]).toContain(response.status());
  });
});
