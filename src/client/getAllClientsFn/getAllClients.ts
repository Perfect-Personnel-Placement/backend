import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'SELECT * FROM client';

export interface createClient {
    clientName: string;
}

// written by JB
export default async function handler(event: APIGatewayProxyEvent) {
    // Get the data from the db
    let res;
    try {
        res = await pgClient.query(text)
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, {message: "Unable to Query the information", err})
    }

    // Return success
    return new HTTPResponse(200, res.rows)
};