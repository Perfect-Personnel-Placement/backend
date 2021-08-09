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

// Written by MJS
export default async function handler(event: APIGatewayProxyEvent) {
  // Check that data was provided, then assign the data to a variable
  if (!event.body) {
    return new HTTPResponse(400, 'No body is given');
  }
  const curr: createCurr = JSON.parse(event.body);

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
    if(curr.skillIdArr){
    const curriculumid = res.rows[0].curriculumid ;
  // added the logic for the skill-curriculum join table
      for(let elem of curr.skillIdArr){
        const skillData = [elem, curriculumid];
        await client.query(skillQuery, skillData);
      }
  }
    return new HTTPResponse(201, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      Message: 'Unable to Query the information',
      err
    });
  }
}
