import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM demand WHERE (demandid = $1)';

/**
 * Get Demand by Id Handler - Used to get the specified demand.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Brandon Kirsch
 * @author Nick Wang
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Double-checks that neither pathParameters nor demandId are undefined
  //  If undefined, reject with code 400
  if (!event.pathParameters || !event.pathParameters.demandId) {
    return new HTTPResponse(
      400,
      'No path parameter was given; expected demandId.'
    );
  }
  const demand = [event.pathParameters.demandId];

  // Attempts to retrieve rows using demandId.
  try {
    const res = await client.query(text, demand);
    return new HTTPResponse(200, res.rows);
  } catch (err: any) {
    let displayError: string;
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = 'Unknown error.';
    }
    return new HTTPResponse(400, {
      error: 'The database has rejected the query.',
      db_error: displayError
    });
  }
}
