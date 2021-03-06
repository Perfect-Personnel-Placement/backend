import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM skill WHERE (skillname = $1)';

/**
 * Get Skill Handler - Used to get the skill by the skillname
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Brandon Kirsch
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Double-checks that neither pathParameters nor skillName are undefined
  // If undefined, reject with code 400
  if (!(event.pathParameters && event.pathParameters.skillName)) {
    return new HTTPResponse(
      400,
      'No path parameter was given; expected skillName as a string.'
    );
  }
  const skill = [JSON.stringify(event.pathParameters.skillName)];

  // Attempts to retrieve rows using skillName.
  try {
    const res = await client.query(text, skill);
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
