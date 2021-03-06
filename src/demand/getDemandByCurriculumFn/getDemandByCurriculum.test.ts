import handler from './getDemandByCurriculum';
import client from '../../global/postgres';
import { APIGatewayProxyEvent } from 'aws-lambda';
jest.mock('../../global/postgres');

const testDate = new Date('8/6/2021').toISOString().substring(0, 10);
const inputWithoutDates: unknown = { pathParameters: { curriculumId: 1 } };
const inputWithDates: unknown = {
  pathParameters: {
    curriculumId: 1,
    start: testDate,
    end: testDate
  }
};
const inputWithStartDate: unknown = {
  pathParameters: {
    curriculumId: 1,
    start: testDate
  }
};
const inputWithEndDate: unknown = {
  pathParameters: {
    curriculumId: 1,
    end: testDate
  }
};

// Written by BWK and NW
describe('Get Demand by Curriculum Handler', () => {
  it('should fail with 400, from an invalid path parameter', async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should succeed with 200, from a valid dateless input', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
    const res = await handler(inputWithoutDates as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it('should succeed with 200, from a valid dated input', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
    const res = await handler(inputWithDates as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it('should fail with 400, from an unknown database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const res = await handler(inputWithoutDates as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
  it('should fail with 400, from a database query error', async () => {
    const err = { detail: 'normal error from testing' };
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });
    const res = await handler(inputWithoutDates as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, due to missing end date', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
    const res = await handler(inputWithStartDate as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, due to missing start date', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
    const res = await handler(inputWithEndDate as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
});
