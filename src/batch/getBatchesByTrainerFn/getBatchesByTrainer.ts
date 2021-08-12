import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM batch WHERE (trainerid = $1)';

/**
 * Insert Curriculum Handler - Used to create a new curriculum in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan
 */
export default async function handler(event: APIGatewayProxyEvent) {
    // Double-checks that neither pathParameters nor trainerId are undefined
    //  If undefined, reject with code 400
    if (!event.pathParameters || !event.pathParameters.trainerId) {
        return new HTTPResponse(
            400,
            'No path parameter was given; expected trainerId as a number.'
          );
    }
    const trainerId = (event.pathParameters.trainerId);
    //Ensure that trainerId is a number
    const trainerIdLem: number = parseInt(event.pathParameters.trainerId);
    if (isNaN(trainerIdLem)) {
     return new HTTPResponse(
         400,
        'Path parameter given is not a number; expected trainerId as a number.'
      );
    }



    const data = [trainerId];
    let res;

    // Attempts to retrieve rows using skillId.
    try {
        res = await client.query(text, data)
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

    // If all went well, returns everything that the query retrieved
    console.log(res.rows);
    return new HTTPResponse(200, res.rows)
};