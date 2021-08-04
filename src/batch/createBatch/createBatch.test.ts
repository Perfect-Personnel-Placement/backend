import createBatch from './createBatch';
jest.mock('./createBatch.ts')

it('create a batch', async () => {
    const res = await createBatch();
    expect(res.status).toEqual(400);
})