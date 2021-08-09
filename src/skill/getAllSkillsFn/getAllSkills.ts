import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM skill';

// Written by BWK
export default async function handler(event: APIGatewayProxyEvent) {
    let res;

    // Queries the database using the query written in the text variable
    try {
        res = await client.query(text)

    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }

    // Returns all rows queried
    return new HTTPResponse(200, res.rows)
};