import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM trainer WHERE (trainerlast = $1)';

/**
 * Get Trainer By Last Name Handler - Gets a single trainer by last name.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Samuel Smetzer
 * @author Daguinson Fleurantin
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Return error if no path parameters provided
  if (!event.pathParameters || !event.pathParameters.trainerLN) {
    return new HTTPResponse(
      400,
      'Missing expected path parameters. Please provide a value for trainer last name'
    );
  }
  const trainer = [event.pathParameters.trainerLN];

  // Get the data from the db
  try {
    const res = await client.query(text, trainer);
    return new HTTPResponse(200, res.rows);
  } catch (err: any) {
    let displayError: string;
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = 'Unknown error.';
    }
    return new HTTPResponse(400, {
      Message: 'The database rejected the query.',
      db_error: displayError
    });
  }
}
