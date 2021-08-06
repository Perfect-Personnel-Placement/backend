import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'INSERT INTO skill (skillname) VALUES ($1) RETURNING *';

//  written by: JAK
export interface createSkills {
    // skillid: number;
    skillName: string;
}

export default async function handler(event: APIGatewayProxyEvent) {
    //checks if there is a body in the request 
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    // parses the information from the body
    const skill: createSkills = JSON.parse(event.body)

    // Assign the data or return an error if it doesnt work
    const skillData = [skill.skillName];
    let res;

    try {
        res = await client.query(text, skillData)

    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }
    // closes the query and then returns a code
    console.log(res.rows);
    return new HTTPResponse(201, res.rows)
};