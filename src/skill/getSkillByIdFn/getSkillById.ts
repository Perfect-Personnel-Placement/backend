import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM skill WHERE (skillid = $1)';

/**
 * Get Skill Handler - Used to get the skill by the skillid
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Brandon Kirsch
 */
export default async function handler(event: APIGatewayProxyEvent) {
    // Double-checks that neither pathParameters nor skillId are undefined
    //  If undefined, reject with code 400
    if (!(event.pathParameters && event.pathParameters.skillId)) {
        return new HTTPResponse(
          400,
          'No path parameter was given; expected skillId as a number.'
        );
      }
      const skill: number = parseInt(event.pathParameters.skillId)
      if (isNaN(skill)) {
        return new HTTPResponse(
          400,
          'Path parameter given is not a number; expected skillId as a number.'
        );
      }

    const skillData = [skill];
    let res;

    // Attempts to retrieve rows using skillId.
    try {
        res = await client.query(text, skillData)
        // If all went well, returns everything that the query retrieved
        console.log(res.rows);
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

};