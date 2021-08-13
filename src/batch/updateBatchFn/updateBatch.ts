import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';

// Postgres query
const text =
  'UPDATE batch ' +
  'SET batchsize = $1, curriculumid = $2, enddate = $3, startdate = $4, ' +
  'trainerid = $5, clientid = $6 WHERE batchid = $7 RETURNING *';

//Expected input from HTTP Request Body
export interface SetBatch {
  batchSize: number;
  batchId: number;
  curriculumId: number;
  endDate: string;
  startDate: string;
  trainerId: number | null;
  clientId: number | null;
}

/**
 * Update Batch Handler - Used to create a new curriculum in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan
 */

export default async function handler(event: APIGatewayProxyEvent) {
  // Return an error if no body provided
  if (!event.body) {
    return new HTTPResponse(400, {
      error:
        'No body was given; nothing to do. Body must be formatted as follows',
      body: {
        batchSize: 'number',
        curriculumId: 'number',
        endDate: 'string in ISO 8601 format',
        startDate: 'string in ISO 8601 format',
        trainerId: 'number or null',
        clientId: 'number or null',
        batchId: 'number'
      }
    });
  }
  const batch: SetBatch = JSON.parse(event.body);

  // Check that data has expected key-value pairs
  if (
    typeof batch?.batchSize != 'number' ||
    typeof batch.curriculumId != 'number' ||
    typeof batch.endDate != 'string' ||
    typeof batch.startDate != 'string' ||
    typeof batch.trainerId != 'number' ||
    typeof batch.clientId != 'number' ||
    typeof batch.batchId != 'number'
  ) {
    return new HTTPResponse(400, {
      error: 'Body was missing information. Body must be formatted as follows:',
      body: {
        batchSize: 'number',
        curriculumId: 'number',
        endDate: 'string in ISO 8601 format',
        startDate: 'string in ISO 8601 format',
        trainerId: 'number',
        clientId: 'number',
        batchId: 'number'
      }
    });
  }

  // Set up query values into an array as required by postgres
  const batchData = [
    batch.batchSize,
    batch.curriculumId,
    batch.endDate,
    batch.startDate,
    batch.trainerId,
    batch.clientId,
    batch.batchId
  ];

  // Assign data or return error provided by the database
  try {
    const res = await pgClient.query(text, batchData);
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
