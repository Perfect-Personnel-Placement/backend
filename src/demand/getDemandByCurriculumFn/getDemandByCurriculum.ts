import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const baseText = 'SELECT * FROM clientdemand WHERE (curriculumid = $1)';
const optionalText = ' AND (needby BETWEEN $2 AND $3)';

export interface getDemandByCurriculum {
    curriculumId: string,
    startDate?: string,
    endDate?: string
}

// written by BWK
export default async function handler(event: APIGatewayProxyEvent) {
    // Double-checks that neither pathParameters nor curriculumId are undefined
    //  If undefined, reject with code 400
    if (!event.pathParameters || !event.pathParameters.curriculumId) {
        return new HTTPResponse(400, "Invalid path parameters")

    // If defined, but only a partial date range is found
    } else if (!event.pathParameters.startDate && event.pathParameters.endDate) {
        return new HTTPResponse(400, "Path parameter missing")
    } else if (event.pathParameters.startDate && !event.pathParameters.endDate) {
        return new HTTPResponse(400, "Path parameter missing")
    }

    const demand: getDemandByCurriculum = {
        curriculumId: event.pathParameters.curriculumId,
        startDate: event.pathParameters.startDate,
        endDate: event.pathParameters.endDate
    }
    const demandData = [
        demand.curriculumId,
        demand.startDate,
        demand.endDate
    ];

    let res, text;
    // Appends second half of the query to the first, but only if dates are provided
    if (demand.startDate && demand.endDate) {
        text = baseText + optionalText;
    } else {
        text = baseText;
    }

    // Attempts to retrieve rows using curriculumId.
    try {
        res = await client.query(text, demandData)
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }

    // If all went well, returns everything that the query retrieved
    console.log(res.rows);
    return new HTTPResponse(200, res.rows)
};