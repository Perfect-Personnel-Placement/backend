import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM skill';

// Written by BWK
/**
 * Get Skill Handler - Used to get all of the skills
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Brandon Kirsch
 */
export default async function handler() {
    let res;
    // Queries the database using the query written in the text variable
    try {
        res = await client.query(text)
        return new HTTPResponse(200, res.rows)
    } catch (err: any) {
        let displayError: string;
        if (err.detail) {
          displayError = err.detail;
        } else {
          displayError = 'Unknown error.';
        }
        return new HTTPResponse(400, {
          error: 'The database rejected the query.',
          db_error: displayError
        });
      }
}