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

// Written by backend as group
export default async function handler(event: APIGatewayProxyEvent) {
  // Check that data was provided, then assign the data to a variable
  if (!event.body) {
    return new HTTPResponse(400, 'No body is given');
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

  // Assign data or return error provided by the database
  let res;
  try {
    res = await client.query(text, batchData);
  } catch (err) {
    console.log(err);
    return new HTTPResponse(400, 'Unable to Query the information');
  }

  // Close the databse connection and return the data
  return new HTTPResponse(201, res.rows);
}
