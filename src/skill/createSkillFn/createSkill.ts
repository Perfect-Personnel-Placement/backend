import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'INSERT INTO skill (skillname) VALUES ($1) RETURNING *';

export interface createSkills {
    // skillid: number;
    skillname: string;
}

export default async function handler(event: APIGatewayProxyEvent) {
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    const skill: createSkills = JSON.parse(event.body)

    try {
        await client.connect();

    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }

    const skillData = [skill.skillname];
    let res;

    try {
        res = await client.query(text, skillData)

    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }

    await client.end()
    console.log(res.rows);
    return new HTTPResponse(201, res.rows)
};
