import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM batch WHERE (trainerid = $1)';

// written by MH
export default async function handler(event: APIGatewayProxyEvent) {
    // Double-checks that neither pathParameters nor trainerId are undefined
    //  If undefined, reject with code 400
    if (!event.pathParameters || !event.pathParameters.trainerId) {
        return new HTTPResponse(400, "Invalid path parameters")
    }
    const trainerId = (event.pathParameters.trainerId)



    const data = [trainerId];
    let res;

    // Attempts to retrieve rows using skillId.
    try {
        res = await client.query(text, data)
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }

    // If all went well, returns everything that the query retrieved
    console.log(res.rows);
    return new HTTPResponse(200, res.rows)
};