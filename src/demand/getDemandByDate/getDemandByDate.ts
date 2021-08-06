import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM demand WHERE needby BETWEEN $1 AND $2 RETURNING *';

//Comments written by Samuel Smetzer
export default async function handler(event: APIGatewayProxyEvent) {
    //Check if the path parameters were null
    console.log(event.pathParameters);
    if (!event.pathParameters || !event.pathParameters.start || !event.pathParameters.end) {
        return new HTTPResponse(400, "No path parameters")
    }
    const start = event.pathParameters.start;
    const end = event.pathParameters.end;

    //Try connecting to the Databse
    try {
        await client.connect();

    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the DataBase")
    }
    const demandData = [start,end];
    let res;
    //Try querying the DataBase
    try {
        res = await client.query(text, demandData)

    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the row deleted
    await client.end()
    return new HTTPResponse(200, res.rows)
};