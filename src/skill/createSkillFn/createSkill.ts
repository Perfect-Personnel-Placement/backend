import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'INSERT INTO skill (skillname) VALUES ($1) RETURNING *';


export interface createSkills {
    // skillid: number;
    skillName: string;
}

/**
 * Create Skill Handler - Used to create a new skill in the database
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Jacob Kula
 */
export default async function handler(event: APIGatewayProxyEvent) {
    //checks if there is a body in the request 
    if (!event.body) {
        return new HTTPResponse(400, {
            error:
              'No body was given; nothing to do. Body must be formatted as follows',
            body: {
              skillName: 'string',
            }
          });
    }
    // parses the information from the body
    const skill: createSkills = JSON.parse(event.body)

    if (
        typeof skill.skillName != 'string'
      ) {
        return new HTTPResponse(400, {
          error: 'Body was missing information. Body must be formatted as follows:',
          body: {
            skillName: 'string',
          }
        });
      }

    // Assign the data or return an error if it doesnt work
    const skillData = [skill.skillName];
    let res;

    try {
        res = await client.query(text, skillData)
        console.log(res.rows);
        return new HTTPResponse(201, res.rows)

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
    // closes the query and then returns a code
}
