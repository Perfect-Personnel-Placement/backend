import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'INSERT INTO client (clientname)' + ' VALUES ($1) RETURNING *';

export interface createClient {
  clientName: string;
}

// Written by JB
export default async function handler(event: APIGatewayProxyEvent) {
  // Return an error if no body provided
  if (!event.body) {
    return new HTTPResponse(400, 'No body is given');
  }
  const client: createClient = JSON.parse(event.body);

  // Send the data to the db
  const clientData = [client.clientName];
  try {
    const res = await pgClient.query(text, clientData);
    return new HTTPResponse(201, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      Message: 'Unable to query the information',
      err
    });
  }
}
