import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM curriculum WHERE curriculumid = $1';

// Written by MJS
export default async function handler(event: APIGatewayProxyEvent) {
  // Check that parameters were given, then assign to variable
  if (!event.pathParameters) {
    return new HTTPResponse(400, 'No path parameters is given');
  }
  const currId = event.pathParameters.curriculumId;

  // Attempt to connect to database
  try {
    await client.connect();
  } catch (err) {
    console.log(err);
    return new HTTPResponse(500, 'Unable to connect to the database');
  }

  // Set data to variable or return error from database
  let res;
  try {
    res = await client.query(text, [currId]);
  } catch (err) {
    console.log(err);
    await client.end();
    return new HTTPResponse(400, 'Unable to query the information');
  }

  // Close database connection and return data
  await client.end();
  return new HTTPResponse(200, res.rows);
}
