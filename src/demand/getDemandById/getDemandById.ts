import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM clientdemand WHERE (clientdemandid = $1)';

// written by BWK
export default async function handler(event: APIGatewayProxyEvent) {
    // Double-checks that neither pathParameters nor clientDemandId are undefined
    //  If undefined, reject with code 400
    if (!event.pathParameters || !event.pathParameters.clientDemandId) {
        return new HTTPResponse(400, "Invalid path parameters")
    }
    const demand = (event.pathParameters.clientDemandId)

    // Attempt to establish a connection; in the case of a failure, give
    //  error code 500
    try {
        await client.connect();
    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }

    const demandData = [demand];
    let res;

    // Attempts to retrieve rows using clientDemandId.
    try {
        res = await client.query(text, demandData)
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