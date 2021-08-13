import handler from './getAllClients';
import client from '../../global/postgres';
jest.mock('../../global/postgres');

describe('getAllClients handler', () => {
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
});
