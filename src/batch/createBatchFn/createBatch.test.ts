import handler from './createBatch';
import client from '../../global/postgres';
import { batch2 } from '../../global/mockTable';
import { APIGatewayProxyEvent } from 'aws-lambda';
jest.mock('../../global/postgres');

describe('Create the Batch Handler', () => {
  it('should succeed with 201, from a valid input', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      return { batch2 }; // look into mockReturn
    });
    const res = await handler({
      body: JSON.stringify(batch2)
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(201);
  });

  it('should fail with 400, from a null body', async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a database query error', async () => {
    const err = { detail: 'normal error from testing' };
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });
    const res = await handler({
      body: JSON.stringify(batch2)
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const res = await handler({
      body: JSON.stringify(batch2)
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from an incomplete body', async () => {
    const res = await handler({
      body: '{"curriculumId": "43"}'
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
});
