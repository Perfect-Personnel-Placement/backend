import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'DELETE FROM curriculum WHERE curriculumid = $1';

/**
 * Delete Curriculum Handler - Delete a single curriculum by id
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Marc Skwarczynski
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Check that parameters were given, then assign to variable
  if (!(event.pathParameters && event.pathParameters.curriculumId)) {
    return new HTTPResponse(
      400,
      'No path parameter was given; expected curriculumId as a number.'
    );
  }
  const currId: number = parseInt(event.pathParameters.curriculumId);
  if (isNaN(currId)) {
    return new HTTPResponse(
      400,
      'Path parameter given is not a number; expected curriculumId as a number.'
    );
  }

  // Return data or error from database
  try {
    const res = await client.query(text, [currId]);
    return new HTTPResponse(200, res.rows);
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
