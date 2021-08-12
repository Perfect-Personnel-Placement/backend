import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../../global/objects";
import client from "../../global/postgres";
const text =
  "INSERT INTO demand (clientid, curriculumid, needby, quantitydemanded)" +
  " VALUES ($1, $2, $3, $4) RETURNING *";

export interface createDemand {
  clientid: number;
  curriculumid: number;
  needby: string;
  quantitydemanded: number;
}
/**
 * Create Demand Handler - Used to create a new Demand in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Nick Wang
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Check if body is null
  if (!event.body) {
    return new HTTPResponse(400, {
      error:
        "No body was given; nothing to do. Body must be formatted as follows",
      body: {
        clientid: "number",
        curriculumid: "number",
        needby: "string in ISO 8601 format",
        quantitydemanded: "number",
      },
    });
  }
  const demand: createDemand = JSON.parse(event.body);
  // Check that data has expected key-value pairs
  if (
    typeof demand.clientid != "number" ||
    typeof demand.curriculumid != "number" ||
    typeof demand.needby != "string" ||
    typeof demand.quantitydemanded != "number"
  ) {
    return new HTTPResponse(400, {
      error: "Body was missing information. Body must be formatted as follows:",
      body: {
        clientid: "number",
        curriculumid: "number",
        needby: "string in ISO 8601 format",
        quantitydemanded: "number",
      },
    });
  }

  //Data to be inserted into the INSERT query
  const trainerData = [
    demand.clientid,
    demand.curriculumid,
    demand.needby,
    demand.quantitydemanded,
  ];
  let res;
  //Try the querying the Database
  try {
    res = await client.query(text, trainerData);
    //Return created user
    return new HTTPResponse(201, res.rows);
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
