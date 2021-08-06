import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM skill WHERE (skillid = $1)';

// written by BWK
export default async function handler(event: APIGatewayProxyEvent) {
    // Double-checks that neither pathParameters nor skillId are undefined
    //  If undefined, reject with code 400
    if (!event.pathParameters || !event.pathParameters.skillId) {
        return new HTTPResponse(400, "Invalid path parameters")
    }
    const skill = (event.pathParameters.skillId)

    // Attempt to establish a connection; in the case of a failure, give
    //  error code 500
    try {
        await client.connect();
    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }

    const skillData = [skill];
    let res;

    // Attempts to retrieve rows using skillId.
    try {
        res = await client.query(text, skillData)
    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }

    // If all went well, returns everything that the query retrieved
    await client.end()
    console.log(res.rows);
    return new HTTPResponse(200, res.rows)
};