import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'DELETE FROM batch WHERE (batchid = $1) RETURNING *';

/**
 * Insert Curriculum Handler - Used to create a new curriculum in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan
 */
export default async function handler(event: APIGatewayProxyEvent) {
    //Check if the path parameters are null
    if (!event.pathParameters || !event.pathParameters.batchId) {
        return new HTTPResponse(
            400,
            'No path parameter was given; expected batchId as a number.'
          );
    }
    const batchId = event.pathParameters.batchId;
    //Ensure that batchId is a number
    const batchIdLem: number = parseInt(event.pathParameters.batchId);
    if (isNaN(batchIdLem)) {
     return new HTTPResponse(
         400,
        'Path parameter given is not a number; expected batchId as a number.'
      );
    }

    let res;
    //Try querying the DataBase
    try {
        res = await client.query(text, [batchId])

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
    //Return the created trainer
    return new HTTPResponse(200, res.rows)
};