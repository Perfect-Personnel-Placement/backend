import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../../global/objects";
import pgClient from "../../global/postgres";
import { PublishCommand } from "@aws-sdk/client-sns";
import { snsClient } from "../../global/snsClient";
import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { sesClient } from "../../global/sesClient";

// Postgres queries
let updateBatchQuery = "UPDATE batch SET confirmed = true WHERE batchid = $1";
let checkTrainerQuery =
  "SELECT confirmed, trainerid, curriculumid, startdate FROM batch WHERE batchid = $1";
let getTrainerEmailQuery = "SELECT email FROM trainer WHERE trainerid = $1";
const getCurricNameQuery =
  "SELECT curriculumname FROM curriculum WHERE curriculumid = $1";

// HTTP Response Body object
let responseBody: any = {
  message: "Batch confirmed successfully!",
  snsStatus: "",
  sesStatus: "",
};

/**
 * Confirm Batch Handler - Used to confirm a batch in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan
 */
export default async function handler(event: APIGatewayProxyEvent) {
  console.log("Entering function!!!!!");
  // Pull data from event body after checking if the path parameters were null
  if (!event.pathParameters || !event.pathParameters.batchId) {
    return new HTTPResponse(
      400,
      "No path parameter was given; expected batchId as a number."
    );
  }
  const batchId = event.pathParameters.batchId;
  console.log("We have assigned batchId: " + batchId);
  // Make initial query to see if trainer exists
  const res = await pgClient.query(checkTrainerQuery, [batchId]);
  console.log("We have assigned res: " + res);
  if (res.rows[0] && !res.rows[0].confirmed) {
    const trainerId = res.rows[0].trainerid;
    const curriculumId = res.rows[0].curriculumid;
    const startDate = res.rows[0].startdate;
    let trainerEmail;

    // Notify trainer whose batch was confirmed
    // Grab trainer details
    try {
      const trainerResult = await pgClient.query(getTrainerEmailQuery, [
        trainerId,
      ]);
      trainerEmail = trainerResult.rows[0].email;
      console.log("Trainer email has been assigned: " + trainerEmail);
      // Update batch status to confirmed on postgres table batch
      await pgClient.query(updateBatchQuery, [batchId]);
    } catch (err: any) {
      console.log(err);
      let displayError = "";
      if (err.details) {
        displayError = err.details;
      } else {
        displayError = "Unknown Error";
      }
      return new HTTPResponse(400, {
        error:
          "Batch unable to be confirmed. Trainer or trainer email not found.",
        db_error: displayError,
      });
    }
    console.log("Batch has been confirmed");
    //Get curriculum name
    const curricNameResult = await pgClient.query(getCurricNameQuery, [
      curriculumId,
    ]);
    const curricName = curricNameResult.rows[0].curriculumname;
    console.log("curricName is: " + curricName);
    console.log("Attempting to publish to SNS...");
    // SNS
    // SNS_TOPIC_ARN should be exported as a variable to the command line.
    // This will be determined by your AWS configuration.
    const publishParams = {
      Message: `A batch for ${curricName} has been confirmed. ' +
       'Planned start date: ${startDate}`,
      TopicArn: process.env.SNS_TOPIC_ARN,
    };
    try {
      console.log("Here are the params\n", publishParams);
      await snsClient.send(new PublishCommand(publishParams));
      console.log("SNS published");
      responseBody.snsStatus = "Successful publish to SNS.";
    } catch (err) {
      responseBody.snsStatus = "Failed to publish to SNS.";
    }
    console.log(responseBody.snsStatus);
    console.log("Attempting to send email...");
    // SES
    // Read AWS documentation on SES sandboxing b/c it's severely handicapped
    // prior to production. Only emails configured by 2106RNCN are:
    // perfectpersonnelplacement@outlook.com for sending messages
    // perfectpersonnelplacement@gmail.com for receiving messages
    // DO NOT ATTEMPT TO USE GMAIL TO SEND. IT'S A BAD TIME. WE SPENT DAYS.
    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [trainerEmail],
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data:
              `A batch for ${curricName} has been confirmed. ` +
              `Planned start date: ${startDate}`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "New batch confirmed.",
        },
      },
      Source: "perfectpersonnelplacement@outlook.com",
    };
    try {
      await sesClient.send(new SendEmailCommand(params));
      responseBody.sesStatus = "Successfully sent email.";
    } catch (err) {
      responseBody.sesStatus = "Failed to send email.";
    }
    console.log(responseBody.sesStatus);

    return new HTTPResponse(200, responseBody);
  } else {
    return new HTTPResponse(400, "Batch unable to be confirmed");
  }
}
