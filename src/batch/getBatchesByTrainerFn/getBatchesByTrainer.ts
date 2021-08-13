import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM batch WHERE (trainerid = $1)';

/**
 * Get Batches by Trainer Handler - Used to get all batches taught by a trainer
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Double-checks that neither pathParameters nor trainerId are undefined
  // If undefined, reject with code 400
  if (!event.pathParameters || !event.pathParameters.trainerId) {
    return new HTTPResponse(
      400,
      'No path parameter was given; expected trainerId as a number.'
    );
  }
  const trainerId = event.pathParameters.trainerId;
  // Ensure that trainerId is a number
  // trainerId was not set to a number directly as the query will be a string
  if (isNaN(parseInt(trainerId))) {
    return new HTTPResponse(
      400,
      'Path parameter given is not a number; expected trainerId as a number.'
    );
  }

  const data = [trainerId];
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
