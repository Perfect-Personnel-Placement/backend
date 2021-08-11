import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../../global/objects";
import client from "../../global/postgres";
const baseText = "SELECT * FROM clientdemand WHERE (curriculumid = $1)";
const optionalText = " AND (needby BETWEEN $2 AND $3)";

export interface getDemandByCurriculum {
  curriculumId: string;
  startDate?: string;
  endDate?: string;
}
/**
 * Get Demand by Curriculum Handler - Used to get all demands with a specified curriculum from the database. Optional date parameters can also be given.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Brandon Kirsch, Nick Wang
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Double-checks that neither pathParameters nor curriculumId are undefined
  //  If undefined, reject with code 400
  if (!event.pathParameters || !event.pathParameters.curriculumId) {
    return new HTTPResponse(
      400,
      "No path parameter was given; expected curriculumId as a number and optional start/end date."
    );

    // If defined, but only a partial date range is found
  } else if (!event.pathParameters.startDate && event.pathParameters.endDate) {
    return new HTTPResponse(
        400,
        "Only end date was given; expected both start and end date, or neither."
      );
  } else if (event.pathParameters.startDate && !event.pathParameters.endDate) {
    return new HTTPResponse(
        400,
        "Only start date was given; expected both start and end date, or neither."
      );
  }

  const demand: getDemandByCurriculum = {
    curriculumId: event.pathParameters.curriculumId,
    startDate: event.pathParameters.startDate,
    endDate: event.pathParameters.endDate,
  };
  const demandData = [demand.curriculumId, demand.startDate, demand.endDate];

  let res, text;
  // Appends second half of the query to the first, but only if dates are provided
  if (demand.startDate && demand.endDate) {
    text = baseText + optionalText;
  } else {
    text = baseText;
  }

  // Attempts to retrieve rows using curriculumId.
  try {
    res = await client.query(text, demandData);
    // If all went well, returns everything that the query retrieved
    return new HTTPResponse(200, res.rows);
  } catch (err) {
    let displayError: string;
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = "Unknown error.";
    }
    return new HTTPResponse(400, {
      error: "The database has rejected the query.",
      db_error: displayError
    });
  }

}
