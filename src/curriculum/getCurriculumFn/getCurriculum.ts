import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text =
  'SELECT c.*, json_agg(s.skillid) as skillIdArr, json_agg(s.skillname) as skillNameArr ' +
  'FROM curriculum c ' +
  'JOIN curriculum_skill cs ON cs.curriculumid = c.curriculumid ' +
  'JOIN skill s ON s.skillid = cs.skillid ' +
  'WHERE c.curriculumid = $1 ' +
  'GROUP BY c.curriculumid';

/**
 * Get Curriculum Handler - Gets a single curriculum by id
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Marc Skwarczynski, Jared Burkamper
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
      db_error: displayError,
    });
  }
}
