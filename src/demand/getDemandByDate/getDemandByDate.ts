import { APIGatewayProxyEvent } from 'aws-lambda';
import { Events } from 'pg';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM demand WHERE needby BETWEEN $1 AND $2 RETURNING *';

//Written by Nick Wang
export default async function handler(event: APIGatewayProxyEvent) {
    //Check if the path parameters were null
    if (!event.pathParameters || !event.pathParameters.start || !event.pathParameters.end) {
        return new HTTPResponse(400, "No path parameters")
    }
    const start = event.pathParameters.start;
    const end = event.pathParameters.end;
    const demandData = [start,end];
    let res;
    //Try querying the DataBase
    try {
        res = await client.query(text, demandData)

    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the row deleted
    return new HTTPResponse(200, res.rows)
};