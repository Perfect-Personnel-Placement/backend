import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'SELECT * FROM client WHERE clientname = $1';

export interface createClient {
  clientName: string;
}

// written by jb
export default async function handler(event: APIGatewayProxyEvent) {
  // Return error if no path parameters provided
  if (!event.pathParameters || !event.pathParameters.clientName)
    return new HTTPResponse(400, 'Invalid input');
  const data = [event.pathParameters.clientName];

  // Get the data from the db
  try {
    const res = await pgClient.query(text, data);
    return new HTTPResponse(200, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      Message: 'Unable to Query the information',
      err
    });
  }
}
