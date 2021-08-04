import createBatch from './createBatch';
jest.mock('../../global/postgres')

const batch = {
    body: {
        batchSize: 1,
        curriculumId: 1, //we provide, perhaps may change this, like name
        endDate: "1",
        startDate: "1",
        trainerId: null, //we provide, perhaps may change this, like name
        clientId: null, //we provide, perhaps may change this, like name
    }
}


it('create a batch', async () => {
    const res = await createBatch(batch);
    console.log(res);
    expect(res.statusCode).toEqual(201);
})