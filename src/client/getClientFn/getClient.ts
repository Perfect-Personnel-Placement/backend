import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM client WHERE clientid = $1';

/**
 * Get Client Handler - Gets a single client by id
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Jared Burkamper
 * @author Brandon Kirsch
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Return failure if path parameters not provided correctly
  if (!event.pathParameters || !event.pathParameters.clientId)
    return new HTTPResponse(
      400,
      'No path parameter given: expected clientId as number.'
    );
  const currId: number = parseInt(event.pathParameters.clientId);
  if (isNaN(currId))
    return new HTTPResponse(
      400,
      'Path parameter given is not a number: expected clientId as a number.'
    );

  // Get the data from the db
  try {
    const res = await pgClient.query(text, [currId]);
    return new HTTPResponse(200, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      Message: 'The database rejected the query.',
      err
    });
  }
}
