import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'SELECT * FROM client';

export interface createClient {
    clientName: string;
}

/**
 * Get All Clients Handler - Gets all clients in the database
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Jared Burkamper
 */
export default async function handler(event: APIGatewayProxyEvent) {
    // Get the data from the db
    let res;
    try {
        res = await pgClient.query(text)
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, {message: "The database rejected the query", err})
    }

    // Return success
    return new HTTPResponse(200, res.rows)
};