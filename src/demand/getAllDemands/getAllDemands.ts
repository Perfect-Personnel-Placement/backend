import { HTTPResponse } from '../../global/objects';
import { APIGatewayProxyEvent } from 'aws-lambda';

import client from '../../global/postgres';
const text = 'SELECT * FROM demand';

// Written by DF
export default async function handler(event: APIGatewayProxyEvent) {
 

  // Assign data or return error provided by the database
  let res;
  try {
    res = await client.query(text);
  } catch (err) {
    console.log(err);
    return new HTTPResponse(400, 'Unable to Query the informatio');
  }

  // Close the database connection and return the data
  return new HTTPResponse(200, res.rows);
}
