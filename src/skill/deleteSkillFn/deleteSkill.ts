import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'DELETE FROM skill WHERE (skillid = $1) RETURNING *';

/**
 * Delete Skill Handler - Used to delete a skill in the database
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Jacob Kula
 */
export default async function handler(event: APIGatewayProxyEvent) {
    // checks if there is a body
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
    // assigns the data or throws and error
    try {
        res = await client.query(text, skillData)
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
