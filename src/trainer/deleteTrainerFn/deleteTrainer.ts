import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'DELETE FROM trainer WHERE (trainerid = $1) RETURNING *';

/**
 * Delete Trainer Handler - Delete a single trainer by id.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Samuel Smetzer
 * @author Daguinson Fleurantin
 */
export default async function handler(event: APIGatewayProxyEvent) {
    //Check if the path parameters were null
    if (!event.pathParameters || !event.pathParameters.trainerId) {
        return new HTTPResponse(400, 'No path parameter was given; expected trainerId as a number.');
    }
    const trainerId: number = parseInt(event.pathParameters.trainerId);
    if (isNaN(trainerId)) {
        return new HTTPResponse(400, 'Path parameter given is not a number; expected trainerId as a number')
    };

    // Return data or error from database
    try {
        const res = await client.query(text, [trainerId]);
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