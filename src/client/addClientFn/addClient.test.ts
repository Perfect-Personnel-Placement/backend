import handler from './addClient';
import client from '../../global/postgres';
import { APIGatewayProxyEvent } from 'aws-lambda';
jest.mock('../../global/postgres');

describe('addClient handler', () => {
  it('should succeed with 201, from a valid input', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
    const res = await handler({
      body: JSON.stringify({ clientName: 'jeff' })
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(201);
  });

  it('should fail with 400, from a null body', async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from an incomplete body', async () => {
    const res = await handler({
      body: '{"client": "invalid"}'
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const res = await handler({
      body: JSON.stringify({ clientName: 'jeff' })
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
});
