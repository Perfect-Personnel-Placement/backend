import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'SELECT * FROM client WHERE clientid = $1';

export interface createClient {
  clientId: string;
}

// written by JB
export default async function handler(event: APIGatewayProxyEvent) {
  // Return failure if path parameters not provided
  if (!event.pathParameters || !event.pathParameters.clientId)
    return new HTTPResponse(400, 'Invalid input');
  const data = [event.pathParameters.clientId];

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
