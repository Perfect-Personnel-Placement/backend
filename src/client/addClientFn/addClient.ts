
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'INSERT INTO client (clientname)' +
    ' VALUES ($1) RETURNING *';

export interface createClient {
    clientName: string;
}

export default async function handler(event: APIGatewayProxyEvent) {
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    const client: createClient = JSON.parse(event.body)

    try {
        await pgClient.connect();
    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }

    const clientData = [client.clientName];
    let res;

    try {
        res = await pgClient.query(text, clientData)

    } catch (err) {
        console.log(err);
        await pgClient.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }

    await pgClient.end()
    return new HTTPResponse(201, res.rows)
};