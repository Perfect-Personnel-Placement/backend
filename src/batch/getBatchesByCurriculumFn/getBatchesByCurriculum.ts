import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM batch WHERE (curriculumid = $1)';

/**
 * Get Batches by Curriculum Handler - Use to get all batches using a curriculum
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Double-checks that neither pathParameters nor curriculumId are undefined
  // If undefined, reject with code 400
  if (!event.pathParameters || !event.pathParameters.curriculumId) {
    return new HTTPResponse(
      400,
      'No path parameter was given; expected curriculumId as a number.'
    );
  }
  const curriculumId = event.pathParameters.curriculumId;
  // Ensure that curriculumId is a number; if not, reject.
  // curriculumId was not set to a number directly as the query will be a string
  if (isNaN(parseInt(curriculumId))) {
    return new HTTPResponse(
      400,
      'Path parameter given is not a number; expected curriculumId as a number.'
    );
  }

  const data = [curriculumId];
  // Attempts to retrieve rows using skillId.
  try {
    const res = await client.query(text, data);
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
