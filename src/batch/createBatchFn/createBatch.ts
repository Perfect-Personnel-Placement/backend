
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'INSERT INTO batch (batchsize, curriculumid, enddate, startdate, trainerid, clientid)' +
    ' VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

export interface createBatches {
    batchSize: number;
    // batchId: number; will be done through the database, user does not provide
    curriculumId: number; //we provide, perhaps may change this, like name
    endDate: string;
    startDate: string;
    trainerId: number | null; //we provide, perhaps may change this, like name
    clientId: number | null; //we provide, perhaps may change this, like name
}



export default async function handler(event: APIGatewayProxyEvent) {
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    const batch: createBatches = JSON.parse(event.body).batch

    try {
        await client.connect();

    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the DataBase")
    }

    const batchData = [batch.batchSize, batch.curriculumId, batch.endDate, batch.startDate,
    batch.trainerId, batch.clientId];
    let res;

    try {
        res = await client.query(text, batchData)

    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }

    await client.end()
    return new HTTPResponse(201, res.rows)
};