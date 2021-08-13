jest.mock('../../global/postgres')
import client from '../../global/postgres';
import { APIGatewayProxyEvent } from 'aws-lambda';
import handler from './deleteTrainer';
const input: unknown = { pathParameters: { trainerId: 1 } };
const wronginput: unknown = { pathParameters: { trainerId: 'no' } };

describe('Delete Trainer handler', () => {
  it('should fail with 400, from a missing path parameter', async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from an invalid path parameter', async () => {
    const res = await handler(wronginput as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should succeed with 200, from a valid input', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it('should fail with 400, from an unknown database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a database query error', async () => {
    const err = { detail: 'normal error from testing' };
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
});

