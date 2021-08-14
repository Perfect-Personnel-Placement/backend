import handler from './confirmBatch';
import client from '../../global/postgres';
import { snsClient } from '../../global/snsClient';
import { sesClient } from '../../global/sesClient';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { PublishCommandOutput } from '@aws-sdk/client-sns';

jest.mock('../../global/postgres');
jest.mock('../../global/snsClient');
jest.mock('../../global/sesClient');

const input: unknown = { pathParameters: { batchId: 11210034 } };
const wronginput: unknown = {
  pathParameters: { wrongProperty: 'WrongPathParam' },
};

beforeEach(() => {
  (client.query as jest.Mock).mockReset();
  (sesClient.send as jest.Mock).mockReset();
  (snsClient.send as jest.Mock).mockClear();
});

// Written by BWK
describe('Confirm Batch Handler', () => {
  it('should fail with 400, from an invalid path parameter', async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a true confirmed', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({
      rows: [
        {
          trainerid: 22,
          curriculumid: 33,
          startdate: '1/1/21',
          enddate: '3/3/23',
          confirmed: true,
          email: 'sample@test.com',
        },
      ],
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from an unknown database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from an invalid path parameter', async () => {
    const res = await handler(wronginput as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should pass with SNS module status code 200', async () => {
    (client.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          trainerid: 22,
          curriculumid: 33,
          startdate: '1/1/21',
          enddate: '3/3/23',
          confirmed: false,
          email: 'sample@test.com',
        },
      ],
    })(snsClient.send as jest.Mock<any>);
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  //Trigger SNS error
  it('should pass with 200 even with snsError', async () => {
    (snsClient.send as jest.Mock).mockRejectedValueOnce(
      new Error('Async error')
    );
    (client.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          trainerid: 22,
          curriculumid: 33,
          startdate: '1/1/21',
          enddate: '3/3/23',
          confirmed: false,
          email: 'sample@test.com',
        },
      ],
    })();
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  //Trigger SES error
  it('should pass with 200 even with sesError', async () => {
    (sesClient.send as jest.Mock).mockRejectedValueOnce(
      new Error('Different Async error')
    );
    (client.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          trainerid: 22,
          curriculumid: 33,
          startdate: '1/1/21',
          enddate: '3/3/23',
          confirmed: false,
          email: 'sample@test.com',
        },
      ],
    })(snsClient.send as jest.Mock<any>);
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it('should fail with 400, from a database query error', async () => {
    const err = { detail: 'normal error from testing' };
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should pass with SNS module status code 200', async () => {
    (client.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          trainerid: 22,
          curriculumid: 33,
          startdate: '1/1/21',
          enddate: '3/3/23',
          confirmed: false,
          email: 'sample@test.com',
        },
      ],
    })(sesClient.send as jest.Mock<any>);
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it('should succeed with 200, from a valid input', async () => {
    (client.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          trainerid: 22,
          curriculumid: 33,
          startdate: '1/1/21',
          enddate: '3/3/23',
          confirmed: false,
          email: 'sample@test.com',
        },
      ],
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it('should fail with 400, from an unkown database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'Unkown Error';
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from database update query error', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({
      rows: [
        {
          trainerid: 22,
          curriculumid: 33,
          startdate: '1/1/21',
          enddate: '3/3/23',
          confirmed: false,
          email: 'sample@test.com',
        },
      ],
    });
    (client.query as jest.Mock).mockRejectedValueOnce({
      detail: 'normal error from testing',
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from unkown database update query error', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({
      rows: [
        {
          trainerid: 22,
          curriculumid: 33,
          startdate: '1/1/21',
          enddate: '3/3/23',
          confirmed: false,
          email: 'sample@test.com',
        },
      ],
    });
    (client.query as jest.Mock).mockRejectedValueOnce('oops');
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
});
