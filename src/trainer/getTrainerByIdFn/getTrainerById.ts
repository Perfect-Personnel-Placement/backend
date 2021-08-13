import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres queries
const text = 'SELECT * FROM trainer WHERE (trainerid = $1) RETURNING *';
const curriculumQuery = 'SELECT * FROM trainer_curriculum WHERE trainerid = $1';

/**
 * Get Trainer By ID Handler - Gets a single trainer by ID.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Samuel Smetzer
 * @author Daguinson Fleurantin
 */
export default async function handler(event: APIGatewayProxyEvent) {
  //Check if the path parameters were null
  if (!event.pathParameters || !event.pathParameters.trainerId) {
    return new HTTPResponse(400, 'No path parameters');
  }
  const trainer = [event.pathParameters.trainerId];

  //Try querying the DataBase
  try {
    const res = await client.query(text, trainer);
    const curriculumArray = await client.query(curriculumQuery, [trainer]);
    res.rows[0].curriculaIdArr = curriculumArray.rows;
    return new HTTPResponse(200, res.rows);
  } catch (err: any) {
    let displayError: string;
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = 'Unknown error.';
    }
    return new HTTPResponse(400, {
      Message: 'The database rejected the query.',
      db_error: displayError
    });
  }
}
