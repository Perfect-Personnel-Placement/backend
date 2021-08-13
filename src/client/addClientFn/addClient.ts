import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';

// Postgres query
const text = 'INSERT INTO client (clientname)' + ' VALUES ($1) RETURNING *';

//Expected input from HTTP Request Body
export interface CreateClient {
  clientName: string;
}

/**
 * Insert Client Handler - Used to create a new client in the database
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Jared Burkamper
 * @author Brandon Kirsch
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Return an error if no body provided
  if (!event.body) {
    return new HTTPResponse(400, {
      error:
        'No body was given; nothing to do. Body must be formatted as follows',
      body: {
        clientName: 'string'
      }
    });
  }
  const client: CreateClient = JSON.parse(event.body);

  if (typeof client.clientName != 'string') {
    return new HTTPResponse(400, {
      error: 'Body was missing information. Body must be formatted as follows',
      body: {
        clientName: 'string'
      }
    });
  }

  // Send the data to the db
  const clientData = [client.clientName];
  try {
    const res = await pgClient.query(text, clientData);
    return new HTTPResponse(201, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      Message: 'The database rejected the query',
      err
    });
  }
}
