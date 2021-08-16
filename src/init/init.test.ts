jest.mock('../global/postgres', () => {
  return {
    connect: jest.fn(),
    query: jest.fn(),
  };
});
jest.mock('fs', () => {
  return {
    readFileSync: jest.fn(),
  };
});

import { APIGatewayProxyEvent } from 'aws-lambda';
import fs from 'fs';
import pgClient from '../global/postgres';
import handler from './init';

describe('Function handler for init database function', () => {
  it('Should run successfully without errors', async () => {
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      return {
        toString: () => {
          return 'bigfoot';
        },
      };
    });
    const response = await handler({} as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(200);
  });

  it('Should fail gracefully if create script fails', async () => {
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const response = await handler({} as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(500);
  });

  it('Should fail gracefully if PG fails', async () => {
    (pgClient.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      return {
        toString: () => {
          return 'bigfoot';
        },
      };
    });
    const response = await handler({} as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(500);
  });

  it('Should fail gracefully if drop script fails', async () => {
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const response = await handler({
      body: JSON.stringify({
        refresh: true,
      }),
    } as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(500);
  });

  it('Should fail gracefully if sample data script fails', async () => {
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      return {
        toString: () => {
          return 'bigfoot';
        },
      };
    });
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const response = await handler({
      body: JSON.stringify({
        sampleData: true,
      }),
    } as APIGatewayProxyEvent);
    expect(response.statusCode).toEqual(500);
  });
});
