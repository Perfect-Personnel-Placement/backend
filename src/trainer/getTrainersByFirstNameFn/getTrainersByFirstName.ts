import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM trainer WHERE (trainerfirst = $1) RETURNING *';

/**
 * Get Trainer By First Name Handler - Gets a single trainer by first name.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Samuel Smetzer
 * @author Daguinson Fleurantin
 */
export default async function handler(event: APIGatewayProxyEvent) {
    // Return error if no path parameters provided
    if (!event.pathParameters || !event.pathParameters.trainerfirst) {
        return new HTTPResponse(400, "Missing expected path parameters. Please provide a value for trainer first name")
    }
    const trainer = event.pathParameters.trainerId

    const trainerData = [trainer];
    let res;
    // Get the data from the db
    try {
        res = await client.query(text, trainerData)
        return new HTTPResponse(200, res.rows)
    } catch (err: any) {
        console.log(err);
        let displayError: string;
        if (err.detail){
            displayError = err.detail;
        } else {
            displayError = 'Unknown error.';
        }
        return new HTTPResponse(400, {
            Message: 'The database rejected the query.',
            db_error: displayError
        });   
    }
};