import handler from './createSkill';
import client from '../../global/postgres';
import { skill } from '../../global/mockTable';
import { APIGatewayProxyEvent } from 'aws-lambda';
jest.mock('../../global/postgres');

describe('Create the Skill Handler', () => {
  it('should succeed with 201, from a valid input', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      return { rows: skill };
    });
    const res = await handler({
      body: JSON.stringify(skill)
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(201);
  });

  it('should fail with 400, from a null body', async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from an incomplete body', async () => {
    const res = await handler({
      body: '{"skillname": "failure"}'
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a database query error', async () => {
    const err = { detail: 'normal error from testing' };
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });
    const res = await handler({
      body: JSON.stringify(skill)
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from an unknown database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const res = await handler({
      body: JSON.stringify(skill)
    } as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
});
