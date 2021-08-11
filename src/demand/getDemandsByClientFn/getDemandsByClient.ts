import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../../global/objects";
import client from "../../global/postgres";
const text = "SELECT * FROM clientdemand WHERE (clientid = $1)";

/**
 * Get Demand by Id Handler - Used to get the demand with the specified clientId.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Brandon Kirsch, Nick Wang
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Double-checks that neither pathParameters nor clientId are undefined
  //  If undefined, reject with code 400
  if (!event.pathParameters || !event.pathParameters.clientId) {
    return new HTTPResponse(
      400,
      "No path parameter was given; expected clientId."
    );
  }
  const demandClient = event.pathParameters.clientId;

  const demandData = [demandClient];
  let res;

  // Attempts to retrieve rows using clientId.
  try {
    res = await client.query(text, demandData);
    console.log(res.rows);
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
