import handler from './getAllSkills';
import client from '../../global/postgres';
jest.mock('../../global/postgres');

// Written by BWK
describe('Get All Skills Handler', () => {
  it('should succeed with 200, from a valid input', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
    const res = await handler();
    expect(res.statusCode).toEqual(200);
  });

  it('should fail with 400, from a database query error', async () => {
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
