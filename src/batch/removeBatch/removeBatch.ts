import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'DELETE FROM batch WHERE (batchId = $1) RETURNING *';

//Comments written by Samuel Smetzer
export default async function handler(event: APIGatewayProxyEvent) {
    //Check if the path parameters are null
    if (!event.pathParameters || !event.pathParameters.batchId) {
        return new HTTPResponse(400, "No path parameters")
    }
    const batchId = event.pathParameters.batchId;
    //Try connecting to the Database
    try {
        await client.connect();

    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the DataBase")
    }
    let res;
    //Try querying the DataBase
    try {
        res = await client.query(text, [batchId])

    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the created trainer
    await client.end()
    return new HTTPResponse(200, res.rows)
};