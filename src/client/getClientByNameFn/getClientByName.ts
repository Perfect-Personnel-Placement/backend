import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM client WHERE clientname = $1';

/**
 * Get Client by Name Handler - Gets a single client by name
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Jared Burkamper
 * @author Brandon Kirsch
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Return error if no path parameters provided
  if (!event.pathParameters || !event.pathParameters.clientName)
    return new HTTPResponse(
      400,
      'Missing expected path parameters. Please provide a value for clientName'
    );
  const data = [event.pathParameters.clientName];

  // Get the data from the db
  try {
    const res = await pgClient.query(text, data);
    return new HTTPResponse(200, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      Message: 'The database rejected the query',
      err
    });
  }
}
