import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text =
  'INSERT INTO curriculum' +
  ' (createdby, createdon, lastmodified, lastmodifiedby, curriculumname)' +
  ' VALUES ($1, $2, $3, $4, $5) RETURNING *';

const skillQuery =
  'INSERT INTO curriculum_skill' +
  ' (skillid, curriculumid)' +
  ' Values ($1, $2) RETURNING *';

export interface createCurr {
  createdby: string;
  createdon: string;
  curriculumname: string;
  skillIdArr: number[];
}

/**
 * Insert Curriculum Handler: Used to create a new curriculum in the database.
 * @param event: APIGatewayProxyEvent
 * @returns HTTPResponse
 * @author Marc Skwarczynski
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Check that data was provided, then assign the data to a variable
  if (!event.body) {
    return new HTTPResponse(400, {
      error:
        'No body was given; nothing to do. Body must be formatted as follows',
      body: {
        createdby: 'string',
        createdon: 'string in ISO 8601 format',
        curriculumname: 'string',
        skillIdArr: 'number[]'
      }
    });
  }
  const curr: createCurr = JSON.parse(event.body);

  // Check that data has expected key-value pairs
  if (
    !curr.createdby ||
    !curr.createdon ||
    !curr.curriculumname ||
    !curr.skillIdArr
  ) {
    return new HTTPResponse(400, {
      error: 'Body was missing information. Body must be formatted as follows:',
      body: {
        createdby: 'string',
        createdon: 'string in ISO 8601 format',
        curriculumname: 'string',
        skillIdArr: 'number[]'
      }
    });
  }

  // Set up query values into an array as required by postgres
  const currData = [
    curr.createdby,
    curr.createdon,
    curr.createdon,
    curr.createdby,
    curr.curriculumname
  ];

  // Return data or error provided by the database
  try {
    const res = await client.query(text, currData);
    if (curr.skillIdArr) {
      const curriculumid = res.rows[0].curriculumid;
      // Insert data into the skill-curriculum join table
      for (let elem of curr.skillIdArr) {
        const skillData = [elem, curriculumid];
        await client.query(skillQuery, skillData);
      }
    }
    return new HTTPResponse(201, res.rows);
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
