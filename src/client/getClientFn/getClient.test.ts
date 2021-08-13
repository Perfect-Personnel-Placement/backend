import handler from './getClient';
jest.mock('../../global/postgres');

import client from '../../global/postgres';
import { APIGatewayProxyEvent } from 'aws-lambda';
const input: unknown = { pathParameters: { clientId: 1 } };
const wronginput: unknown = { pathParameters: { clientId: 'no' } };

describe('getClient handler', () => {
  it('should fail with 400, from a missing path parameter', async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from an incorrect path parameter', async () => {
    const res = await handler(wronginput as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should succeed with 200, from a valid input', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it('should fail with 400, from a database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
});
