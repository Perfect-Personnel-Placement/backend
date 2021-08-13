import handler from './deleteSkill';
import client from '../../global/postgres';
import { skill } from '../../global/mockTable';
import { APIGatewayProxyEvent } from 'aws-lambda';
jest.mock('../../global/postgres');
const input: unknown = { pathParameters: skill };
const wronginput: unknown = { pathParameters: { skillId: 'no' } };

describe('Delete a Skill Handler', () => {
  it('should succeed with 200, from a valid input', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      return { rows: skill }; // look into mockReturn
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it('should fail with 400, from a null body', async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a invalid input', async () => {
    const res = await handler(wronginput as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a database query error', async () => {
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
