import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'INSERT INTO demand (clientid, curriculumid, needby, quantitydemanded)' +
    ' VALUES ($1, $2, $3, $4) RETURNING *';

//Written by Nick Wang
export interface createDemand {
    clientid: number,
    curriculumid: number,
    needby: string,
    quantitydemanded: number
}

export default async function handler(event: APIGatewayProxyEvent) {
    // Check if body is null
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    const demand: createDemand = JSON.parse(event.body);
    //Data to be inserted into the INSERT query
    const trainerData = [demand.clientid, demand.curriculumid, demand.needby, demand.quantitydemanded];
    let res;
    //Try the querying the Database
    try {
        res = await client.query(text, trainerData)

    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return created user
    return new HTTPResponse(201, res.rows)
};