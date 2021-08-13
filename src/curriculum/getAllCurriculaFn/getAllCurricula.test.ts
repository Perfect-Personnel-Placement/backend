import handler from './getAllCurricula';
import client from '../../global/postgres';
import { sampleCurr } from '../../global/mockTable';
jest.mock('../../global/postgres');

describe('Get All Curriculua Handler', () => {
  it('should succeed with 200, from a valid input', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      return { rows: sampleCurr }; // look into mockReturn
    });
    const res = await handler();
    expect(res.statusCode).toEqual(200);
  });

  it('should fail with 400, from an unknown database query error', async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw 'error';
    });
    const res = await handler();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail with 400, from a database query error', async () => {
    const err = { detail: 'normal error from testing' };
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });
    const res = await handler();
    expect(res.statusCode).toEqual(400);
  });
});
