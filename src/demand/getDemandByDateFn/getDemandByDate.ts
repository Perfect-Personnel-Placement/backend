import { APIGatewayProxyEvent } from "aws-lambda";
import { Events } from "pg";
import { HTTPResponse } from "../../global/objects";
import client from "../../global/postgres";
const text = "SELECT * FROM demand WHERE needby BETWEEN $1 AND $2 RETURNING *";

/**
 * Get Demand by Date Handler - Used to get all demands in a specified date range from the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Nick Wang
 */
export default async function handler(event: APIGatewayProxyEvent) {
  //Check if the path parameters were null
  if (
    !event.pathParameters ||
    !event.pathParameters.start ||
    !event.pathParameters.end
  ) {
    return new HTTPResponse(
      400,
      "No path parameter was given, or path parameters were missing; expected curriculumId and start/end dates."
    );
  }
  const start = event.pathParameters.start;
  const end = event.pathParameters.end;
  const demandData = [start, end];
  let res;
  //Try querying the DataBase
  try {
    res = await client.query(text, demandData);
    //Return the row deleted
    return new HTTPResponse(200, res.rows);
  } catch (err: any) {
    let displayError: string;
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = "Unknown error.";
    }
    return new HTTPResponse(400, {
      error: "The database has rejected the query.",
      db_error: displayError,
    });
  }
}
