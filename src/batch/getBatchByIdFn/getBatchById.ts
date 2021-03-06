import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM batch WHERE (batchid = $1)';

/**
 * Get Batch By ID Handler - Used to get a specific batch from the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Tyler Yates
 */
export default async function handler(event: APIGatewayProxyEvent) {
  //Check if the path parameters were null, assign to variable
  if (!event.pathParameters || !event.pathParameters.batchId) {
    return new HTTPResponse(
      400,
      'No path parameter was given; expected batchId as a number.'
    );
  }
  const data = [event.pathParameters.batchId];

  //Ensure that the provided batchId is a number
  const batchIdLem: number = parseInt(event.pathParameters.batchId);
  if (isNaN(batchIdLem)) {
    return new HTTPResponse(
      400,
      'Path parameter given is not a number; expected batchId as a number.'
    );
  }

  //Try querying the database
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
