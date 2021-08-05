import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'SELECT * FROM client WHERE clientname = $1';

export interface createClient {
    clientName: string;
}

export default async function handler(event: APIGatewayProxyEvent) {
    if (!event.pathParameters || !event.pathParameters.clientName) return new HTTPResponse(400, "Invalid input");
    const data = [event.pathParameters.clientName]
    
    try {
        await pgClient.connect();
    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }
    
    let res;
    try {
        res = await pgClient.query(text, data)
    } catch (err) {
        console.log(err);
        await pgClient.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }

    await pgClient.end()
    return new HTTPResponse(200, res.rows)
};