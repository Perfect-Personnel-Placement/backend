import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text =
  'INSERT INTO curriculum' +
  ' (createdby, createdon, lastmodified, lastmodifiedby, curriculumname)' +
  ' VALUES ($1, $2, $3, $4, $5) RETURNING *';

export interface createCurr {
  createdby: string;
  createdon: string;
  curriculumname: string;
}

// Written by MJS
export default async function handler(event: APIGatewayProxyEvent) {
  // Check that data was provided, then assign the data to a variable
  if (!event.body) {
    return new HTTPResponse(400, 'No body is given');
  }
  const curr: createCurr = JSON.parse(event.body);

  // Attempt to connect to the database
  try {
    await client.connect();
  } catch (err) {
    console.log(err);
    return new HTTPResponse(500, 'Unable to Connect to the Database');
  }

  // Set up query values into an array as required by postgres
  const currData = [
    curr.createdby,
    curr.createdon,
    curr.createdon,
    curr.createdby,
    curr.curriculumname
  ];
  let res;

  // Assign data or return error provided by the database
  try {
    res = await client.query(text, currData);
  } catch (err) {
    console.log(err);
    await client.end();
    return new HTTPResponse(400, 'Unable to Query the information');
  }

  // Close the databse connection and return the data
  await client.end();
  return new HTTPResponse(201, res.rows);
}
