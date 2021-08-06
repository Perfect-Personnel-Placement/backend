import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM batch WHERE (batchid = $1)';

//YTyler
export default async function handler(event: APIGatewayProxyEvent) {
    if (!event.pathParameters || !event.pathParameters.batchId) { //Check if the path parameters were null
        return new HTTPResponse(400, "No path parameters");
    }
    const data = [event.pathParameters.batchId];

    //Try querying the DataBase
    try {
        const res = await client.query(text, data) //query the DB by batchId
        return new HTTPResponse(200, res.rows); //return selected batch
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information");
    }

};