import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'SELECT * FROM client';

export interface createClient {
    clientName: string;
}

// written by JB
export default async function handler(event: APIGatewayProxyEvent) {
    // Connect to the db
    try {
        await pgClient.connect();
    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }
    
    // Get the data from the db
    let res;
    try {
        res = await pgClient.query(text)
    } catch (err) {
        console.log(err);
        await pgClient.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }

    // Return success
    await pgClient.end()
    return new HTTPResponse(200, res.rows)
};