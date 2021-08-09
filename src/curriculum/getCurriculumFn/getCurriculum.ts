import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM curriculum WHERE curriculumid = $1';
const skillQuery = 'SELECT * FROM curriculum-skills WHERE curriculumid = $1'

// Written by MJS
export default async function handler(event: APIGatewayProxyEvent) {
  // Check that parameters were given, then assign to variable
  if (!event.pathParameters) {
    return new HTTPResponse(400, 'No path parameter was given');
  }
  const currId = event.pathParameters.curriculumId;
  
  // Return data or error from database
  try {
    const res = await client.query(text, [currId]);
    const skillArray = await client.query(skillQuery, [currId]);
    res.rows[0].skills = skillArray.rows;
    return new HTTPResponse(200, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      Message: 'Unable to query the information',
      err
    });
  }
}
