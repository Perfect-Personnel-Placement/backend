import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

const text =
  'INSERT INTO batch' +
  ' (batchsize, curriculumid, enddate, startdate, trainerid, clientid)' +
  ' VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

export interface createBatches {
  batchSize: number;
  curriculumId: number;
  endDate: string;
  startDate: string;
  trainerId: number | null;
  clientId: number | null;
}


/**
 * Insert Curriculum Handler - Used to create a new curriculum in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author First Lambda Implementation by Backend Team
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Check that data was provided, then assign the data to a variable
  if (!event.body) {
    return new HTTPResponse(400, {
      error:
        'No body was given; nothing to do. Body must be formatted as follows',
      body: {
        batchSize : 'number',
        curriculumId: 'number',
        endDate: 'string in ISO 8601 format',
        startDate: 'string in ISO 8601 format',
        trainerId: 'number or null',
        clientId: 'number or null'
      }
    });
  }
  const batch: createBatches = JSON.parse(event.body);


  // Set up query values into an array as required by postgres
  const batchData = [
    batch.batchSize,
    batch.curriculumId,
    batch.endDate,
    batch.startDate,
    batch.trainerId,
    batch.clientId
  ];

      // Check that data has expected key-value pairs
      if (
        typeof batch.batchSize != 'number' ||
        typeof batch.curriculumId != 'number' ||
        typeof batch.endDate != 'string'||
        typeof batch.startDate != 'string' ||
        ((typeof batch.trainerId != 'number') && (typeof batch.trainerId != null)) ||
        ((typeof batch.clientId != 'number') && (typeof batch.trainerId != null))
      ) {
        return new HTTPResponse(400, {
          error: 'Body was missing information. Body must be formatted as follows:',
          body: {
            batchSize : 'number',
            curriculumId: 'number',
            endDate: 'string in ISO 8601 format',
            startDate: 'string in ISO 8601 format',
            trainerId: 'number',
            clientId: 'number'
          }
        });
      }

  // Assign data or return error provided by the database
  let res;
  try {
    res = await client.query(text, batchData);
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

  // Close the databse connection and return the data
  return new HTTPResponse(201, res.rows);
}
