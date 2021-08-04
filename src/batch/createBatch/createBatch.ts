
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'INSERT INTO batch (batchsize, curriculumid, enddate, startdate, trainerid, clientid)' +
    ' VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

export interface createBatches {
    body: {
        batchSize: number;
        // batchId: number; will be done through the database, user does not provide
        curriculumId: number; //we provide, perhaps may change this, like name
        endDate: string;
        startDate: string;
        trainerId: number | null; //we provide, perhaps may change this, like name
        clientId: number | null; //we provide, perhaps may change this, like name
    }
}



export default async function createBatch(event: createBatches) {

    await client.connect();
    let whatever = [event.body.batchSize, event.body.curriculumId, event.body.endDate, event.body.startDate,
    event.body.trainerId, event.body.clientId];

    const res = await client.query(text, whatever)
    await client.end()
    console.log(res.rows);
    return new HTTPResponse(201, 'Batch Created')
};