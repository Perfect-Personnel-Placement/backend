import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'DELETE FROM skill WHERE (skillid = $1) RETURNING *';
// written by: JAK

export default async function handler(event: APIGatewayProxyEvent) {
    // checks if there is a body
    if (!event.pathParameters || !event.pathParameters.skillId) {
        return new HTTPResponse(400, "Invalid Path Parameters")
    }
    const skill = (event.pathParameters.skillId)
    // checks if there is an issue connecting to the database
    try {
        await client.connect();

    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }

    const skillData = [skill];
    let res;
    // assigns the data or throws and error
    try {
        res = await client.query(text, skillData)

    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }

    await client.end()
    console.log(res.rows);
    return new HTTPResponse(200, res.rows)
};
