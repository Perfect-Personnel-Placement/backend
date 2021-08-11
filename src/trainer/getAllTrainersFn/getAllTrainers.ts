import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM trainer';

/**
 * Get All Trainer Handler - Gets the complete list of trainer in the table.
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Samuel Smetzer
 * @author Daguinson Fleurantin
 */
export default async function handler(event: APIGatewayProxyEvent) {
    // Return data or error provided by the database
    let res;
    try {
        res = await client.query(text)
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