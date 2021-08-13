import pgClient from "../global/postgres";
import fs from "fs";
import { HTTPResponse } from "../global/objects";
import { APIGatewayProxyEvent } from "aws-lambda";

/**
 *
 * @param event
 * @returns
 * @author Jared Burkamper
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Parse body
  const bodyData = JSON.parse(event.body || "{}");

  // Initialize db query string
  let dbQuery = "";

  // Load drop script if body specifies
  if (bodyData.refresh) {
    try {
      dbQuery += fs
        .readFileSync("/p3/handler/SQLScripts/dropTables.sql")
        .toString();
    } catch (err) {
      console.log(err);
      return new HTTPResponse(500, {
        message: "Failed to load drop tables script",
      });
    }
  }

  // Load create script
  try {
    dbQuery += fs
      .readFileSync("/p3/handler/SQLScripts/createTables.sql")
      .toString();
  } catch (err) {
    console.log(err);
    return new HTTPResponse(500, {
      message: "Failed to load create tables script",
    });
  }

  // Load sample data script if body specifies
  if (bodyData.sampleData) {
    try {
      dbQuery += fs
        .readFileSync("/p3/handler/SQLScripts/sampleData.sql")
        .toString();
    } catch (err) {
      console.log(err);
      return new HTTPResponse(500, {
        message: "Failed to load sample data script",
      });
    }
  }

  // Run the SQL script on the database
  try {
    await pgClient.query(dbQuery);
  } catch (err) {
    console.log(err);
    return new HTTPResponse(500, {
      message: "Failed to run composite script on the database",
    });
  }

  // Indicate success
  return new HTTPResponse(200, {
    message: "Database initialized successfully",
  });
}

/**
 * A cautionary tale.
 *
 * It would be much more elegant to run this function as a CloudFormation custom resource.
 * That way, it would run automatically during 'sam deploy' and you wouldn't have to ever think about it.
 * I spent a good 10 hours trying to get that method to work. Technically it did, but since
 * the lambda functions in this stack have no access to the larger internet, there was no way
 * for the lambda to send the HTTP request required to tell CloudFormation that the creation
 * or deletion of the custom resource was successful or not. I fiddled with nat gateways,
 * public subnets, internet gateways, and various different ways to send HTTP requests for
 * the better part of a weekend, but I could never get this specific lambda to send an HTTP request.
 * The script was run on the database, but since the confirmation never came through to CloudFormation,
 * you would have to wait an hour for the request to time out and then another hour to wait for the
 * rollback delete request to time out. Why does CloudFormation expect an HTTP request? Why can't
 * the function just return the response that CloudFormation is looking for?
 *
 * Can you guess how many times I had to wait those two hours?
 *
 * I kinda wish Jeff Bezos had never been born.
 */
